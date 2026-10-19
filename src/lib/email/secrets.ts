import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/** Clave de 32 bytes representada en hexadecimal. Jamás persistir el enlace privado sin cifrar. */
function encryptionKey(): Buffer {
  const raw = process.env.EMAIL_LINK_ENCRYPTION_KEY;
  if (!raw || !/^[0-9a-f]{64}$/i.test(raw)) {
    throw new Error("EMAIL_LINK_ENCRYPTION_KEY debe ser hexadecimal de 32 bytes.");
  }
  return Buffer.from(raw, "hex");
}

export function requireEmailConfiguration(): void {
  encryptionKey();
  if (!process.env.RESEND_API_KEY?.trim() || !process.env.EMAIL_FROM?.trim()) {
    throw new Error("Configura RESEND_API_KEY y EMAIL_FROM para notificaciones de admisión.");
  }
}

export function sealTrackingCode(code: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(code, "utf8"), cipher.final()]);
  return Buffer.concat([iv, cipher.getAuthTag(), ciphertext]).toString("base64url");
}

export function openTrackingCode(value: string): string {
  const raw = Buffer.from(value, "base64url");
  if (raw.length < 29) throw new Error("Secreto cifrado inválido.");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(), raw.subarray(0, 12));
  decipher.setAuthTag(raw.subarray(12, 28));
  return Buffer.concat([decipher.update(raw.subarray(28)), decipher.final()]).toString("utf8");
}
