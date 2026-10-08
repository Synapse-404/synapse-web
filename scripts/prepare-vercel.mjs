/**
 * Solo en Vercel Production: preparar schema y bootstrap del administrador.
 * Nunca altera bases durante builds locales o deployments Preview.
 *
 * El comando manual `pnpm exec tsx scripts/create-admin.ts` sigue disponible.
 */
import { execFileSync } from "node:child_process";

const env = process.env;

function execute(command, args) {
  execFileSync(command, args, {
    stdio: "inherit",
    env,
    cwd: process.cwd(),
    timeout: 120_000,
  });
}

if (env.VERCEL !== "1" || env.VERCEL_ENV !== "production") {
  console.log("[bootstrap] No es un build de producción en Vercel: sin cambios de base de datos.");
} else {
  if (!env.DATABASE_URL?.trim()) {
    throw new Error("[bootstrap] DATABASE_URL es obligatoria en Vercel Production.");
  }
  const hasEmail = Boolean(env.ADMIN_BOOTSTRAP_EMAIL?.trim());
  const hasPassword = Boolean(env.ADMIN_BOOTSTRAP_PASSWORD);
  if (hasEmail !== hasPassword) {
    throw new Error("[bootstrap] Configura ADMIN_BOOTSTRAP_EMAIL y ADMIN_BOOTSTRAP_PASSWORD juntas, o ninguna.");
  }
  const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
  console.log("[bootstrap] Aplicando migraciones versionadas de Prisma...");
  execute(pnpm, ["exec", "prisma", "migrate", "deploy"]);

  if (hasEmail && hasPassword) {
    console.log("[bootstrap] Creando administrador inicial si aún no existe...");
    execute(pnpm, ["exec", "tsx", "scripts/create-admin.ts"]);
  } else {
    console.log("[bootstrap] Credenciales de bootstrap no configuradas; se omite el alta del administrador.");
  }
}
