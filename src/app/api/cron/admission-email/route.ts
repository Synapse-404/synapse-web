import { NextResponse, type NextRequest } from "next/server";
import { dispatchDueAdmissionNotifications } from "@/lib/email/dispatch";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Un CRON_SECRET obligatorio impide que terceros fuercen envíos desde un endpoint público. */
export async function GET(request: NextRequest) {
  if (!process.env.CRON_SECRET || request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: "No autorizado." }, { status: 401 });
  }
  try {
    const result = await dispatchDueAdmissionNotifications(15);
    return NextResponse.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Error al procesar la cola de correos SYNAPSE", error);
    return NextResponse.json({ message: "No se pudo procesar la cola de mensajes." }, { status: 500 });
  }
}
