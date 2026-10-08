import Link from "next/link";
import type { Project } from "@/types";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  return (
    <article className="project-card">
      <div className="project-card-top"><span className="small-label">PROYECTO / {String(index + 1).padStart(2, "0")}</span><span className={`status-indicator ${project.status === "activo" ? "" : "status-finished"}`}><i />{project.status === "activo" ? "En desarrollo" : "Finalizado"}</span></div>
      <div className="project-card-art" aria-hidden="true"><span className="project-art-ring project-art-ring-one"/><span className="project-art-ring project-art-ring-two"/><span className="project-art-cross">✳</span><span className="project-art-caption">S / {String(index + 1).padStart(2, "0")}</span></div>
      <div className="project-card-content">
        <span className="small-label">{project.year} · INVESTIGACIÓN APLICADA</span>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-technologies">{project.technologies.slice(0, 3).map(tech => <span key={tech}>{tech}</span>)}</div>
        <Link href={`/proyectos/${project.slug}`} className="card-arrow-link" aria-label={`Explorar proyecto ${project.title}`}>Explorar proyecto <span aria-hidden="true">↗</span></Link>
      </div>
    </article>
  );
}
