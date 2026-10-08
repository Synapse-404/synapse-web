import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { validateAdmissionInput } from "@/lib/admissions/validation";
import { hashToken } from "@/lib/security/tokens";
import { getDb } from "@/lib/db";

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
    await getDb().admissionApplication.create({
      data: {
        fullName, email, program, semester, consentAt: new Date(), trackingHash: hashToken(trackingCode),
        history: { create: { toStatus: "PENDING" } },
      },
    });
    return NextResponse.json({
      message: "Tu solicitud fue registrada correctamente.",
      trackingPath: `/seguimiento/${trackingCode}`,
      trackingCode,
    }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof SyntaxError) return NextResponse.json({ message: "JSON inválido." }, { status: 400 });
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002")
      return NextResponse.json({ message: "Este correo institucional ya tiene una solicitud registrada. Contacta al semillero si perdiste tu enlace de seguimiento." }, { status: 409 });
    console.error("Fallo interno en registro de admisión", error);
    return NextResponse.json({ message: "No fue posible registrar la solicitud. Intenta más tarde." }, { status: 500 });
  }
}
