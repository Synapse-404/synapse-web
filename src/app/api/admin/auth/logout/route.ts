import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { SESSION_COOKIE, isSameOrigin } from "@/lib/auth/session";
import { hashToken } from "@/lib/security/tokens";

export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (token) {
    try { await getDb().adminSession.deleteMany({ where: { tokenHash: hashToken(token) } }); }
    catch (error) { console.error("No fue posible invalidar sesión", error); return NextResponse.json({ message: "Error al cerrar sesión." }, { status: 503 }); }
  }
  const response = NextResponse.redirect(new URL("/admin/login", request.url), 303);
  response.cookies.set(SESSION_COOKIE, "", { path: "/", httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", maxAge: 0 });
  return response;
}
