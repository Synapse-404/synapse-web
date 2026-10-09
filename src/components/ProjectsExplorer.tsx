"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/types";
import { filterProjects } from "@/lib/research-directory";

type Status = "todos" | Project["status"];
const statusLabels: Record<Project["status"], string> = { activo: "En desarrollo", finalizado: "Finalizado" };

function ProjectTile({ project, index, featured }: { project: Project; index: number; featured: boolean }) {
  return (
    <article className={`atlas-work-card${featured ? " atlas-work-card--featured" : ""}`}>
      <div className="atlas-work-card-art" data-art={String(index % 3)} aria-hidden="true">
        <div className="atlas-art-mesh" />
        <div className="atlas-art-ring atlas-art-ring--one" />
        <div className="atlas-art-ring atlas-art-ring--two" />
        <span className="atlas-art-cross">✳</span>
        <span className="atlas-art-top">SYN / {String(index + 1).padStart(2, "0")}</span>
        <span className="atlas-art-bottom">RESEARCH &amp; DEVELOPMENT</span>
      </div>
      <div className="atlas-work-card-info">
        <div className="atlas-work-card-meta"><span>{String(index + 1).padStart(2, "0")} / PROYECTO</span><span className="atlas-project-status"><i className={project.status === "activo" ? "is-active" : ""} />{statusLabels[project.status]}</span></div>
        <div className="atlas-work-card-main"><p className="atlas-card-kicker">{project.year} <span>·</span> INVESTIGACIÓN APLICADA</p><h3><Link href={`/proyectos/${project.slug}`}>{project.title}</Link></h3><p>{project.description}</p></div>
        <div className="atlas-work-card-bottom"><div className="atlas-card-tags">{project.technologies.slice(0, 3).map((tech) => <span key={tech}>{tech}</span>)}</div><Link className="atlas-circle-link" href={`/proyectos/${project.slug}`} aria-label={`Ver proyecto ${project.title}`}>↗</Link></div>
      </div>
    </article>
  );
}

export default function ProjectsExplorer({ projects }: { projects: Project[] }) {
  const [status, setStatus] = useState<Status>("todos");
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);
  const filtered = useMemo(() => filterProjects(projects, status, query), [projects, status, query]);

  return (
    <section className="atlas-catalog" id="catalogo" aria-labelledby="atlas-catalog-title">
      <div className="content-width">
        <div className="atlas-heading-bar"><div><p className="atlas-kicker"><i /> 01 / PORTAFOLIO</p><h2 id="atlas-catalog-title">Investigación en <em>movimiento.</em></h2></div><p>Explora las iniciativas y conoce las preguntas, las herramientas y el impacto que orientan cada proyecto.</p></div>
        <div className="atlas-explorer-toolbar" role="search" aria-label="Filtrar proyectos">
          <div className="atlas-filter-list" role="group" aria-label="Estado del proyecto">
            {(["todos", "activo", "finalizado"] as Status[]).map((item) => {
              const count = item === "todos" ? projects.length : projects.filter((p) => p.status === item).length;
              return <button key={item} type="button" aria-pressed={status === item} className={status === item ? "is-selected" : ""} onClick={() => setStatus(item)}>{item === "todos" ? "Todos" : statusLabels[item]} <span>{count}</span></button>;
            })}
          </div>
          <label className="atlas-search"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar proyectos por título, tecnología o descripción</span><input type="search" autoComplete="off" placeholder="Buscar proyecto o tecnología" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
        </div>
        <div className="atlas-results" aria-live="polite"><span>{String(filtered.length).padStart(2, "0")} {filtered.length === 1 ? "RESULTADO" : "RESULTADOS"}</span><span>DESLIZA PARA EXPLORAR ↓</span></div>
        {filtered.length ? <div className="atlas-work-grid">{filtered.map((project, i) => <ProjectTile project={project} key={project.id} index={projects.indexOf(project)} featured={i === 0} />)}</div> :
          <div className="atlas-empty" role="status"><span aria-hidden="true">✳</span><h3>No encontramos proyectos.</h3><p>Prueba con otra palabra o vuelve a ver todos los proyectos.</p><button type="button" onClick={() => { setStatus("todos"); setSearch(""); }}>Restablecer filtros ↗</button></div>}
      </div>
    </section>
  );
}
