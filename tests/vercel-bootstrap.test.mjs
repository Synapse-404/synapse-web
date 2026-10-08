import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, chmodSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const entry = fileURLToPath(new URL("../scripts/prepare-vercel.mjs", import.meta.url));

function invoke(overrides, pathPrefix) {
  const env = { ...process.env, VERCEL: "", VERCEL_ENV: "", DATABASE_URL: "", ADMIN_BOOTSTRAP_EMAIL: "", ADMIN_BOOTSTRAP_PASSWORD: "", ...overrides };
  if (pathPrefix) env.PATH = `${pathPrefix}:${env.PATH}`;
  return spawnSync(process.execPath, [entry], { cwd: root, env, encoding: "utf8", timeout: 2000 });
}

test("build local y preview no ejecutan operaciones sobre PostgreSQL", () => {
  const local = invoke({ VERCEL: "" });
  assert.equal(local.status, 0);
  assert.match(local.stdout, /sin cambios de base de datos/);
  const preview = invoke({ VERCEL: "1", VERCEL_ENV: "preview" });
  assert.equal(preview.status, 0);
  assert.match(preview.stdout, /sin cambios de base de datos/);
});

test("producción falla sin DATABASE_URL antes de llamar a Prisma", () => {
  const result = invoke({ VERCEL: "1", VERCEL_ENV: "production" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /DATABASE_URL es obligatoria/);
});

test("producción rechaza credenciales de bootstrap incompletas", () => {
  const result = invoke({ VERCEL: "1", VERCEL_ENV: "production", DATABASE_URL: "postgresql://example", ADMIN_BOOTSTRAP_EMAIL: "admin@miuniclaretiana.edu.co" });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /juntas, o ninguna/);
});

test("producción ordena migrate deploy antes de create-admin y puede omitir el seed", () => {
  const tmp = mkdtempSync(join(tmpdir(), "synapse-bootstrap-"));
  try {
    const fakePnpm = join(tmp, "pnpm");
    const calls = join(tmp, "calls.txt");
    writeFileSync(fakePnpm, `#!/bin/sh\nprintf '%s\\n' "$*" >> '${calls}'\n`);
    chmodSync(fakePnpm, 0o755);
    let result = invoke({ VERCEL: "1", VERCEL_ENV: "production", DATABASE_URL: "postgresql://example", ADMIN_BOOTSTRAP_EMAIL: "admin@miuniclaretiana.edu.co", ADMIN_BOOTSTRAP_PASSWORD: "some-long-test-secret" }, tmp);
    assert.equal(result.status, 0, result.stderr);
    assert.deepEqual(readFileSync(calls, "utf8").trim().split("\n"), ["exec prisma migrate deploy", "exec tsx scripts/create-admin.ts"]);

    writeFileSync(calls, "");
    result = invoke({ VERCEL: "1", VERCEL_ENV: "production", DATABASE_URL: "postgresql://example" }, tmp);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(readFileSync(calls, "utf8").trim(), "exec prisma migrate deploy");
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
