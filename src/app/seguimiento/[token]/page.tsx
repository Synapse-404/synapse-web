import { createSeoMetadata } from "@/lib/seo";
import { hashToken } from "@/lib/security/tokens";
import { getDb } from "@/lib/db";
import { statusLabels, statusDescriptions } from "@/lib/admissions/status";
import { notFound } from "next/navigation";
import Link from "next/link";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata = { ...createSeoMetadata({ title: "Estado de admisión", path: "/seguimiento" }), robots: { index: false, follow: false } };

export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (!/^[A-Za-z0-9_-]{43}$/.test(token)) notFound();
  const application = await getDb().admissionApplication.findUnique({
    where: { trackingHash: hashToken(token) },
    select: { fullName: true, program: true, status: true, createdAt: true, history: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: "asc" } } },
  });
  if (!application) notFound();
  return <section className="tracking-shell"><div className="tracking-card">
    <span className="tracking-kicker">SYNAPSE / ADMISIONES</span>
    <h1>Tu solicitud, <span style={{color:"#F5A800"}}>en seguimiento.</span></h1>
    <span className="tracking-status">{statusLabels[application.status]}</span>
    <p className="tracking-description">{statusDescriptions[application.status]}</p>
    <div className="tracking-meta"><div>SOLICITANTE<b>{application.fullName}</b></div><div>PROGRAMA<b>{application.program}</b></div><div>FECHA DE SOLICITUD<b>{application.createdAt.toLocaleDateString("es-CO", { dateStyle: "long", timeZone: "America/Bogota" })}</b></div><div>ESTADO ACTUAL<b>{statusLabels[application.status]}</b></div></div>
    <span className="tracking-kicker">HISTORIAL DE ADMISIÓN</span>
    <ol className="tracking-timeline">{application.history.map((item, i) => <li key={i}>{statusLabels[item.toStatus]}<span>{item.createdAt.toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short", timeZone: "America/Bogota" })}</span></li>)}</ol>
    <p className="tracking-description">Conserva esta dirección en privado: el enlace permite consultar el estado de la solicitud.</p>
    <Link href="/" className="tracking-link">← Volver a SYNAPSE</Link>
  </div></section>;
}
