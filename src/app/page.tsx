"use client";

import Link from "next/link";
import Image from "next/image";
import { type FormEvent } from "react";
import { toast } from "sonner";
import ProjectCard from "@/components/ProjectCard";
import PublicationCard from "@/components/PublicationCard";
import BlogCard from "@/components/BlogCard";
import TeamCard from "@/components/TeamCard";
import type { Project, Publication, BlogPost } from "@/types";
import projectsData from "@/data/projects.json";
import publicationsData from "@/data/publications.json";
import blogData from "@/data/blog.json";
import { featuredTeam, team } from "@/lib/team";

const projects = projectsData as Project[];
const publications = publicationsData as Publication[];
const posts = blogData as BlogPost[];
const activeProjects = projects.filter(p => p.status === "activo").length;

const stats = [
  { number: String(activeProjects).padStart(2, "0"), label: "Proyectos activos", detail: "Investigación aplicada" },
  { number: String(publications.length).padStart(2, "0"), label: "Publicaciones", detail: "Conocimiento compartido" },
  { number: String(team.length).padStart(2, "0"), label: "Semilleristas", detail: "Talento del territorio" },
  { number: "02", label: "Líneas de trabajo", detail: "IA y desarrollo de software" },
];

export default function Home() {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.info("Formulario pendiente de activación", {
      description: "Todavía no hay un servicio de recepción configurado. Puedes conocer al semillero a través de nuestro GitHub.",
      duration: 6500,
    });
  };

  return (
    <>
      <section className="hero-section" aria-labelledby="hero-heading">
        <div className="hero-shell">
          <div className="hero-video-stage" aria-hidden="true">
            <div className="hero-video-poster" />
            <video className="hero-video" autoPlay muted loop playsInline preload="metadata" poster="/metal-human.jpg" disablePictureInPicture tabIndex={-1}>
              <source src="/metal-human-optimized.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="hero-stage-overlay" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-a" aria-hidden="true" />
          <div className="hero-orbit hero-orbit-b" aria-hidden="true" />
          <span className="hero-corner-mark" aria-hidden="true">SYN / 001</span>

          <div className="hero-grid content-width">
            <div className="hero-copy">
              <p className="hero-overline"><span className="live-indicator" /> INVESTIGACIÓN · SOFTWARE · IA</p>
              <h1 id="hero-heading">Ideas que<br />se convierten<br />en <em>impacto.</em></h1>
              <p className="hero-lead">Desde el Chocó, convertimos la curiosidad en investigación y la tecnología en soluciones para nuestro territorio.</p>
              <div className="hero-ctas">
                <Link href="/proyectos" className="pill-btn pill-btn-light">Explorar proyectos <span aria-hidden="true">↗</span></Link>
                <Link href="/#identidad" className="pill-btn pill-btn-outline">Conoce SYNAPSE <span aria-hidden="true">↗</span></Link>
              </div>
            </div>
            <div className="hero-feature">
              <div className="hero-feature-visual">
                <Image src="/mapa-choco-focus.png" alt="Representación cartográfica del Chocó" fill sizes="(max-width: 760px) 200px, 310px" className="hero-map-image" />
                <span className="feature-visual-label">05°41′ N / 76°39′ O</span>
              </div>
              <Link href="/#identidad" className="hero-feature-link"><strong>Chocó, nuestro punto de partida</strong><span>Impacto territorial</span><b aria-hidden="true">↗</b></Link>
            </div>
          </div>
          <div className="hero-bottom content-width">
            <span>UN SEMILLERO, MUCHAS FORMAS DE TRANSFORMAR.</span>
            <a href="#cifras" className="hero-scroll">DESLIZA PARA EXPLORAR <span aria-hidden="true">↓</span></a>
          </div>
          <span className="hero-watermark" aria-hidden="true">SYNAPSE</span>
        </div>
      </section>

      <section className="stat-section" id="cifras" aria-label="SYNAPSE en cifras">
        <div className="content-width stat-grid">{stats.map((item) => (
          <div className="stat-item" key={item.label}><div className="stat-number">{item.number}<span>↗</span></div><p>{item.label}</p><small>{item.detail}</small></div>
        ))}</div>
      </section>

      <section id="identidad" className="section-space identity-section">
        <div className="content-width">
          <div className="identity-intro">
            <div><p className="eyebrow"><span className="eyebrow-dot"/> 01 / NUESTRA IDENTIDAD</p><h2 className="section-heading">No investigamos<br />por investigar<span className="accent-period">.</span></h2></div>
            <div className="identity-intro-copy"><p className="large-body">Creemos que las mejores ideas nacen cuando el conocimiento se encuentra con los desafíos reales de las personas.</p><p>Somos el semillero de investigación SYNAPSE de Uniclaretiana. Un espacio para aprender, construir y conectar la ciencia, el software y los datos con el desarrollo académico y social del Chocó.</p><Link href="/equipo" className="underlined-link">Conoce a quienes lo hacen posible <span aria-hidden="true">↗</span></Link></div>
          </div>
          <div className="identity-panels">
            <article className="identity-panel identity-panel-dark"><div className="panel-topline"><span>01 / PROPÓSITO</span><span>✳</span></div><div><h3>Tecnología con<br />sentido humano.</h3><p>Convertimos la investigación y el desarrollo de software en herramientas para construir un futuro más inclusivo y sostenible.</p></div><span className="panel-bottom">INVESTIGACIÓN QUE SE APLICA ↗</span></article>
            <article className="identity-panel identity-panel-image"><Image src="/metal-human.jpg" alt="Figura humana metálica, símbolo del encuentro entre tecnología y personas" fill sizes="(max-width: 768px) 100vw, 50vw" className="identity-image"/><div className="identity-image-shade"/><span>HUMANO + TECNOLOGÍA</span><strong>Del conocimiento<br />a la acción.</strong></article>
            <article className="identity-panel identity-panel-gold"><div className="panel-topline"><span>02 / TERRITORIO</span><span>↗</span></div><div><h3>Con raíces<br />en el Chocó.</h3><p>Trabajamos desde Quibdó para abordar necesidades educativas, sociales, ambientales y tecnológicas de la región.</p></div><span className="panel-bottom">QUIBDÓ · COLOMBIA</span></article>
          </div>
        </div>
      </section>

      <section id="proyectos" className="section-space projects-section">
        <div className="content-width">
          <div className="section-topline"><p className="eyebrow"><span className="eyebrow-dot"/> 02 / LO QUE CONSTRUIMOS</p><span>INVESTIGACIÓN EN MOVIMIENTO ↗</span></div>
          <div className="section-head-split"><h2 className="section-heading">Menos teoría.<br /><span>Más transformación.</span></h2><div><p>Iniciativas que unen datos, inteligencia artificial y desarrollo de software para responder a retos concretos del territorio.</p><Link href="/proyectos" className="pill-btn pill-btn-outline">Todos los proyectos <span aria-hidden="true">↗</span></Link></div></div>
          <div className="projects-grid">{projects.map((project, index) => <ProjectCard project={project} index={index} key={project.id}/>)}</div>
        </div>
      </section>

      <section id="lineas" className="section-space disciplines-section">
        <div className="content-width">
          <div className="section-topline"><p className="eyebrow"><span className="eyebrow-dot"/> 03 / NUESTRO ENFOQUE</p><span>EXPLORAR · PROBAR · CONSTRUIR</span></div>
          <div className="section-head-split"><h2 className="section-heading">El futuro se<br /><span>construye aquí.</span></h2><p>Dos líneas de trabajo que se complementan para crear soluciones relevantes, responsables y sostenibles.</p></div>
          <div className="disciplines-grid">
            <article className="discipline-item"><div className="discipline-visual discipline-visual-ai" aria-hidden="true"><span className="ai-orbit ai-orbit-one"/><span className="ai-orbit ai-orbit-two"/><span className="ai-center">✳</span></div><div className="discipline-content"><span>01 / EXPLORAR LOS DATOS</span><h3>Inteligencia<br />artificial.</h3><p>Aplicamos aprendizaje automático, analítica de datos y modelos predictivos para comprender y abordar problemáticas sociales, educativas y ambientales.</p></div></article>
            <article className="discipline-item"><div className="discipline-visual discipline-visual-dev" aria-hidden="true"><span className="dev-shape dev-shape-one"/><span className="dev-shape dev-shape-two"/><span className="dev-symbol">&lt;/&gt;</span></div><div className="discipline-content"><span>02 / MATERIALIZAR LAS IDEAS</span><h3>Desarrollo de<br />software.</h3><p>Diseñamos productos y plataformas centradas en las personas, con ingeniería escalable y soluciones adaptadas a las necesidades de nuestra región.</p></div></article>
          </div>
        </div>
      </section>

      <section id="publicaciones" className="section-space publications-section">
        <div className="content-width">
          <div className="section-topline"><p className="eyebrow"><span className="eyebrow-dot"/> 04 / CONOCIMIENTO ABIERTO</p><span>COMPARTIR TAMBIÉN ES TRANSFORMAR ↗</span></div>
          <div className="section-head-split"><h2 className="section-heading">Ideas que dejan<br /><span>huella.</span></h2><p>Documentamos resultados y aprendizajes para que el conocimiento generado por el semillero pueda llegar más lejos.</p></div>
          <div className="publication-list">{publications.map((publication, index) => <PublicationCard publication={publication} index={index} key={publication.id}/>)}</div>
          <Link href="/publicaciones" className="underlined-link publication-all-link">Explorar todas las publicaciones <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section id="bitacora" className="section-space journal-section">
        <div className="content-width">
          <div className="section-topline"><p className="eyebrow"><span className="eyebrow-dot"/> 05 / BITÁCORA</p><span>LO QUE PASA EN SYNAPSE</span></div>
          <div className="section-head-split"><h2 className="section-heading">El proceso<br /><span>también cuenta.</span></h2><p>Ideas, hitos y momentos que forman parte del camino de investigación y aprendizaje del semillero.</p></div>
          <div className="journal-grid">{posts.slice(0, 3).map((post, index) => <BlogCard post={post} index={index} key={post.id}/>)}</div>
          <Link href="/blog" className="pill-btn pill-btn-outline journal-more">Ver la bitácora <span aria-hidden="true">↗</span></Link>
        </div>
      </section>

      <section id="equipo" className="section-space team-section">
        <div className="content-width">
          <div className="section-topline"><p className="eyebrow"><span className="eyebrow-dot"/> 06 / LAS PERSONAS</p><span>EL TALENTO DETRÁS DE LAS IDEAS</span></div>
          <div className="section-head-split"><h2 className="section-heading">Una comunidad.<br /><span>Muchas perspectivas.</span></h2><div><p>Personas apasionadas por la investigación y el desarrollo que trabajan juntas para generar un impacto positivo en el territorio.</p><Link href="/equipo" className="underlined-link">Conoce al equipo completo <span aria-hidden="true">↗</span></Link></div></div>
          <div className="team-grid">{featuredTeam.map(member => <TeamCard member={member} key={member.id}/>)}</div>
        </div>
      </section>

      <section id="contacto" className="contact-section">
        <div className="content-width contact-grid">
          <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-dot"/> 07 / SÚMATE A SYNAPSE</p><h2>Tu curiosidad<br />puede cambiar<br /><em>el mañana.</em></h2><p>¿Te interesa aprender, investigar y crear tecnología con propósito? Conecta tu talento con los proyectos de nuestro semillero.</p><div className="contact-pill-row"><span>APRENDE</span><span>INVESTIGA</span><span>CONSTRUYE</span></div><a href="https://github.com/Synapse-404" target="_blank" rel="noopener noreferrer" className="underlined-link">Conócenos también en GitHub <span aria-hidden="true">↗</span></a></div>
          <div className="contact-form-wrap"><div className="contact-form-header"><span>VINCULACIÓN / 001</span><span>✳</span></div><h3>Hablemos de tus ideas.</h3><p>Déjanos tus datos para preparar una solicitud de vinculación.</p><form onSubmit={handleSubmit} className="contact-form"><label htmlFor="fullName">Nombre completo</label><input required name="fullName" id="fullName" type="text" autoComplete="name" placeholder="Tu nombre"/><label htmlFor="email">Correo electrónico institucional</label><input required name="email" id="email" type="email" autoComplete="email" placeholder="nombre@universidad.edu.co"/><div className="contact-form-half"><div><label htmlFor="program">Programa académico</label><input required name="program" id="program" type="text" placeholder="Tu carrera"/></div><div><label htmlFor="semester">Semestre actual</label><input required name="semester" id="semester" type="number" min="1" max="10" placeholder="01"/></div></div><button type="submit" className="pill-btn pill-btn-light contact-submit">Preparar solicitud <span aria-hidden="true">↗</span></button><small>El servicio de recepción de solicitudes está pendiente de configuración. Este formulario todavía no envía información.</small></form></div>
        </div>
      </section>
    </>
  );
}
