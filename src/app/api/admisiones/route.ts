import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { validateAdmissionInput } from "@/lib/admissions/validation";
import { hashToken } from "@/lib/security/tokens";
import { getDb } from "@/lib/db";
import { sealTrackingCode, requireEmailConfiguration } from "@/lib/email/secrets";
import { dispatchAdmissionNotification } from "@/lib/email/dispatch";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json"))
    return NextResponse.json({ message: "El contenido debe ser JSON." }, { status: 415 });
  try {
    const raw = await request.text();
    if (raw.length > 4096) return NextResponse.json({ message: "Solicitud demasiado grande." }, { status: 413 });
    const payload: unknown = JSON.parse(raw);
    // Campo trampa, invisible para usuarios reales: no expone existencia del mecanismo.
    if (payload && typeof payload === "object" && "website" in payload && (payload as { website?: unknown }).website)
      return NextResponse.json({ message: "Solicitud recibida." }, { status: 202 });
    const result = validateAdmissionInput(payload);
    if (!result.ok) return NextResponse.json({ message: result.message }, { status: 422 });
    const trackingCode = randomBytes(32).toString("base64url");
    const { fullName, email, program, semester } = result.data;
    // Validar configuración antes de crear la solicitud: sin email no se promete confirmación.
    try { requireEmailConfiguration(); }
    catch {
      console.error("SYNAPSE: Servicio de correo sin configurar.");
      return NextResponse.json({ message: "El registro no está disponible temporalmente. Intenta más tarde." }, { status: 503 });
    }
    // Cola de salida y solicitud en una sola transacción: nunca se pierde el evento.
    const notificationId = await getDb().$transaction(async tx => {
      const application = await tx.admissionApplication.create({
        data: { fullName, email, program, semester, consentAt: new Date(), trackingHash: hashToken(trackingCode) },
      });
      const event = await tx.admissionStatusEvent.create({ data: { applicationId: application.id, toStatus: "PENDING" } });
      const notification = await tx.admissionEmailNotification.create({
        data: { statusEventId: event.id, encryptedTrackingCode: sealTrackingCode(trackingCode) },
      });
      return notification.id;
    });
    // Los errores del proveedor no anulan una solicitud ya confirmada en BD.
    let delivery: "sent" | "queued" | "skipped" = "queued";
    try { delivery = await dispatchAdmissionNotification(notificationId); }
    catch (error) { console.error("SYNAPSE: Falló el envío inmediato; la cola conservará la notificación", error); }
    return NextResponse.json({
      message: "Tu solicitud fue registrada correctamente.",
      trackingPath: `/seguimiento/${trackingCode}`,
      trackingCode,
      emailDelivery: delivery === "sent" ? "sent" : "queued",
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ message: "Este correo institucional ya tiene una solicitud registrada. Contacta al semillero si perdiste tu enlace de seguimiento." }, { status: 409 });
    console.error("Fallo interno en registro de admisión", error);
    return NextResponse.json({ message: "No fue posible registrar la solicitud. Intenta más tarde." }, { status: 500 });
  }
}
