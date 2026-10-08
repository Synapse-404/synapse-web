import { normalizeInstitutionEmail } from "./validation.ts";

/** Un código privado generado con randomBytes(32) y codificado como base64url. */
const TRACKING_CODE = /^[A-Za-z0-9_-]{43}$/;

/** Acepta el código puro o un enlace /seguimiento/<código> compartido anteriormente. */
export function extractTrackingCode(input: string): string | null {
  const value = input.trim();
  if (TRACKING_CODE.test(value)) return value;
  if (value.length > 2048) return null;
  try {
    const url = new URL(value, "https://synapse.invalid");
    if (!(["http:", "https:"].includes(url.protocol))) return null;
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "seguimiento" && TRACKING_CODE.test(parts[1])) {
      return parts[1];
    }
  } catch { /* La entrada no es un enlace aceptado. */ }
  return null;
}

export type TrackingCredentials = { email: string; trackingCode: string };

export function validateTrackingCredentials(input: unknown): TrackingCredentials | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const body = input as Record<string, unknown>;
  if (typeof body.email !== "string" || typeof body.trackingCode !== "string") return null;
  const email = normalizeInstitutionEmail(body.email);
  const trackingCode = extractTrackingCode(body.trackingCode);
  return email && trackingCode ? { email, trackingCode } : null;
}
