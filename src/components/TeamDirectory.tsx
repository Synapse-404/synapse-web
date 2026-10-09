"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import TeamAvatar from "@/components/TeamAvatar";
import TeamSocialLinks from "@/components/TeamSocialLinks";
import type { TeamMember } from "@/types";
import { filterTeamMembers, type TeamDirectoryGroup } from "@/lib/team-directory";

type Group = NonNullable<TeamMember["group"]>;

const groups: { id: Group; label: string; title: string; description: string }[] = [
  { id: "docente", label: "Docentes", title: "Orientación académica.", description: "Acompañamiento metodológico, visión académica y articulación institucional." },
  { id: "coordinación", label: "Coordinación", title: "Coordinación operativa.", description: "Articulación de equipos, proyectos y compromisos del semillero." },
  { id: "investigación", label: "Investigación", title: "Explorar para comprender.", description: "Preguntas, metodologías y análisis que se convierten en conocimiento." },
  { id: "desarrollo", label: "Desarrollo", title: "Ideas que se construyen.", description: "Software, prototipos y experiencias digitales que acercan las ideas a las personas." },
  { id: "documentación", label: "Documentación", title: "Conocimiento que permanece.", description: "Evidencias, aprendizajes y resultados que dan continuidad a cada proyecto." },
];

function DirectoryCard({ member, index }: { member: TeamMember; index: number }) {
  const href = `/equipo/${member.id}`;
  return (
    <article className="people-card">
      <Link href={href} className="people-card-photo-link" aria-label={`Ver perfil de ${member.name}`}>
        <div className="people-card-visual" data-group={member.group ?? "general"}>
          <span className="people-card-lines" aria-hidden="true" />
          <span className="people-card-orbit" aria-hidden="true" />
          <TeamAvatar member={member} />
          <span className="people-card-number">SYN / {String(index + 1).padStart(2, "0")}</span>
          <span className="people-card-corner" aria-hidden="true">↗</span>
          <span className="people-card-visual-caption">SYNAPSE / EQUIPO</span>
        </div>
      </Link>
      <div className="people-card-copy">
        <span className="people-card-tag"><i /> {member.groupRole || member.group || "Semillerista"}</span>
        <h3><Link href={href}>{member.name}</Link></h3>
        <p className="people-card-role">{member.role}</p>
        <p className="people-card-bio">{member.bio}</p>
        <div className="people-card-footer">
          <TeamSocialLinks member={member} variant="directory" />
          <Link href={href} className="people-card-view">Perfil <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </article>
  );
}

export default function TeamDirectory({ members }: { members: TeamMember[] }) {
  const [activeGroup, setActiveGroup] = useState<TeamDirectoryGroup>("todos");
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);

  const filtered = useMemo(() => filterTeamMembers(members, activeGroup, query), [members, activeGroup, query]);

  const registeredGroups = groups.filter((group) => members.some((member) => member.group === group.id));
  const visibleGroups = registeredGroups.map((group) => ({ ...group, members: filtered.filter((member) => member.group === group.id) }))
    .filter((group) => group.members.length > 0);

  return (
    <section className="people-directory" id="directorio" aria-labelledby="people-directory-title">
      <div className="content-width">
        <div className="people-directory-heading">
          <div><p className="people-section-kicker"><i className="people-status-dot" /> 01 / NUESTRO EQUIPO</p><h2 id="people-directory-title">Conoce las <span>mentes<br />detrás del cambio.</span></h2></div>
          <p>Un equipo multidisciplinario. Diferentes habilidades, perspectivas y formas de convertir el conocimiento en acción.</p>
        </div>

        <div className="people-directory-controls" role="search" aria-label="Explorar integrantes">
          <div className="people-filters" role="group" aria-label="Filtrar por área">
            <button type="button" aria-pressed={activeGroup === "todos"} className={activeGroup === "todos" ? "is-active" : ""} onClick={() => setActiveGroup("todos")}>Todos <span>{members.length}</span></button>
            {registeredGroups.map((group) => {
              const count = members.filter((member) => member.group === group.id).length;
              return <button type="button" key={group.id} aria-pressed={activeGroup === group.id} className={activeGroup === group.id ? "is-active" : ""} onClick={() => setActiveGroup(group.id)}>{group.label} <span>{count}</span></button>;
            })}
          </div>
          <label className="people-search"><svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="10.8" cy="10.8" r="6.3"/><path d="m16 16 5 5"/></svg><span className="sr-only">Buscar integrantes por nombre, cargo o área</span><input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar integrante..." autoComplete="off" /></label>
        </div>

        <div className="people-directory-result" aria-live="polite"><span>{filtered.length} {filtered.length === 1 ? "PERSONA" : "PERSONAS"} {query.trim() || activeGroup !== "todos" ? "ENCONTRADAS" : "EN EL EQUIPO"}</span><span>EXPLORA LOS PERFILES ↓</span></div>

        {visibleGroups.length > 0 ? <div className="people-groups">
          {visibleGroups.map((group) => (
            <section className="people-group" key={group.id} aria-labelledby={`people-group-${group.id}`}>
              <div className="people-group-heading">
                <span className="people-group-index">{String(registeredGroups.findIndex((entry) => entry.id === group.id) + 1).padStart(2, "0")} / 0{registeredGroups.length}</span>
                <div><p className="people-group-name">{group.label.toUpperCase()} / SYNAPSE</p><h3 id={`people-group-${group.id}`}>{group.title}</h3><p>{group.description}</p></div>
                <span className="people-group-count">{String(group.members.length).padStart(2, "0")} {group.members.length === 1 ? "INTEGRANTE" : "INTEGRANTES"}</span>
              </div>
              <div className="people-card-grid">
                {group.members.map((member) => <DirectoryCard member={member} index={members.findIndex((person) => person.id === member.id)} key={member.id} />)}
              </div>
            </section>
          ))}
        </div> : <div className="people-empty" role="status"><span aria-hidden="true">⌕</span><h3>No encontramos coincidencias.</h3><p>Prueba con otro nombre, cargo o área de trabajo.</p><button type="button" onClick={() => { setSearch(""); setActiveGroup("todos"); }}>Restablecer filtros <span aria-hidden="true">↗</span></button></div>}
      </div>
    </section>
  );
}
