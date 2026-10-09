import Image from "next/image";
import Link from "next/link";
import TeamDirectory from "@/components/TeamDirectory";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import { team } from "@/lib/team";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Equipo",
  description: "Conoce al equipo de docentes, investigadores y desarrolladores del semillero SYNAPSE de Quibdó, Chocó.",
  path: "/equipo",
});

const areas = new Set(team.map((member) => member.group).filter(Boolean)).size;
const docentes = team.filter((member) => member.group === "docente").length;

export default function TeamPage() {
  return (
    <div className="people-page">
      <section className="people-hero" aria-labelledby="people-title">
        <div className="people-hero-shell">
          <div className="people-hero-image" aria-hidden="true">
            <Image src="/metal-human.jpg" alt="" fill priority sizes="(max-width: 800px) 100vw, 60vw" />
          </div>
          <div className="people-hero-vignette" aria-hidden="true" />
          <div className="people-hero-orbit people-hero-orbit--one" aria-hidden="true" />
          <div className="people-hero-orbit people-hero-orbit--two" aria-hidden="true" />
          <div className="content-width people-hero-inner">
            <div className="people-hero-topline">
              <span><i className="people-status-dot" /> SYNAPSE / LAS PERSONAS</span>
              <span className="people-hero-edition">03 — COMUNIDAD</span>
            </div>
            <div className="people-hero-main">
              <p className="people-overline">PERSONAS QUE INVESTIGAN. IDEAS QUE TRANSFORMAN.</p>
              <h1 id="people-title">El talento<br />detrás de <span>cada idea.</span></h1>
              <p className="people-hero-lead">Una comunidad de docentes y estudiantes que conecta investigación, datos y desarrollo para construir soluciones con propósito desde el Chocó.</p>
              <div className="people-hero-actions">
                <a href="#directorio" className="people-button people-button--yellow">Conoce al equipo <span aria-hidden="true">↗</span></a>
                <Link href="/proyectos" className="people-link-quiet">Lo que construimos <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="people-hero-mini-stats" aria-label="Nuestra comunidad"><span><strong>{String(team.length).padStart(2, "0")}</strong> VOCES</span><span><strong>{String(areas).padStart(2, "0")}</strong> ÁREAS</span><Link href="/publicaciones">NUESTRO CONOCIMIENTO ↗</Link></div>
            <div className="people-hero-footline">
              <span>UNIVERSIDAD · INVESTIGACIÓN · TERRITORIO</span>
              <span>QUIBDÓ, CHOCÓ / COLOMBIA <span aria-hidden="true">↓</span></span>
            </div>
          </div>
          <span className="people-hero-watermark" aria-hidden="true">COLABORAR</span>
        </div>
      </section>

      <section className="people-overview" aria-label="El equipo en cifras">
        <div className="content-width people-overview-grid">
          <div className="people-overview-intro"><span className="people-overview-cross" aria-hidden="true">✳</span><p>Distintas perspectivas.<br /><strong>Un mismo propósito.</strong></p></div>
          <div className="people-overview-stat"><strong>{String(team.length).padStart(2, "0")}</strong><span>Integrantes</span></div>
          <div className="people-overview-stat"><strong>{String(areas).padStart(2, "0")}</strong><span>Áreas de trabajo</span></div>
          <div className="people-overview-stat"><strong>{String(docentes).padStart(2, "0")}</strong><span>Docentes líderes</span></div>
        </div>
      </section>

      <ResearchSectionNav current="equipo" />

      <TeamDirectory members={team} />

      <section className="people-ecosystem" aria-labelledby="people-ecosystem-title">
        <div className="content-width">
          <div className="people-ecosystem-intro"><p className="people-section-kicker"><i className="people-status-dot" /> MÁS ALLÁ DE LOS PERFILES</p><h2 id="people-ecosystem-title">El conocimiento<br />toma <span>muchas formas.</span></h2><p>Conoce el trabajo y las publicaciones que conectan las capacidades del equipo con los desafíos del territorio.</p></div>
          <div className="people-ecosystem-links"><Link href="/proyectos"><span>01 / INVESTIGACIÓN APLICADA</span><strong>Lo que estamos<br />construyendo.</strong><b aria-hidden="true">↗</b></Link><Link href="/publicaciones"><span>02 / CONOCIMIENTO ABIERTO</span><strong>Lo que hemos<br />documentado.</strong><b aria-hidden="true">↗</b></Link></div>
        </div>
      </section>

      <section className="people-bottom-cta" aria-labelledby="people-cta-title">
        <div className="content-width people-bottom-cta-inner">
          <div><p className="people-overline">INVESTIGAMOS EN COMUNIDAD</p><h2 id="people-cta-title">La próxima gran idea<br />puede surgir <span>contigo.</span></h2></div>
          <Link href="/#contacto" className="people-button people-button--yellow">Conecta con SYNAPSE <span aria-hidden="true">↗</span></Link>
        </div>
      </section>
    </div>
  );
}
