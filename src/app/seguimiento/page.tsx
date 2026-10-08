import type { Metadata } from "next";
import Link from "next/link";
import TrackingLookup from "@/components/admissions/TrackingLookup";

export const metadata: Metadata = {
  title: "Consulta el estado de tu admisión",
  description: "Portal de seguimiento de admisiones al semillero de investigación SYNAPSE.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function AdmissionPortalPage() {
  return <div className="portal-page">
    <div className="portal-top content-width">
      <div className="portal-breadcrumb"><Link href="/">INICIO</Link><span>/</span><span>ADMISIONES</span><span>/</span><strong>SEGUIMIENTO</strong></div>
      <div className="portal-hero-row"><div>
        <div className="portal-overline"><span className="portal-led" /> PORTAL DE ASPIRANTES · UNICLARETIANA</div>
        <h1>Tu próximo paso<br /><span>comienza aquí.</span></h1>
      </div><p>Un espacio para conocer el avance de tu postulación, revisar las etapas del proceso y consultar la decisión de admisión al semillero de investigación.</p></div>
    </div>
    <TrackingLookup />
  </div>;
}
