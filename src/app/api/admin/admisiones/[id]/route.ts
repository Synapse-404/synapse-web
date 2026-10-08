import { NextResponse, type NextRequest } from "next/server";
import { getAdmin, isSameOrigin } from "@/lib/auth/session";
import { getDb } from "@/lib/db";
import { selectableStatuses } from "@/lib/admissions/status";
import type { AdmissionStatus } from "@/generated/prisma/client";

export const runtime = "nodejs";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  const admin = await getAdmin();
  if (!admin) return NextResponse.json({ message: "Sesión no autorizada." }, { status: 401 });
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ message: "Identificador inválido." }, { status: 400 });
  let input: unknown;
  try {
    const raw = await request.text();
    if (raw.length > 2048) return NextResponse.json({ message: "Datos excesivos." }, { status: 413 });
    input = JSON.parse(raw);
  } catch { return NextResponse.json({ message: "JSON inválido." }, { status: 400 }); }
  if (!input || typeof input !== "object") return NextResponse.json({ message: "Datos inválidos." }, { status: 400 });
  const { status, note } = input as { status?: unknown; note?: unknown };
  if (typeof status !== "string" || !selectableStatuses.includes(status as AdmissionStatus))
    return NextResponse.json({ message: "Estado no permitido." }, { status: 422 });
  if (note !== undefined && (typeof note !== "string" || note.trim().length > 500))
    return NextResponse.json({ message: "La nota no puede superar 500 caracteres." }, { status: 422 });
  const db = getDb();
  try {
    const changed = await db.$transaction(async tx => {
      const current = await tx.admissionApplication.findUnique({ where: { id }, select: { status: true } });
      if (!current) return "missing" as const;
      if (current.status === status) return "same" as const;
      // Compare-and-swap para evitar que dos revisores sobrescriban un cambio concurrente.
      const updated = await tx.admissionApplication.updateMany({ where: { id, status: current.status }, data: { status: status as AdmissionStatus, reviewedAt: new Date(), reviewedById: admin.id } });
      if (!updated.count) return "conflict" as const;
      await tx.admissionStatusEvent.create({ data: { applicationId: id, fromStatus: current.status, toStatus: status as AdmissionStatus, note: typeof note === "string" ? note.trim() || null : null, actorId: admin.id } });
      return "ok" as const;
    });
    if (changed === "missing") return NextResponse.json({ message: "Solicitud inexistente." }, { status: 404 });
    if (changed === "conflict") return NextResponse.json({ message: "La solicitud cambió durante tu revisión. Recarga la página." }, { status: 409 });
    if (changed === "same") return NextResponse.json({ message: "La solicitud ya tiene ese estado." }, { status: 409 });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error al cambiar estado de admisión", error);
    return NextResponse.json({ message: "No se pudo guardar el estado." }, { status: 500 });
  }
}
