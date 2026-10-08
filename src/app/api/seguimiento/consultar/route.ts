import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { validateTrackingCredentials } from "@/lib/admissions/tracking";
import { hashToken } from "@/lib/security/tokens";
import type { PublicAdmissionResult } from "@/lib/admissions/tracking-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

function reply(payload: unknown, status: number) {
  return NextResponse.json(payload, { status, headers: privateHeaders });
}

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return reply({ message: "Debes enviar los datos en formato JSON." }, 415);
  }

  try {
    const raw = await request.text();
    if (raw.length > 3072) return reply({ message: "La solicitud supera el tamaño permitido." }, 413);
    const parsed: unknown = JSON.parse(raw);
    const credentials = validateTrackingCredentials(parsed);
    if (!credentials) return reply({ message: "Ingresa un correo institucional y un código de seguimiento válido." }, 422);

    // Consulta doble: nunca basta con introducir un correo; exige el secreto aleatorio.
    const application = await getDb().admissionApplication.findFirst({
      where: { trackingHash: hashToken(credentials.trackingCode), email: credentials.email },
      select: {
        fullName: true, program: true, semester: true, status: true,
        createdAt: true, updatedAt: true,
        history: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: "asc" } },
      },
    });

    if (!application) return reply({ message: "No encontramos una solicitud con esos datos. Verifica el correo y el código." }, 404);

    const result: PublicAdmissionResult = {
      fullName: application.fullName,
      program: application.program,
      semester: application.semester,
      status: application.status,
      submittedAt: application.createdAt.toISOString(),
      updatedAt: application.updatedAt.toISOString(),
      history: application.history.map(event => ({ status: event.toStatus, at: event.createdAt.toISOString() })),
    };
    return reply({ application: result }, 200);
  } catch (error) {
    if (error instanceof SyntaxError) return reply({ message: "Datos JSON inválidos." }, 400);
    console.error("No fue posible consultar el estado de la postulación", error);
    return reply({ message: "No podemos consultar tu solicitud en este momento. Intenta más tarde." }, 500);
  }
}
