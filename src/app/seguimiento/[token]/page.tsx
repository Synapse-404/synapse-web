import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdmissionProgress from "@/components/admissions/AdmissionProgress";
import { extractTrackingCode } from "@/lib/admissions/tracking";
import { hashToken } from "@/lib/security/tokens";
import { getDb } from "@/lib/db";
import type { PublicAdmissionResult } from "@/lib/admissions/tracking-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Estado de admisión",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

/** Compatibilidad: sigue funcionando el enlace privado emitido en versiones anteriores. */
export default async function TrackingPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  if (extractTrackingCode(token) !== token) notFound();
  const application = await getDb().admissionApplication.findUnique({
    where: { trackingHash: hashToken(token) },
    select: {
      fullName: true, program: true, semester: true, status: true,
      createdAt: true, updatedAt: true,
      history: { select: { toStatus: true, createdAt: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!application) notFound();

  const result: PublicAdmissionResult = {
    fullName: application.fullName,
    program: application.program,
    semester: application.semester,
    status: application.status,
    submittedAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    history: application.history.map(event => ({ status: event.toStatus, at: event.createdAt.toISOString() })),
  };

  return <div className="portal-page portal-v2 portal-direct">
    <section className="portal-top portal-v2-intro portal-v2-intro-direct">
      <div className="portal-v2-ambient" aria-hidden="true"><span className="portal-v2-orbit portal-v2-orbit-one"/><span className="portal-v2-orbit portal-v2-orbit-two"/><span className="portal-v2-core">S<span>↗</span></span></div>
      <div className="portal-v2-hero-container content-width">
        <div className="portal-breadcrumb"><Link href="/">SYNAPSE</Link><span>/</span><Link href="/seguimiento">ADMISIONES</Link><span>/</span><strong>MI ESTADO</strong></div>
        <div className="portal-v2-hero-copy"><span className="portal-overline"><span className="portal-led" /> CONSULTA PRIVADA</span><h1>Así va tu<br /><em>postulación.</em></h1><p>Consulta la decisión y cada movimiento registrado por el equipo de coordinación del semillero.</p></div>
        <div className="portal-v2-hero-bottom"><span>ESTADO ACTUAL</span><span>HISTORIAL</span><span>UNICLARETIANA · CHOCÓ</span></div>
      </div>
    </section>
    <div className="portal-content portal-v2-body">
      <div className="portal-result-actions"><Link className="portal-back" href="/seguimiento">← Ir al portal de admisiones</Link><span>ENLACE DE ACCESO PRIVADO</span></div>
      <AdmissionProgress application={result}/>
      <div className="portal-private-warning">Conserva esta dirección en privado. Cualquier persona que posea el enlace puede consultar esta postulación. Para mayor privacidad, usa el portal con correo y código.</div>
    </div>
  </div>;
}
