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

  return <div className="portal-page portal-direct">
    <div className="portal-top content-width">
      <div className="portal-breadcrumb"><Link href="/">INICIO</Link><span>/</span><Link href="/seguimiento">ADMISIONES</Link><span>/</span><strong>MI ESTADO</strong></div>
      <div className="portal-hero-row"><div><span className="portal-overline"><span className="portal-led" /> CONSULTA PRIVADA</span><h1>Así va tu<br /><span>postulación.</span></h1></div><p>Consulta el resultado y los movimientos registrados por el equipo de coordinación del semillero.</p></div>
    </div>
    <div className="portal-content">
      <div className="portal-result-actions"><Link className="portal-back" href="/seguimiento">← Ir al portal de admisiones</Link><span>ENLACE DE ACCESO PRIVADO</span></div>
      <AdmissionProgress application={result}/>
      <div className="portal-private-warning">Conserva esta dirección en privado. Cualquier persona que posea el enlace puede consultar esta postulación. Para mayor privacidad, usa el portal con correo y código.</div>
    </div>
  </div>;
}
