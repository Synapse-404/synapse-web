import type { Metadata } from "next";
import Link from "next/link";
import TrackingLookup from "@/components/admissions/TrackingLookup";

export const metadata: Metadata = {
  title: "Consulta el estado de tu admisión",
  description: "Consulta de forma privada y segura el estado de tu postulación al semillero SYNAPSE de Uniclaretiana.",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

export default function AdmissionPortalPage() {
  return (
    <div className="portal-page portal-v2">
      <section className="portal-top portal-v2-intro">
        <div className="portal-v2-ambient" aria-hidden="true"><span className="portal-v2-orbit portal-v2-orbit-one"/><span className="portal-v2-orbit portal-v2-orbit-two"/><span className="portal-v2-core">S<span>↗</span></span></div>
        <div className="portal-v2-hero-container content-width">
          <div className="portal-breadcrumb"><Link href="/">SYNAPSE</Link><span>/</span><strong>PORTAL DE ASPIRANTES</strong></div>
          <div className="portal-v2-hero-copy">
            <div className="portal-overline"><span className="portal-led"/> ESTADO ACTUALIZADO POR COORDINACIÓN</div>
            <h1>El siguiente<br/>paso es <em>tuyo.</em></h1>
            <p>Consulta en un solo lugar el estado de tu solicitud para formar parte del semillero de investigación SYNAPSE.</p>
            <a href="#consultar-estado" className="portal-v2-hero-link">Consultar mi estado <span aria-hidden="true">↘</span></a>
            <small className="portal-v2-disclaimer">La consulta muestra el último estado registrado por coordinación.</small>
          </div>
          <div className="portal-v2-hero-bottom"><span>01 / REGISTRO</span><span>02 / REVISIÓN</span><span>03 / DECISIÓN</span><span>UNICLARETIANA · CHOCÓ</span></div>
        </div>
      </section>
      <TrackingLookup />
    </div>
  );
}
