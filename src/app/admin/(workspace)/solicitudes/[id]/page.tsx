import { notFound } from "next/navigation";
import Link from "next/link";
import { getDb } from "@/lib/db";
import StatusBadge from "@/components/admin/StatusBadge";
import StatusEditor from "@/components/admin/StatusEditor";
import { statusLabels } from "@/lib/admissions/status";

export const dynamic = "force-dynamic";
export default async function ApplicationDetailPage({params}:{params:Promise<{id:string}>}) {
  const { id }=await params;
  if(!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const row = await getDb().admissionApplication.findUnique({where:{id},include:{history:{orderBy:{createdAt:"desc"},include:{actor:{select:{fullName:true}}}}}});
  if(!row) notFound();
  return <div className="adm-content"><div className="adm-topbar"><span className="adm-overline">WORKSPACE / REVISIÓN</span><Link href="/admin/solicitudes">← Volver a solicitudes</Link></div><div className="adm-page-title"><span className="adm-overline">SOLICITUD DE VINCULACIÓN</span><h1>{row.fullName}<span>.</span></h1><StatusBadge status={row.status}/></div>
    <div className="adm-detail-grid"><section className="adm-panel"><span className="adm-overline">DATOS DE POSTULACIÓN</span><h3>Información del aspirante</h3><dl className="adm-details"><div><dt>Nombre completo</dt><dd>{row.fullName}</dd></div><div><dt>Correo institucional</dt><dd>{row.email}</dd></div><div><dt>Programa académico</dt><dd>{row.program}</dd></div><div><dt>Semestre actual</dt><dd>{row.semester}</dd></div><div><dt>Fecha de registro</dt><dd>{row.createdAt.toLocaleString("es-CO",{dateStyle:"long",timeStyle:"short",timeZone:"America/Bogota"})}</dd></div><div><dt>Autorización de datos</dt><dd>{row.consentAt.toLocaleDateString("es-CO",{dateStyle:"long",timeZone:"America/Bogota"})}</dd></div></dl></section>
      <section className="adm-panel"><span className="adm-overline">EVALUACIÓN DE ADMISIÓN</span><h3>Actualizar estado</h3><StatusEditor id={row.id} current={row.status}/></section></div>
    <section className="adm-panel"><span className="adm-overline">AUDITORÍA / DECISIONES</span><h3>Historial de cambios</h3><div className="adm-history">{row.history.map(entry=><div className="adm-history-row" key={entry.id}><div><strong>{statusLabels[entry.toStatus]}</strong><small>{entry.actor?.fullName ?? "Sistema"} · {entry.createdAt.toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short",timeZone:"America/Bogota"})}</small>{entry.note && <p>{entry.note}</p>}</div><span>↗</span></div>)}</div></section></div>;
}
