import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForDb = globalThis as unknown as { synapsePrisma?: PrismaClient };

export function getDb(): PrismaClient {
  if (globalForDb.synapsePrisma) return globalForDb.synapsePrisma;
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL no está configurada.");
  const adapter = new PrismaPg({ connectionString, max: 5, connectionTimeoutMillis: 5000 });
  const client = new PrismaClient({ adapter, log: ["error"] });
  globalForDb.synapsePrisma = client;
  return client;
}
