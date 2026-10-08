import Link from "next/link";
import { getDb } from "@/lib/db";
import ApplicationTable from "@/components/admin/ApplicationTable";
import projects from "@/data/projects.json";
import publications from "@/data/publications.json";
import team from "@/data/team.json";

export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const db = getDb();
  // Dos consultas en paralelo en lugar de cuatro COUNT individuales y el listado.
  // No se cachean datos administrativos: cada visita obtiene valores actuales.
  const [byStatus, recent] = await Promise.all([
    db.admissionApplication.groupBy({ by: ["status"], _count: { _all: true } }),
    db.admissionApplication.findMany({ take: 6, orderBy: [{ createdAt: "desc" }, { id: "desc" }], select: { id: true, fullName: true, email: true, program: true, semester: true, status: true, createdAt: true } }),
  ]);
  const countFor = (status: string) => byStatus.find(row => row.status === status)?._count._all ?? 0;
  const total = byStatus.reduce((sum, row) => sum + row._count._all, 0);
  const pending = countFor("PENDING");
  const review = countFor("IN_REVIEW");
  const approved = countFor("APPROVED");
  const cards = [
    { label: "Postulaciones", value: total, note: "Solicitudes registradas", glyph: "↗" },
    { label: "Pendientes", value: pending, note: "Por revisar", glyph: "◷" },
    { label: "En evaluación", value: review, note: "En proceso", glyph: "◎" },
    { label: "Admitidos", value: approved, note: "Solicitudes aprobadas", glyph: "✳" },
  ];
  const counts = [
    { name: "Recibidas", count: pending }, { name: "En revisión", count: review }, { name: "Aprobadas", count: approved }, { name: "No admitidas", count: Math.max(0,total-pending-review-approved) },
  ];
  return <div className="adm-content"><div className="adm-topbar"><span className="adm-overline">WORKSPACE / RESUMEN GENERAL</span><span className="adm-topbar-live"><i/> PLATAFORMA ACTIVA</span></div>
    <section className="adm-welcome"><div><p className="adm-overline">SEMILLERO DE INVESTIGACIÓN · UNICLARETIANA</p><h1>El conocimiento,<br/><span>en movimiento.</span></h1><p>Una perspectiva clara de las postulaciones y la actividad de SYNAPSE.</p></div><div className="adm-welcome-mark">✳</div></section>
    <div className="adm-section-heading"><div><span className="adm-overline">01 / INDICADORES</span><h2>Admisiones</h2></div><Link href="/admin/solicitudes">Gestionar solicitudes <span>↗</span></Link></div>
    <div className="adm-stats">{cards.map((card, idx) => <article key={card.label} className={`adm-stat adm-stat-${idx}`}><span className="adm-stat-label">{card.label}<span>{card.glyph}</span></span><strong>{String(card.value).padStart(2,"0")}</strong><small>{card.note}</small></article>)}</div>
    <div className="adm-grid-two"><section className="adm-panel"><div className="adm-panel-top"><div><span className="adm-overline">DISTRIBUCIÓN / SOLICITUDES</span><h3>Flujo de admisión</h3></div><span>ESTADOS</span></div><div className="adm-bars">{counts.map((entry) => <div className="adm-bar-item" key={entry.name}><div><span>{entry.name}</span><strong>{entry.count}</strong></div><div className="adm-bar-track"><div style={{width:`${total===0?0:(entry.count/total)*100}%`}}/></div></div>)}</div></section>
    <section className="adm-panel adm-quick-panel"><span className="adm-overline">02 / ACTIVIDAD ACADÉMICA</span><h3>Contenido del semillero</h3><p>Información publicada actualmente en la web, disponible como referencia para la futura gestión editorial.</p><div className="adm-editorial-stats"><Link href="/proyectos">Proyectos <strong>{String(projects.length).padStart(2,"0")}</strong></Link><Link href="/publicaciones">Artículos <strong>{String(publications.length).padStart(2,"0")}</strong></Link><Link href="/equipo">Participantes <strong>{String(team.length).padStart(2,"0")}</strong></Link></div><Link href="/admin/contenidos" className="adm-text-link">Ver inventario editorial ↗</Link></section></div>
    <section className="adm-panel adm-latest"><div className="adm-panel-top"><div><span className="adm-overline">03 / ENTRADAS RECIENTES</span><h3>Últimas solicitudes</h3></div><Link href="/admin/solicitudes">Ver todas ↗</Link></div><ApplicationTable rows={recent}/></section>
  </div>;
}
