import { randomBytes, scrypt as callbackScrypt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
const scrypt = promisify(callbackScrypt);

export async function hashPassword(value: string): Promise<string> {
  if (value.length < 12) throw new Error("La contraseña debe tener al menos 12 caracteres.");
  const salt = randomBytes(24).toString("hex");
  const hash = (await scrypt(value, salt, 64)) as Buffer;
  return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(value: string, stored: string): Promise<boolean> {
  const [algorithm, salt, hex] = stored.split(":");
  if (algorithm !== "scrypt" || !salt || !hex || !/^[a-f0-9]{128}$/.test(hex)) return false;
  const expected = Buffer.from(hex, "hex");
  const actual = (await scrypt(value, salt, expected.length)) as Buffer;
  return timingSafeEqual(actual, expected);
}
