import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import PublicationsExplorer from "@/components/PublicationsExplorer";
import publicationsData from "@/data/publications.json";
import type { Publication } from "@/types";

const publications = publicationsData as Publication[];
const years = publications.map((publication) => publication.year);
const latestYear = years.length ? Math.max(...years) : null;
const uniqueTypes = new Set(publications.map((publication) => publication.type)).size;

export const metadata = createSeoMetadata({ title: "Publicaciones", description: "Publicaciones y producción académica y tecnológica del semillero de investigación SYNAPSE de Uniclaretiana.", path: "/publicaciones" });

export default function PublicationsPage() {
  return <div className="atlas-page atlas-publications-page">
    <section className="atlas-hero atlas-publications-hero" aria-labelledby="publications-page-title">
      <div className="atlas-hero-background" aria-hidden="true"><span className="atlas-hero-geometry atlas-hero-geometry--one"/><span className="atlas-hero-geometry atlas-hero-geometry--two"/><span className="atlas-hero-symbol">✳</span></div>
      <div className="content-width atlas-hero-content">
        <div className="atlas-hero-topline"><span><i className="atlas-live-dot"/> SYNAPSE / PRODUCCIÓN ACADÉMICA</span><span>ARCHIVO 02—03 <span aria-hidden="true">↗</span></span></div>
        <div className="atlas-hero-columns"><div className="atlas-hero-copy"><p className="atlas-hero-eyebrow">CONOCIMIENTO QUE TRASCIENDE</p><h1 id="publications-page-title">Ideas que<br/>merecen ser<br/><em>compartidas.</em></h1><p className="atlas-hero-lead">Documentamos hallazgos, procesos y desarrollos para que la investigación no termine en una pantalla, sino que abra nuevas conversaciones.</p><div className="atlas-hero-actions"><a href="#catalogo" className="atlas-button atlas-button--amber">Ver publicaciones <span aria-hidden="true">↗</span></a><Link href="/proyectos" className="atlas-quiet-link">Explorar proyectos <span aria-hidden="true">↗</span></Link></div></div><div className="atlas-hero-side atlas-hero-side--journal" aria-hidden="true"><div className="atlas-journal"><span>SYNAPSE / RESEARCH NOTES</span><b>✳</b><i/><i/><i/><small>EDICIÓN / 0{publications.length}</small></div><p>CONOCIMIENTO.<br/>EVIDENCIA.<br/>FUTURO.</p></div></div>
        <div className="atlas-hero-footer"><span>UN ARCHIVO DE IDEAS Y RESULTADOS</span><span>DESCUBRE EL CONOCIMIENTO ↓</span></div>
      </div>
    </section>
    <ResearchSectionNav current="publicaciones" />
    <section className="atlas-metrics" aria-label="Publicaciones en cifras"><div className="content-width atlas-metrics-inner"><p className="atlas-metrics-manifesto">Investigar también significa<br/><strong>hacer circular el conocimiento.</strong></p><div className="atlas-metric"><strong>{String(publications.length).padStart(2,"0")}</strong><span>Publicaciones</span></div><div className="atlas-metric"><strong>{String(uniqueTypes).padStart(2,"0")}</strong><span>Formatos</span></div><div className="atlas-metric"><strong>{latestYear ?? "—"}</strong><span>Año más reciente</span></div></div></section>
    <PublicationsExplorer publications={publications} />
    <section className="atlas-end-cta"><div className="content-width atlas-end-cta-inner"><div><p className="atlas-kicker"><i /> CONOCIMIENTO EN ACCIÓN</p><h2>Detrás de cada hallazgo<br/>hay <em>un proyecto.</em></h2></div><Link className="atlas-button atlas-button--amber" href="/proyectos">Explorar proyectos <span aria-hidden="true">↗</span></Link></div></section>
  </div>;
}
