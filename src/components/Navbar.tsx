"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/#identidad", label: "Nosotros" },
  { href: "/proyectos", label: "Proyectos" },
  { href: "/publicaciones", label: "Publicaciones" },
  { href: "/equipo", label: "Equipo" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="site-header">
      <nav aria-label="Navegación principal" className="site-nav">
        <Link className="nav-brand" href="/" onClick={() => setOpen(false)} aria-label="SYNAPSE — inicio">
          <Image src="/synapse-wordmark.png" width={680} height={165} alt="SYNAPSE" priority className="nav-logo" />
          <span className="nav-brand-divider" aria-hidden="true" />
          <span className="nav-brand-label">SEMILLERO DE INVESTIGACIÓN</span>
        </Link>
        <div className="nav-links">
          {links.map((link) => <Link key={link.href} href={link.href} className={`nav-link ${pathname === link.href ? "is-active" : ""}`}>{link.label}</Link>)}
        </div>
        <Link href="/#contacto" className="nav-contact">Únete al semillero <span aria-hidden="true">↗</span></Link>
        <button className={`nav-toggle ${open ? "is-open" : ""}`} type="button" aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="menu-movil" onClick={() => setOpen(value => !value)}>
          <span /><span />
        </button>
      </nav>
      <div className={`mobile-nav ${open ? "mobile-nav-open" : ""}`} id="menu-movil" inert={!open}>
        {[{ href: "/", label: "Inicio" }, ...links, { href: "/blog", label: "Bitácora" }, { href: "/#contacto", label: "Únete a SYNAPSE" }].map((link, i) => (
          <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="mobile-nav-link"><span>0{i + 1}</span>{link.label}<span aria-hidden="true">↗</span></Link>
        ))}
        <p className="mobile-nav-caption">INVESTIGAMOS · DESARROLLAMOS · IMPACTAMOS</p>
      </div>
    </header>
  );
}
