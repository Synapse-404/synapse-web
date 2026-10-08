import "server-only";
import { randomBytes } from "node:crypto";
import { hashToken } from "@/lib/security/tokens";
import { cookies } from "next/headers";
import { cache } from "react";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";

export const SESSION_COOKIE = "synapse_admin_session";
export const SESSION_SECONDS = 60 * 60 * 24 * 7;

export async function createAdminSession(adminId: string) {
  const token = randomBytes(32).toString("base64url");
  const db = getDb();
  await db.adminSession.create({ data: { adminId, tokenHash: hashToken(token), expiresAt: new Date(Date.now() + SESSION_SECONDS * 1000) } });
  return token;
}

export const sessionCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const,
  path: "/", maxAge: SESSION_SECONDS,
};

export const getAdmin = cache(async function getAdmin() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || token.length > 100) return null;
  const session = await getDb().adminSession.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { admin: { select: { id: true, email: true, fullName: true, isActive: true } } },
  });
  if (!session || session.expiresAt <= new Date() || !session.admin.isActive) return null;
  return session.admin;
});

export async function requireAdmin() {
  const user = await getAdmin();
  if (!user) redirect("/admin/login");
  return user;
}

export function isSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true; // Clients without Origin still need valid credentials / authorization.
  const target = new URL(request.url);
  const allowed = new Set([target.origin, ...(process.env.SITE_URL ? [new URL(process.env.SITE_URL).origin] : [])]);
  return allowed.has(origin);
}
