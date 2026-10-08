import { createHash } from "node:crypto";

/** One-way fingerprint: persiste únicamente el hash de los tokens de acceso. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
