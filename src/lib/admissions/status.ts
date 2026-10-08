import type { AdmissionStatus } from "@/generated/prisma/client";

export const statusLabels: Record<AdmissionStatus, string> = {
  PENDING: "Recibida",
  IN_REVIEW: "En revisión",
  APPROVED: "Aprobada",
  REJECTED: "No admitida",
};
export const statusDescriptions: Record<AdmissionStatus, string> = {
  PENDING: "Recibimos tu solicitud y está pendiente de revisión por el equipo.",
  IN_REVIEW: "El equipo está revisando tu postulación.",
  APPROVED: "Tu solicitud fue aprobada. El equipo de SYNAPSE te indicará los siguientes pasos.",
  REJECTED: "La solicitud no fue aprobada en esta convocatoria. Puedes contactar al semillero si necesitas información.",
};
export const selectableStatuses: AdmissionStatus[] = ["PENDING", "IN_REVIEW", "APPROVED", "REJECTED"];
