import type { AdmissionStatus } from "@/generated/prisma/client";

/** Datos mínimos que la persona puede ver. No exponer notas internas del comité. */
export type PublicAdmissionResult = {
  fullName: string;
  program: string;
  semester: number;
  status: AdmissionStatus;
  submittedAt: string;
  updatedAt: string;
  history: Array<{ status: AdmissionStatus; at: string }>;
};
