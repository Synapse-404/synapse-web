import { NextResponse, type NextRequest } from "next/server";
import { getDb } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createAdminSession, SESSION_COOKIE, sessionCookieOptions, isSameOrigin } from "@/lib/auth/session";

export const runtime = "nodejs";
const LOCK_MINUTES = 15;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ message: "Origen no autorizado." }, { status: 403 });
  const content = await request.text();
  if (content.length > 2048) return NextResponse.json({ message: "Solicitud inválida." }, { status: 413 });
  let raw: unknown;
  try { raw = JSON.parse(content); } catch { return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 }); }
  if (!raw || typeof raw !== "object") return NextResponse.json({ message: "Solicitud inválida." }, { status: 400 });
  const { email, password } = raw as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string" || email.length > 254 || password.length > 1024)
    return NextResponse.json({ message: "Credenciales incorrectas." }, { status: 401 });
  const db = getDb();
  try {
    const admin = await db.adminUser.findUnique({ where: { email: email.trim().toLowerCase() } });
    if (!admin || !admin.isActive || (admin.lockedUntil && admin.lockedUntil > new Date())) {
      return NextResponse.json({ message: "Credenciales incorrectas o acceso temporalmente bloqueado." }, { status: 401 });
    }
    if (!(await verifyPassword(password, admin.passwordHash))) {
      const attempts = admin.failedAttempts + 1;
      await db.adminUser.update({ where: { id: admin.id }, data: { failedAttempts: attempts >= 5 ? 0 : attempts, lockedUntil: attempts >= 5 ? new Date(Date.now() + LOCK_MINUTES * 60000) : null } });
      return NextResponse.json({ message: "Credenciales incorrectas o acceso temporalmente bloqueado." }, { status: 401 });
    }
    await db.adminUser.update({ where: { id: admin.id }, data: { failedAttempts: 0, lockedUntil: null } });
    const token = await createAdminSession(admin.id);
    const response = NextResponse.json({ ok: true, redirectTo: "/admin" });
    response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Error de autenticación administrativa", error);
    return NextResponse.json({ message: "Servicio temporalmente no disponible." }, { status: 503 });
  }
}
