import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createSeoMetadata } from "@/lib/seo";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";
import { isExternalResource } from "@/lib/research-directory";

const projects = projectsData as Project[];
export async function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }
interface Props { params: Promise<{ slug: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: project.title, description: project.description, path: `/proyectos/${slug}`, type: "website" });
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  const index = projects.findIndex((item) => item.slug === slug);
  const related = projects.filter((item) => item.slug !== slug).slice(0, 2);
  const statusLabel = project.status === "activo" ? "En desarrollo" : "Finalizado";
  const realRepository = isExternalResource(project.repository);

  return <div className="atlas-page atlas-detail-page atlas-project-detail">
    <header className="atlas-detail-hero"><div className="content-width">
      <nav className="atlas-breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/proyectos">Proyectos</Link><span>/</span><span aria-current="page">{project.title}</span></nav>
      <div className="atlas-detail-hero-grid"><div className="atlas-detail-hero-copy"><p className="atlas-kicker"><i /> INVESTIGACIÓN APLICADA / {String(index + 1).padStart(2,"0")}</p><div className="atlas-detail-tags"><span className="atlas-detail-status"><i className={project.status === "activo" ? "is-active" : ""}/>{statusLabel}</span><span>{project.year}</span></div><h1>{project.title}<em>.</em></h1><p className="atlas-detail-summary">{project.description}</p><div className="atlas-detail-hero-links"><a href="#acerca" className="atlas-button atlas-button--amber">Descubre el proyecto <span aria-hidden="true">↓</span></a><Link className="atlas-quiet-link" href="/proyectos">Todos los proyectos <span aria-hidden="true">↗</span></Link></div></div>
      <div className="atlas-detail-art" data-art={String(index % 3)} aria-hidden="true"><div className="atlas-art-mesh"/><span className="atlas-art-ring atlas-art-ring--one"/><span className="atlas-art-ring atlas-art-ring--two"/><span className="atlas-art-cross">✳</span><span className="atlas-art-top">SYNAPSE / PROJECT {String(index+1).padStart(2,"0")}</span><span className="atlas-art-bottom">QUIBDÓ / CHOCÓ</span></div></div>
      <div className="atlas-detail-hero-foot"><span>TECNOLOGÍA CON PROPÓSITO</span><span>PROYECTO {String(index + 1).padStart(2,"0")} / {String(projects.length).padStart(2,"0")}</span></div>
    </div></header>
    <ResearchSectionNav current="proyectos" />
    <section className="atlas-detail-content" id="acerca" aria-label="Información del proyecto"><div className="content-width">
      <div className="atlas-detail-topbar"><span><i className="atlas-live-dot"/> 01 / ACERCA DEL PROYECTO</span><span>FICHA DE INVESTIGACIÓN</span></div>
      <div className="atlas-detail-layout"><div className="atlas-detail-primary"><p className="atlas-detail-intro-label">EL RETO QUE NOS MUEVE</p><h2>De una necesidad<br/>a una <em>solución.</em></h2><p className="atlas-detail-text">{project.description}</p>
        {Boolean(project.activities?.length) && <section className="atlas-detail-block" aria-labelledby="project-activities"><div className="atlas-detail-block-head"><span>02 / PROCESO</span><h3 id="project-activities">Qué hacemos.</h3></div><ol className="atlas-numbered-list">{project.activities!.map((activity, i) => <li key={activity}><span>{String(i + 1).padStart(2,"0")}</span><p>{activity}</p></li>)}</ol></section>}
        {Boolean(project.expectedImpact?.length) && <section className="atlas-detail-block" aria-labelledby="project-impact"><div className="atlas-detail-block-head"><span>03 / PROYECCIÓN</span><h3 id="project-impact">Impacto esperado.</h3></div><div className="atlas-impact-list">{project.expectedImpact!.map((impact, i) => <div key={impact}><span>↗ {String(i+1).padStart(2,"0")}</span><p>{impact}</p></div>)}</div></section>}
      </div><aside className="atlas-detail-aside"><div className="atlas-aside-panel atlas-aside-panel--dark"><span className="atlas-aside-label">FICHA TÉCNICA / SYNAPSE</span><h3>El proyecto<br/>en datos<span>.</span></h3><dl><div><dt>ESTADO</dt><dd>{statusLabel}</dd></div><div><dt>AÑO</dt><dd>{project.year}</dd></div><div><dt>RESPONSABLES</dt><dd>{project.team.length}</dd></div><div><dt>TECNOLOGÍAS</dt><dd>{project.technologies.length}</dd></div></dl></div>
        <div className="atlas-aside-panel"><span className="atlas-aside-label">TECNOLOGÍAS UTILIZADAS</span><div className="atlas-aside-chips">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div></div>
        <div className="atlas-aside-panel"><span className="atlas-aside-label">EQUIPO Y COLABORACIÓN</span><ul className="atlas-aside-team">{project.team.map((person, i) => <li key={person}><span>{String(i+1).padStart(2,"0")}</span>{person}</li>)}</ul><Link href="/equipo" className="atlas-aside-link">Conoce el semillero ↗</Link></div>
        {realRepository && <a className="atlas-aside-external" href={project.repository} target="_blank" rel="noopener noreferrer">Repositorio del proyecto <span aria-hidden="true">↗</span></a>}
      </aside></div>
    </div></section>
    {related.length > 0 && <section className="atlas-related-section" aria-labelledby="related-projects-title"><div className="content-width"><div className="atlas-related-heading"><div><p className="atlas-kicker"><i/> SIGUE EXPLORANDO</p><h2 id="related-projects-title">Más ideas en <em>acción.</em></h2></div><Link href="/proyectos" className="atlas-related-all">Ver todos ↗</Link></div><div className="atlas-related-grid">{related.map((item, i) => <Link className="atlas-related-tile" key={item.id} href={`/proyectos/${item.slug}`}><div><span>{String(i+1).padStart(2,"0")} / PROYECTO</span><span>{item.year}</span></div><h3>{item.title}</h3><p>{item.technologies.slice(0,2).join(" · ")}</p><b aria-hidden="true">↗</b></Link>)}</div></div></section>}
    <nav className="atlas-bottom-navigation" aria-label="Navegar entre proyectos"><div className="content-width"><Link href="/proyectos"><span>←</span> Volver a proyectos</Link><Link href={`/proyectos/${projects[(index+1)%projects.length].slug}`}>Siguiente proyecto <span>↗</span></Link></div></nav>
  </div>;
}
