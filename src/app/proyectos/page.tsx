import Link from "next/link";
import { createSeoMetadata } from "@/lib/seo";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import ProjectsExplorer from "@/components/ProjectsExplorer";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

const projects = projectsData as Project[];
const active = projects.filter((project) => project.status === "activo").length;
const technologies = new Set(projects.flatMap((project) => project.technologies)).size;

export const metadata = createSeoMetadata({ title: "Proyectos", description: "Conoce los proyectos de investigación aplicada, inteligencia artificial, datos y desarrollo de software de SYNAPSE en el Chocó.", path: "/proyectos" });

export default function ProjectsPage() {
  return <div className="atlas-page atlas-projects-page">
    <section className="atlas-hero atlas-projects-hero" aria-labelledby="projects-page-title">
      <div className="atlas-hero-background" aria-hidden="true"><span className="atlas-hero-geometry atlas-hero-geometry--one"/><span className="atlas-hero-geometry atlas-hero-geometry--two"/><span className="atlas-hero-symbol">✳</span></div>
      <div className="content-width atlas-hero-content">
        <div className="atlas-hero-topline"><span><i className="atlas-live-dot"/> SYNAPSE / INVESTIGACIÓN APLICADA</span><span>ARCHIVO 01—03 <span aria-hidden="true">↗</span></span></div>
        <div className="atlas-hero-columns"><div className="atlas-hero-copy"><p className="atlas-hero-eyebrow">SOLUCIONES QUE NACEN EN EL TERRITORIO</p><h1 id="projects-page-title">Ideas que<br/>se vuelven<br/><em>realidad.</em></h1><p className="atlas-hero-lead">De las preguntas a los prototipos. Creamos soluciones tecnológicas orientadas a desafíos educativos, sociales y ambientales del Chocó.</p><div className="atlas-hero-actions"><a href="#catalogo" className="atlas-button atlas-button--amber">Explorar proyectos <span aria-hidden="true">↗</span></a><Link href="/equipo" className="atlas-quiet-link">Conoce al equipo <span aria-hidden="true">↗</span></Link></div></div><div className="atlas-hero-side" aria-hidden="true"><span className="atlas-hero-side-index">R&amp;D / 001</span><div className="atlas-hero-side-illustration"><span/><span/><span/><b>SY</b></div><p>INVESTIGAR.<br/>DESARROLLAR.<br/>TRANSFORMAR.</p></div></div>
        <div className="atlas-hero-footer"><span>QUIBDÓ · CHOCÓ · COLOMBIA</span><span>DESLIZA PARA EXPLORAR ↓</span></div>
      </div>
    </section>
    <ResearchSectionNav current="proyectos" />
    <section className="atlas-metrics" aria-label="Proyectos en cifras"><div className="content-width atlas-metrics-inner"><p className="atlas-metrics-manifesto">Las mejores soluciones<br/><strong>empiezan con una pregunta.</strong></p><div className="atlas-metric"><strong>{String(projects.length).padStart(2,"0")}</strong><span>Proyectos</span></div><div className="atlas-metric"><strong>{String(active).padStart(2,"0")}</strong><span>En desarrollo</span></div><div className="atlas-metric"><strong>{String(technologies).padStart(2,"0")}</strong><span>Tecnologías</span></div></div></section>
    <ProjectsExplorer projects={projects} />
    <section className="atlas-end-cta"><div className="content-width atlas-end-cta-inner"><div><p className="atlas-kicker"><i /> INVESTIGACIÓN + COLABORACIÓN</p><h2>Los proyectos crecen<br/>con <em>más perspectivas.</em></h2></div><Link href="/equipo" className="atlas-button atlas-button--amber">Conoce a las personas detrás <span aria-hidden="true">↗</span></Link></div></section>
  </div>;
}
