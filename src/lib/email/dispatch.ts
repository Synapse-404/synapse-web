import "server-only";
import { getDb } from "@/lib/db";
import { renderAdmissionEmail, PUBLIC_SITE_URL } from "./admission-template";
import { openTrackingCode, requireEmailConfiguration } from "./secrets";

/** La inserción ocurre dentro de la misma transacción que el cambio de estado.
 * El dispatcher reclama atómicamente cada notificación y confirma el envío por API.
 */
const MAX_ATTEMPTS = 8;

export type DeliveryResult = "sent" | "queued" | "skipped";

export async function dispatchAdmissionNotification(id: string): Promise<DeliveryResult> {
  const db = getDb();
  const now = new Date();
  const claimed = await db.admissionEmailNotification.updateMany({
    where: {
      id,
      OR: [
        { state: "PENDING", nextAttemptAt: { lte: now } },
        { state: "SENDING", lockedUntil: { lte: now } },
      ],
    },
    data: { state: "SENDING", attempts: { increment: 1 }, lockedUntil: new Date(now.getTime() + 120_000) },
  });
  if (claimed.count === 0) return "skipped";

  try {
    requireEmailConfiguration();
    const notification = await db.admissionEmailNotification.findUniqueOrThrow({
      where: { id },
      include: { event: { include: { application: true } } },
    });
    const application = notification.event.application;
    const trackingUrl = notification.encryptedTrackingCode
      ? `${PUBLIC_SITE_URL}/seguimiento/${openTrackingCode(notification.encryptedTrackingCode)}`
      : `${PUBLIC_SITE_URL}/seguimiento`;
    const rendered = renderAdmissionEmail({
      fullName: application.fullName,
      program: application.program,
      status: notification.event.toStatus,
      trackingUrl,
    });
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9_000);
    let response: Response;
    try {
      response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: controller.signal,
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
          "Idempotency-Key": `synapse-admission-${id}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM,
          to: [application.email],
          ...(process.env.EMAIL_REPLY_TO?.trim() ? { reply_to: process.env.EMAIL_REPLY_TO.trim() } : {}),
          subject: rendered.subject,
          html: rendered.html,
          text: rendered.text,
        }),
      });
    } finally {
      clearTimeout(timeout);
    }
    // Los errores del proveedor no se registran completos para no filtrar PII o secretos.
    if (!response.ok) throw new Error(`Resend respondió HTTP ${response.status}`);
    const payload: unknown = await response.json();
    const messageId = payload && typeof payload === "object" && "id" in payload && typeof payload.id === "string" ? payload.id : null;
    await db.admissionEmailNotification.update({
      where: { id },
      data: { state: "SENT", sentAt: new Date(), encryptedTrackingCode: null, providerMessageId: messageId, lastError: null, lockedUntil: null },
    });
    return "sent";
  } catch (error) {
    const current = await db.admissionEmailNotification.findUnique({ where: { id }, select: { attempts: true } });
    const attempts = current?.attempts ?? MAX_ATTEMPTS;
    const permanentlyFailed = attempts >= MAX_ATTEMPTS;
    const backoffMinutes = Math.min(360, Math.pow(2, Math.max(0, attempts - 1)));
    try {
      await db.admissionEmailNotification.update({
        where: { id },
        data: {
          state: permanentlyFailed ? "FAILED" : "PENDING",
          lockedUntil: null,
          nextAttemptAt: new Date(Date.now() + backoffMinutes * 60_000),
          lastError: error instanceof Error ? error.message.slice(0, 250) : "Error desconocido de entrega.",
        },
      });
    } catch (updateError) {
      console.error("SYNAPSE: No fue posible registrar un intento de notificación", id, updateError);
    }
    console.error("SYNAPSE: Correo pendiente de reintento", id, error instanceof Error ? error.message : "Error desconocido");
    return "queued";
  }
}

export async function dispatchDueAdmissionNotifications(batchSize = 20) {
  const db = getDb();
  const now = new Date();
  const jobs = await db.admissionEmailNotification.findMany({
    where: { OR: [{ state: "PENDING", nextAttemptAt: { lte: now } }, { state: "SENDING", lockedUntil: { lte: now } }] },
    select: { id: true },
    orderBy: { createdAt: "asc" },
    take: Math.max(1, Math.min(50, batchSize)),
  });
  let sent = 0;
  let queued = 0;
  // 3 envíos concurrentes por lote para respetar límites de ejecución de Vercel.
  for (let index = 0; index < jobs.length; index += 3) {
    const batch = jobs.slice(index, index + 3);
    const results = await Promise.allSettled(batch.map(job => dispatchAdmissionNotification(job.id)));
    for (const result of results) {
      if (result.status === "fulfilled" && result.value === "sent") sent++;
      else if (result.status === "rejected" || (result.status === "fulfilled" && result.value === "queued")) queued++;
    }
  }
  return { processed: jobs.length, sent, queued };
}
