/** Dominios exactos autorizados por Uniclaretiana para vinculaciones. */
export const INSTITUTION_DOMAINS = ["miuniclaretiana.edu.co", "uniclaretiana.edu.co"] as const;
export const EMAIL_HINT = "nombre@miuniclaretiana.edu.co";
export const INSTITUTION_EMAIL_HELP = "Estudiantes: @miuniclaretiana.edu.co · Docentes y administrativos: @uniclaretiana.edu.co";
export const INSTITUTION_EMAIL_ERROR = "Solo se permiten correos @miuniclaretiana.edu.co o @uniclaretiana.edu.co.";

/** Tipo de vinculación inferido exclusivamente del dominio verificado. */
export function getInstitutionalApplicantType(email: string): "student" | "staff" | null {
  const normalized = normalizeInstitutionEmail(email);
  if (!normalized) return null;
  return normalized.endsWith(`@${INSTITUTION_DOMAINS[0]}`) ? "student" : "staff";
}

export type AdmissionInput = {
  fullName: string;
  email: string;
  program: string;
  semester: number | null;
  consent: true;
};

type ValidationResult = { ok: true; data: AdmissionInput } | { ok: false; message: string };
const emailSyntax = /^[a-z0-9][a-z0-9.!#$%&'*+/=?^_`{|}~-]*@[a-z0-9.-]+$/i;

export function normalizeInstitutionEmail(email: string): string | null {
  const value = email.trim().toLowerCase();
  if (value.length > 254 || !emailSyntax.test(value)) return null;
  const segments = value.split("@");
  if (segments.length !== 2 || !INSTITUTION_DOMAINS.some(domain => segments[1] === domain)) return null;
  if (segments[0].length > 64 || segments[0].startsWith(".") || segments[0].endsWith(".") || segments[0].includes("..")) return null;
  return value;
}

export function validateAdmissionInput(input: unknown): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) return { ok: false, message: "Formulario inválido." };
  const raw = input as Record<string, unknown>;
  if (typeof raw.fullName !== "string" || typeof raw.program !== "string" || typeof raw.email !== "string")
    return { ok: false, message: "Completa todos los campos obligatorios." };
  const fullName = raw.fullName.trim().replace(/\s+/g, " ");
  const program = raw.program.trim().replace(/\s+/g, " ");
  const email = normalizeInstitutionEmail(raw.email);
  const student = email !== null && getInstitutionalApplicantType(email) === "student";
  // Personal docente o administrativo no cursa semestre: guardar NULL, no un número ficticio.
  const semester = student
    ? (typeof raw.semester === "number" ? raw.semester : typeof raw.semester === "string" && raw.semester.trim() !== "" ? Number(raw.semester) : NaN)
    : null;
  if (fullName.length < 5 || fullName.length > 120) return { ok: false, message: "Ingresa tu nombre completo (5 a 120 caracteres)." };
  if (program.length < 3 || program.length > 120) return { ok: false, message: "Ingresa un programa académico o dependencia institucional válida." };
  if (!email) return { ok: false, message: INSTITUTION_EMAIL_ERROR };
  if (student && (semester === null || !Number.isInteger(semester) || semester < 1 || semester > 10)) return { ok: false, message: "El semestre debe estar entre 1 y 10." };
  if (raw.consent !== true) return { ok: false, message: "Debes autorizar el tratamiento de los datos de tu solicitud." };
  return { ok: true, data: { fullName, email, program, semester, consent: true } };
}
