import { createSeoMetadata } from "@/lib/seo";
import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects.json";
import type { Project } from "@/types";

const projects = projectsData as Project[];
export const metadata = createSeoMetadata({ title: 'Proyectos', description: 'Conoce los proyectos de investigación aplicada, inteligencia artificial, datos y desarrollo de software de SYNAPSE en el Chocó.', path: '/proyectos' });

export default function ProjectsPage() {
  const active = projects.filter(p => p.status === "activo").length;
  return <div className="inner-page"><div className="content-width">
    <header className="inner-hero"><p className="eyebrow"><span className="eyebrow-dot"/> PROYECTOS / INVESTIGACIÓN APLICADA</p><h1>Ideas con los pies<br /><em>en el territorio.</em></h1><p>Diseñamos soluciones desde Quibdó que usan tecnología, datos e inteligencia artificial para abordar desafíos reales del Chocó.</p></header>
    <div className="inner-metrics"><div className="inner-metric"><strong>{String(projects.length).padStart(2, "0")}</strong><span>Proyectos registrados</span></div><div className="inner-metric"><strong>{String(active).padStart(2, "0")}</strong><span>En desarrollo</span></div><div className="inner-metric"><strong>{String(projects.length - active).padStart(2, "0")}</strong><span>Finalizados</span></div></div>
    <div className="projects-grid">{projects.map((project, index) => <ProjectCard key={project.id} project={project} index={index}/>)}</div>
  </div></div>;
}
