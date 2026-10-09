import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import TeamAvatar from "@/components/TeamAvatar";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import TeamSocialLinks from "@/components/TeamSocialLinks";
import { team, getTeamMember } from "@/lib/team";
import { createSeoMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return team.map((member) => ({ id: member.id }));
}

interface Props { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: member.name, description: member.bio, path: `/equipo/${id}`, type: "website" });
}

export default async function TeamMemberPage({ params }: Props) {
  const { id } = await params;
  const member = getTeamMember(id);
  if (!member) notFound();

  const groupLabel = member.groupRole || member.group || "Semillerista";
  const peers = team.filter((person) => person.group === member.group && person.id !== member.id).slice(0, 3);
  const memberIndex = team.findIndex((person) => person.id === id);
  const prev = team[(memberIndex - 1 + team.length) % team.length];
  const next = team[(memberIndex + 1) % team.length];

  return (
    <div className="people-profile-page">
      <section className="people-profile-hero" aria-labelledby="people-profile-title">
        <div className="content-width">
          <nav className="people-profile-breadcrumb" aria-label="Ruta de navegación">
            <Link href="/equipo">Equipo</Link><span aria-hidden="true">/</span><span aria-current="page">{member.name}</span>
          </nav>
          <div className="people-profile-hero-grid">
            <div className="people-profile-hero-copy">
              <p className="people-overline"><i className="people-status-dot" /> SYNAPSE / PERFIL {String(memberIndex + 1).padStart(2, "0")}</p>
              <span className="people-profile-badge">{groupLabel}</span>
              <h1 id="people-profile-title">{member.name}<span>.</span></h1>
              <p className="people-profile-role">{member.role}</p>
              <div className="people-profile-hero-divider" />
              <p className="people-profile-hero-description">Conoce a las personas que aportan sus conocimientos y habilidades a la investigación y la tecnología con propósito.</p>
              <a href="#perfil" className="people-profile-explore">Descubrir perfil <span aria-hidden="true">↓</span></a>
            </div>
            <div className="people-profile-portrait" data-group={member.group ?? "general"}>
              <span className="people-profile-portrait-grid" aria-hidden="true" />
              <span className="people-profile-portrait-orbit" aria-hidden="true" />
              <div className="people-profile-portrait-avatar"><TeamAvatar member={member} size="profile" /></div>
              <span className="people-profile-portrait-top">SYN / {String(memberIndex + 1).padStart(2, "0")}</span>
              <div className="people-profile-portrait-bottom"><span>EL EQUIPO / SYNAPSE</span><span>QUIBDÓ · CHOCÓ</span></div>
            </div>
          </div>
          <div className="people-profile-hero-foot"><span>CONOCIMIENTO · COLABORACIÓN · IMPACTO</span><span>{String(memberIndex + 1).padStart(2, "0")} / {String(team.length).padStart(2, "0")}</span></div>
        </div>
      </section>

      <ResearchSectionNav current="equipo" />

      <section className="people-profile-about" id="perfil" aria-labelledby="people-about-title">
        <div className="content-width">
          <div className="people-profile-section-bar"><span><i className="people-status-dot" /> 01 / EL PERFIL</span><span>SYNAPSE · PERSONAS</span></div>
          <div className="people-profile-about-grid">
            <article className="people-profile-story">
              <p className="people-story-eyebrow">UNA MIRADA MÁS CERCANA</p>
              <h2 id="people-about-title">El conocimiento<br />se construye <span>en equipo.</span></h2>
              <p className="people-story-bio">{member.bio}</p>
              <div className="people-story-facts"><div><span>ÁREA DE TRABAJO</span><strong>{groupLabel}</strong></div><div><span>ROL EN SYNAPSE</span><strong>{member.role}</strong></div></div>
            </article>
            <div className="people-profile-sidebar">
              {!!member.responsibilities?.length && <section className="people-profile-responsibilities" aria-labelledby="people-responsibilities-title">
                <p className="people-aside-eyebrow">02 / QUÉ APORTA</p>
                <h3 id="people-responsibilities-title">Responsabilidades<span>.</span></h3>
                <ol>{member.responsibilities.map((responsibility, index) => <li key={`${index}-${responsibility}`}><span>{String(index + 1).padStart(2, "0")}</span><p>{responsibility.trim()}</p></li>)}</ol>
              </section>}
              <section className="people-profile-connect" aria-labelledby="people-connect-title">
                <p className="people-aside-eyebrow">03 / ENLACES</p>
                <h3 id="people-connect-title">Conecta <span>con {member.name.split(" ")[0]}.</span></h3>
                <TeamSocialLinks member={member} variant="profile" />
                {Object.values(member.social ?? {}).filter(Boolean).length === 0 && <p className="people-no-social">Este integrante aún no tiene enlaces públicos registrados.</p>}
              </section>
            </div>
          </div>
        </div>
      </section>

      {peers.length > 0 && <section className="people-profile-related" aria-labelledby="people-related-title">
        <div className="content-width">
          <div className="people-profile-section-bar"><span><i className="people-status-dot" /> 04 / LA COMUNIDAD</span><Link href="/equipo">VER TODO EL EQUIPO ↗</Link></div>
          <div className="people-related-heading"><h2 id="people-related-title">También en <span>{member.group ?? "el equipo"}.</span></h2><p>Descubre a otras personas que contribuyen desde esta misma área de trabajo.</p></div>
          <div className="people-related-grid">{peers.map((person) => <Link href={`/equipo/${person.id}`} key={person.id} className="people-related-card"><div className="people-related-avatar"><TeamAvatar member={person} /></div><div><span>{person.groupRole || person.group}</span><h3>{person.name}</h3><p>{person.role}</p></div><span className="people-related-arrow" aria-hidden="true">↗</span></Link>)}</div>
        </div>
      </section>}

      <section className="people-profile-discover" aria-labelledby="people-profile-discover-title"><div className="content-width people-profile-discover-inner"><div><p className="people-overline">PERSONAS QUE CREAN CONOCIMIENTO</p><h2 id="people-profile-discover-title">El impacto no se<br/>construye <span>en solitario.</span></h2></div><div className="people-profile-discover-links"><Link href="/proyectos">Explorar proyectos <span aria-hidden="true">↗</span></Link><Link href="/publicaciones">Ver publicaciones <span aria-hidden="true">↗</span></Link></div></div></section>

      <nav className="people-profile-pagination" aria-label="Navegar entre perfiles">
        <div className="content-width people-profile-pagination-grid">
          <Link href={`/equipo/${prev.id}`} className="people-profile-pagination-link people-profile-pagination-link--prev"><span>← PERFIL ANTERIOR</span><strong>{prev.name}</strong></Link>
          <Link href="/equipo" className="people-profile-all">Todos los integrantes <span aria-hidden="true">↗</span></Link>
          <Link href={`/equipo/${next.id}`} className="people-profile-pagination-link people-profile-pagination-link--next"><span>SIGUIENTE PERFIL →</span><strong>{next.name}</strong></Link>
        </div>
      </nav>
    </div>
  );
}
