import Link from "next/link";
import type { AdmissionStatus } from "@/generated/prisma/client";
import StatusBadge from "@/components/admin/StatusBadge";

type Row = { id: string; fullName: string; email: string; program: string; semester: number; status: AdmissionStatus; createdAt: Date };
export default function ApplicationTable({ rows }: { rows: Row[] }) {
  if (!rows.length) return <div className="adm-empty">No se encontraron solicitudes para mostrar.</div>;
  return <div className="adm-table-scroll"><table className="adm-table"><thead><tr><th>ASPIRANTE</th><th>PROGRAMA</th><th>SEM.</th><th>FECHA</th><th>ESTADO</th><th aria-label="Acciones"/></tr></thead><tbody>{rows.map(row => <tr key={row.id}><td><b>{row.fullName}</b><small>{row.email}</small></td><td>{row.program}</td><td>{String(row.semester).padStart(2, "0")}</td><td>{row.createdAt.toLocaleDateString("es-CO", { dateStyle: "medium", timeZone: "America/Bogota" })}</td><td><StatusBadge status={row.status}/></td><td><Link className="adm-row-link" href={`/admin/solicitudes/${row.id}`} aria-label={`Revisar solicitud de ${row.fullName}`}>↗</Link></td></tr>)}</tbody></table></div>;
}
