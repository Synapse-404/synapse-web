import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getAdmin } from "@/lib/auth/session";
import AdminLoginForm from "@/components/admin/AdminLoginForm";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin");
  return <section className="adm-login-shell"><div className="adm-login-art" aria-hidden="true"><div className="adm-login-orbit" /><div className="adm-login-hero">INVESTIGACIÓN<br/>QUE SE <em>GESTIONA.</em></div><p>SYNAPSE / ÁREA RESTRINGIDA · QUIBDÓ, CHOCÓ</p></div>
    <div className="adm-login-side"><div className="adm-login-card"><Link href="/" className="adm-brand"><Image src="/synapse-brandmark-v3.png" width={34} height={40} alt=""/><span>SYNAPSE<span className="adm-brand-sub">ADMINISTRACIÓN</span></span></Link><span className="adm-overline">ACCESO INTERNO / 001</span><h1>Bienvenido<br/>de nuevo<span className="adm-accent">.</span></h1><p>Gestiona las postulaciones y consulta la actividad del semillero desde un único lugar.</p><AdminLoginForm/><Link href="/" className="adm-back">← Volver al sitio web</Link></div></div>
  </section>;
}
