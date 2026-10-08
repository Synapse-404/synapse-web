/** Ejecutar: pnpm exec tsx scripts/create-admin.ts */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

async function main() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_BOOTSTRAP_PASSWORD;
  const name = process.env.ADMIN_BOOTSTRAP_NAME?.trim() || "Coordinación SYNAPSE";
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL no definida.");
  if (!email || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@miuniclaretiana\.edu\.co$/.test(email)) throw new Error("ADMIN_BOOTSTRAP_EMAIL debe ser institucional.");
  if (!password || password.length < 12) throw new Error("ADMIN_BOOTSTRAP_PASSWORD debe tener al menos 12 caracteres.");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const existing = await prisma.adminUser.findUnique({ where: { email } });
    if (existing) throw new Error("Ya existe ese administrador. No se sobrescribirán sus credenciales.");
    await prisma.adminUser.create({ data: { email, fullName: name, passwordHash: await hashPassword(password) } });
    console.log(`Administrador creado correctamente: ${email}`);
  } finally { await prisma.$disconnect(); }
}
main().catch((error: unknown) => { console.error(error); process.exitCode=1; });
