import Link from "next/link";
import type { AdmissionStatus } from "@/generated/prisma/client";
import { selectableStatuses, statusLabels } from "@/lib/admissions/status";
import { getDb } from "@/lib/db";
import ApplicationTable from "@/components/admin/ApplicationTable";

export const dynamic = "force-dynamic";
const PAGE_SIZE = 15;
export default async function ApplicationsPage({ searchParams }: { searchParams: Promise<{ estado?: string; q?: string; pagina?: string }> }) {
  const p = await searchParams;
  const status = selectableStatuses.includes(p.estado as AdmissionStatus) ? p.estado as AdmissionStatus : null;
  const q = typeof p.q === "string" ? p.q.trim().slice(0,100) : "";
  const requestedPage = Number(p.pagina);
  const page = Number.isSafeInteger(requestedPage) && requestedPage>0 ? Math.min(requestedPage,100000) : 1;
  const where = {
    ...(status ? { status } : {}),
    ...(q ? { OR: [{ fullName: { contains: q, mode: "insensitive" as const } }, { email: { contains: q, mode: "insensitive" as const } }, { program: { contains: q, mode: "insensitive" as const } }] } : {}),
  };
  const db = getDb();
  const [rows, total] = await Promise.all([
    db.admissionApplication.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page-1)*PAGE_SIZE, take: PAGE_SIZE, select: { id: true, fullName: true, email: true, program: true, semester: true, status: true, createdAt: true } }),
    db.admissionApplication.count({ where }),
  ]);
  const pageLink = (num: number) => `/admin/solicitudes?${new URLSearchParams({ ...(status ? { estado: status }:{}), ...(q ? { q }:{}), pagina: String(num) }).toString()}`;
  return <div className="adm-content"><div className="adm-topbar"><span className="adm-overline">WORKSPACE / ADMISIONES</span><Link href="/admin">← Volver al resumen</Link></div>
    <div className="adm-page-title"><span className="adm-overline">01 / GESTIÓN DE ASPIRANTES</span><h1>Solicitudes<span>.</span></h1><p>Busca, revisa y actualiza el estado de las postulaciones recibidas.</p></div>
    <section className="adm-panel"><form className="adm-filters" method="get"><label><span>Buscar por nombre, correo o programa</span><input name="q" type="search" defaultValue={q} placeholder="Buscar aspirante…" maxLength={100}/></label><label><span>Estado de admisión</span><select name="estado" defaultValue={status ?? ""}><option value="">Todos los estados</option>{selectableStatuses.map(item => <option key={item} value={item}>{statusLabels[item]}</option>)}</select></label><button type="submit" className="adm-primary">Filtrar ↗</button></form>
      <div className="adm-table-caption">{total} SOLICITUDES ENCONTRADAS</div><ApplicationTable rows={rows}/>
      <div className="adm-pagination"><span>Página {page} · {total} resultados</span><div>{page>1 && <Link href={pageLink(page-1)}>← Anterior</Link>}{page*PAGE_SIZE<total && <Link href={pageLink(page+1)}>Siguiente →</Link>}</div></div>
    </section></div>;
}
