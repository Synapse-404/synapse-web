import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/admin", label: "Resumen", icon: "◫" },
  { href: "/admin/solicitudes", label: "Admisiones", icon: "◎" },
  { href: "/admin/contenidos", label: "Contenidos", icon: "▦" },
  { href: "/admin/evidencias", label: "Evidencias", icon: "◇" },
];
export default function AdminSidebar({ adminName }: { adminName: string }) {
  return <aside className="adm-sidebar"><Link className="adm-sidebar-brand" href="/admin"><Image src="/synapse-brandmark-v3.png" width={40} height={46} alt=""/><span><b>SYNAPSE</b><small>WORKSPACE / 001</small></span></Link>
    <div className="adm-nav-label">WORKSPACE</div><nav className="adm-sidebar-nav" aria-label="Administración">{links.map(item => <Link href={item.href} key={item.href}><span aria-hidden="true">{item.icon}</span>{item.label}<i aria-hidden="true">↗</i></Link>)}</nav>
    <div className="adm-sidebar-bottom"><span className="adm-online">ENTORNO DE INVESTIGACIÓN</span><p className="adm-sidebar-person">{adminName}</p><small>Administrador del semillero</small><form method="post" action="/api/admin/auth/logout"><button type="submit">Cerrar sesión <span aria-hidden="true">↗</span></button></form><Link className="adm-back-site" href="/">↖ Ver sitio público</Link></div>
  </aside>;
}
