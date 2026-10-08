import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";
import { databasePoolSize } from "@/lib/db-pool";

/** Singleton por instancia Node.js. No ofrece un pool global entre instancias de Vercel. */
const globalForDb = globalThis as unknown as { synapsePrisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (globalForDb.synapsePrisma) return globalForDb.synapsePrisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL no está configurada.");

  const adapter = new PrismaPg({
    connectionString,
    max: databasePoolSize(process.env.DATABASE_POOL_MAX, process.env.VERCEL === "1"),
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    keepAlive: true,
  });
  const client = new PrismaClient({ adapter, log: ["error"] });
  globalForDb.synapsePrisma = client;
  return client;
}
