/** Mantener pequeño el pool por instancia evita agotar PostgreSQL en serverless. */
export function databasePoolSize(raw: string | undefined, inVercel: boolean): number {
  const fallback = inVercel ? 2 : 5;
  if (!raw) return fallback;
  const value = Number(raw);
  return Number.isSafeInteger(value) && value >= 1 && value <= 20 ? value : fallback;
}
