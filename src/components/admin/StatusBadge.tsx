import type { AdmissionStatus } from "@/generated/prisma/client";
import { statusLabels } from "@/lib/admissions/status";

export default function StatusBadge({ status }: { status: AdmissionStatus }) {
  return <span className={`adm-status adm-status-${status.toLowerCase()}`}><span aria-hidden="true" className="adm-status-dot" />{statusLabels[status]}</span>;
}
