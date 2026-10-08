import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import projectsData from "@/data/projects.json";

export async function generateStaticParams() { return projectsData.map(p => ({ slug: p.slug })); }
interface Props { params: Promise<{slug: string}> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = projectsData.find(item => item.slug === slug);
  if (!item) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: item.title, description: item.description, path: `/proyectos/${slug}`, type: "website" });
}
export default async function ProjectPage({params}: Props) {
  const { slug } = await params;
  const project = projectsData.find(p => p.slug === slug);
  if (!project) notFound();
  return <article className="inner-page"><div className="content-width"><div className="inner-detail">
    <Link href="/proyectos" className="back-link">← Volver a proyectos</Link>
    <div className="detail-meta"><span className="tag">{project.status === "activo" ? "En desarrollo" : "Finalizado"}</span><span>{project.year} / INVESTIGACIÓN APLICADA</span></div>
    <h1 className="detail-heading">{project.title}</h1><p className="detail-lead">{project.description}</p>
    <div className="detail-divider"/>
    <section className="detail-section"><h2>Tecnologías utilizadas</h2><div className="detail-pills">{project.technologies.map(t => <span key={t}>{t}</span>)}</div></section>
    <section className="detail-section"><h2>Equipo responsable</h2><ul>{project.team.map(t => <li key={t}>{t}</li>)}</ul></section>
    {!!project.activities?.length && <section className="detail-section"><h2>Qué haremos</h2><ul>{project.activities.map(t => <li key={t}>{t}</li>)}</ul></section>}
    {!!project.expectedImpact?.length && <section className="detail-section"><h2>Impacto esperado</h2><ul>{project.expectedImpact.map(t => <li key={t}>{t}</li>)}</ul></section>}
    {project.repository && <a className="detail-external" href={project.repository} target="_blank" rel="noopener noreferrer">Ver repositorio <span aria-hidden="true">↗</span></a>}
  </div></div></article>;
}
