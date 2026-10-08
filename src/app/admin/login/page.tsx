import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAdmin } from "@/lib/auth/session";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");

  return (
    <div className="auth-v2">
      <section className="auth-v2-story" aria-label="SYNAPSE, semillero de investigación">
        <div className="auth-v2-media" aria-hidden="true">
          <video className="auth-v2-video" autoPlay muted loop playsInline preload="none" poster="/metal-human.jpg">
            <source src="/metal-human-optimized.mp4" type="video/mp4" />
          </video>
          <div className="auth-v2-ring auth-v2-ring-1" />
          <div className="auth-v2-ring auth-v2-ring-2" />
        </div>
        <div className="auth-v2-story-top">
          <Link href="/" className="auth-v2-home">↖ <span>Volver a SYNAPSE</span></Link>
          <span>PLATAFORMA DE INVESTIGACIÓN / 001</span>
        </div>
        <div className="auth-v2-story-content">
          <div className="auth-v2-kicker"><span className="auth-v2-indicator" /> EL CENTRO DE OPERACIONES</div>
          <h2>El futuro se<br />investiga <em>hoy.</em></h2>
          <p>Un espacio para organizar ideas, impulsar proyectos y transformar conocimiento en impacto real.</p>
        </div>
        <div className="auth-v2-story-bottom">
          <span>01 / SYNAPSE WORKSPACE</span>
          <span>QUIBDÓ · CHOCÓ · COLOMBIA</span>
        </div>
      </section>

      <section className="auth-v2-access" id="acceso-admin">
        <div className="auth-v2-access-top">
          <Link href="/" className="auth-v2-brand" aria-label="SYNAPSE — ir al inicio">
            <Image src="/synapse-brandmark-v3.png" width={186} height={217} alt="" unoptimized />
            <span><strong>SYNAPSE</strong><small>SEMILLERO DE INVESTIGACIÓN</small></span>
          </Link>
          <span className="auth-v2-lock"><span aria-hidden="true">◈</span> ACCESO RESTRINGIDO</span>
        </div>
        <div className="auth-v2-form-outer">
          <div className="auth-v2-form-heading">
            <span className="auth-v2-section-tag">PORTAL INTERNO / ADMINISTRACIÓN</span>
            <h1>Bienvenido<br /><em>de nuevo.</em></h1>
            <p>Accede al espacio de coordinación de admisiones y gestión académica de SYNAPSE.</p>
          </div>
          <AdminLoginForm />
          <div className="auth-v2-form-foot">
            <span>Solo para personal autorizado.</span>
            <Link href="/">Volver al sitio <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
        <div className="auth-v2-access-bottom">
          <span>© SYNAPSE / UNICLARETIANA</span>
          <span>INVESTIGAMOS · CREAMOS · TRANSFORMAMOS</span>
        </div>
      </section>
    </div>
  );
}
