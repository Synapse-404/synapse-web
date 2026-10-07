"use client";

import { type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import ProjectCard from "@/components/ProjectCard";
import PublicationCard from "@/components/PublicationCard";
import BlogCard from "@/components/BlogCard";
import TeamCard from "@/components/TeamCard";
import { Project, Publication, BlogPost } from "@/types";
import projectsData from "@/data/projects.json";
import publicationsData from "@/data/publications.json";
import blogData from "@/data/blog.json";
import { team, featuredTeam } from "@/lib/team";

const projects = projectsData as Project[];
const publications = publicationsData as Publication[];
const blogPosts = blogData as BlogPost[];
const activeProjectsCount = projects.filter((project) => project.status === "activo").length;
const publicationsCount = publications.length;
const teamMembersCount = team.length;
const alliedCommunitiesCount = new Set(
  projects.flatMap((project) =>
    project.team.filter((member) => {
      const normalizedMember = member.toLowerCase();
      return (
        normalizedMember.includes("comunidad") ||
        normalizedMember.includes("comunidades") ||
        normalizedMember.includes("institución")
      );
    })
  )
).size;

export default function Home() {
  const handleContactSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      event.currentTarget.reset();
      toast.success("Solicitud enviada", {
        description: "Pronto nos pondremos en contacto contigo.",
      });
    } catch {
      toast.error("No se pudo enviar la solicitud", {
        description: "Inténtalo nuevamente.",
      });
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="min-h-screen bg-synapse-black flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#F5A800 1px, transparent 1px), linear-gradient(90deg, #F5A800 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-display text-white text-4xl md:text-5xl leading-tight mb-6">
                Transformamos datos <br />en decisiones que <br /><span className="text-synapse-yellow">transforman el Chocó</span>
              </h1>
              <p className="font-mono text-white/50 text-sm uppercase tracking-wider mb-8">
                Investigamos · Desarrollamos · Impactamos
              </p>
              <p className="text-white/60 max-w-md border-l-2 border-synapse-yellow pl-6 text-base">
                Tecnología con propósito territorial. Desde Quibdó, creamos soluciones de software e inteligencia artificial para los desafíos reales de nuestra región.
              </p>
            </div>
            <div className="flex justify-center">
              <div className="w-full max-w-sm p-4 rounded-sm sm:p-6">
                <Image src="/mapa_choco1.png" alt="Mapa chocó" width={1000} height={1000} className="h-full w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estadísticas */}
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div><div className="font-display text-4xl text-synapse-yellow">{activeProjectsCount}</div><div className="font-mono text-xs text-gray-500">Proyectos activos</div></div>
            <div><div className="font-display text-4xl text-synapse-yellow">{publicationsCount}</div><div className="font-mono text-xs text-gray-500">Publicaciones</div></div>
            <div><div className="font-display text-4xl text-synapse-yellow">{teamMembersCount}</div><div className="font-mono text-xs text-gray-500">Semilleristas</div></div>
            <div><div className="font-display text-4xl text-synapse-yellow">{alliedCommunitiesCount}</div><div className="font-mono text-xs text-gray-500">Comunidades aliadas</div></div>
          </div>
        </div>
      </section>

      {/* Identidad */}
      <section id="identidad" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
            <div>
              <span className="font-mono text-xs text-synapse-yellow tracking-wider">SYNAPSE — Semillero de investigación</span>
              <h2 className="font-display text-4xl md:text-5xl text-synapse-black mt-3">Investigamos, desarrollamos e impactamos</h2>
              <p className="text-gray-600 mt-5 max-w-xl">
                Somos un espacio de formación, investigación e innovación enfocado en el desarrollo de soluciones de software y en la generación de conocimiento que aporte al crecimiento académico y social, con un enfoque en la transformación de realidades locales.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="bg-synapse-black border border-white/10 p-6 rounded-sm text-white">
                <h3 className="font-display text-xl text-synapse-yellow mb-3">Nuestro propósito</h3>
                <p className="text-sm text-white/70">
                  Usar la investigación y el desarrollo de software como herramientas para construir un futuro más inclusivo y sostenible.
                </p>
              </div>
              <div className="bg-synapse-black border border-white/10 p-6 rounded-sm text-white">
                <h3 className="font-display text-xl text-synapse-yellow mb-3">Enfoque territorial</h3>
                <p className="text-sm text-white/70">
                  Desarrollamos proyectos en Quibdó, Chocó, para responder a necesidades reales de la comunidad y contribuir al bienestar social, ambiental y educativo.
                </p>
              </div>
              <div className="bg-synapse-black text-white p-6 rounded-sm sm:col-span-2">
                <h3 className="font-display text-xl text-synapse-yellow mb-4">Nuestro impacto</h3>
                <div className="grid sm:grid-cols-2 gap-4 text-sm text-white/70">
                  <p><span className="font-mono text-synapse-yellow">Educativo:</span> Buscamos reducir la deserción y mejorar la calidad de la educación.</p>
                  <p><span className="font-mono text-synapse-yellow">Social:</span> Buscamos promover convivencia, inclusión y bienestar.</p>
                  <p><span className="font-mono text-synapse-yellow">Ambiental:</span> Buscamos apoyar la gestión del riesgo y la adaptación climática.</p>
                  <p><span className="font-mono text-synapse-yellow">Tecnológico:</span> Usamos datos para transformar realidades.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proyectos destacados */}
      <section id="proyectos" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start gap-2 mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">01 — Proyectos</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black">Lo que <span className="text-synapse-yellow">construimos</span></h2>
            <p className="text-gray-600 max-w-lg">Soluciones reales con tecnología, desde el Chocó para el mundo.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => <ProjectCard key={project.id} project={project} />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/proyectos" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">Ver todos los proyectos →</Link>
          </div>
        </div>
      </section>

      {/* Publicaciones */}
      <section id="publicaciones" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start gap-2 mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">02 — Publicaciones</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black">Generamos <span className="text-synapse-yellow">conocimiento</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {publications.map(pub => <PublicationCard key={pub.id} publication={pub} />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/publicaciones" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">Ver todas las publicaciones →</Link>
          </div>
        </div>
      </section>

      {/* Líneas de investigación */}
      <section id="lineas" className="py-18 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">03 — Líneas de investigación</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black mt-2">Áreas que <span className="text-synapse-yellow">impulsamos</span></h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="bg-white p-6 rounded-sm border-l-4 border-synapse-yellow shadow-sm"><h3 className="font-display text-xl mb-2">Inteligencia Artificial</h3><p className="text-gray-600 text-sm">Aplicamos técnicas de aprendizaje automático, análisis de datos y modelos predictivos para resolver problemáticas sociales, educativas y ambientales.</p></div>
            <div className="bg-white p-6 rounded-sm border-l-4 border-synapse-yellow shadow-sm"><h3 className="font-display text-xl mb-2">Desarrollo de Software</h3><p className="text-gray-600 text-sm">Diseñamos y desarrollamos soluciones de software innovadoras, escalables y centradas en el usuario, que respondan a necesidades del entorno local.</p></div>
          </div>
        </div>
      </section>


      {/* Blog */}
      <section id="bitacora" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col items-start gap-2 mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">04 — Bitácora</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black">Actualidad <span className="text-synapse-yellow">SYNAPSE</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {blogPosts.map(post => <BlogCard key={post.id} post={post} />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/blog" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">Ver todas las noticias →</Link>
          </div>
        </div>
      </section>

      {/* Equipo */}
      <section id="equipo" className="py-24 bg-white">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">05 — Semilleristas</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black mt-2">El <span className="text-synapse-yellow">equipo</span></h2>
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">Investigadores, desarrolladores y gestores con un objetivo común: transformar el Chocó.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredTeam.map(member => <TeamCard key={member.id} member={member} />)}
          </div>
          <div className="text-center mt-12">
            <Link href="/equipo" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">Ver estructura completa del equipo →</Link>
          </div>
        </div>
      </section>

      {/* Galería */}
      <section id="galeria" className="py-24 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">06 — Galería</span>
            <h2 className="font-display text-4xl md:text-5xl text-synapse-black mt-2">Capturando <span className="text-synapse-yellow">momentos</span></h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-80 bg-white rounded-sm overflow-hidden shadow-md snap-start">
                <div className="h-48 bg-synapse-yellow/20 flex items-center justify-center text-gray-500">Imagen {i}</div>
                <div className="p-4"><p className="text-sm font-mono text-gray-600">Evento {i} - 2025</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de vinculación */}
      <section id="contacto" className="py-24 bg-synapse-black text-white">
        <div className="container mx-auto px-6 md:px-12 max-w-2xl">
          <div className="text-center mb-12">
            <span className="font-mono text-xs text-synapse-yellow tracking-wider">07 — Súmate a SYNAPSE</span>
            <h2 className="font-display text-4xl md:text-5xl mt-2">Código que <span className="text-synapse-yellow">transforma realidades</span></h2>
            <p className="text-white/60 mt-4">Si te apasiona la tecnología, la investigación y generar impacto en tu comunidad, este es tu lugar.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            <div className="border border-white/10 p-4 rounded-sm"><h3 className="font-mono text-xs text-synapse-yellow mb-2">Aprende</h3><p className="text-white/60 text-sm">Desarrolla habilidades en investigación, análisis de datos y desarrollo de software.</p></div>
            <div className="border border-white/10 p-4 rounded-sm"><h3 className="font-mono text-xs text-synapse-yellow mb-2">Innova</h3><p className="text-white/60 text-sm">Participa en proyectos que resuelven problemáticas reales de Quibdó.</p></div>
            <div className="border border-white/10 p-4 rounded-sm"><h3 className="font-mono text-xs text-synapse-yellow mb-2">Transforma</h3><p className="text-white/60 text-sm">Sé parte de soluciones que generan un impacto positivo y sostenible.</p></div>
          </div>
          <form id="contactForm" className="space-y-6" onSubmit={handleContactSubmit}>
            <div><label className="block font-mono text-sm text-white/70 mb-1">Nombre completo</label><input type="text" required className="w-full bg-white/10 border border-white/20 rounded-sm p-3 text-white focus:outline-none focus:border-synapse-yellow" /></div>
            <div><label className="block font-mono text-sm text-white/70 mb-1">Correo electrónico institucional</label><input type="email" required className="w-full bg-white/10 border border-white/20 rounded-sm p-3 text-white focus:outline-none focus:border-synapse-yellow" /></div>
            <div><label className="block font-mono text-sm text-white/70 mb-1">Programa académico</label><input type="text" required className="w-full bg-white/10 border border-white/20 rounded-sm p-3 text-white focus:outline-none focus:border-synapse-yellow" /></div>
            <div><label className="block font-mono text-sm text-white/70 mb-1">Semestre actual</label><input type="number" min={1} max={10} required className="w-full bg-white/10 border border-white/20 rounded-sm p-3 text-white focus:outline-none focus:border-synapse-yellow" /></div>
            <button type="submit" className="w-full bg-synapse-yellow text-synapse-black font-mono text-sm py-3 rounded-sm hover:brightness-95 transition">Enviar solicitud →</button>
          </form>
        </div>
      </section>
    </>
  );
}
