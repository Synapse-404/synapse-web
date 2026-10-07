"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const links = [
        { href: "/", label: "Inicio" },
        { href: "/#proyectos", label: "Proyectos" },
        { href: "/#publicaciones", label: "Publicaciones" },
        { href: "/#lineas", label: "Líneas" },
        { href: "/#bitacora", label: "Bitácora" },
        { href: "/#equipo", label: "Equipo" },
        { href: "/#galeria", label: "Galería" },
        { href: "/#contacto", label: "Únete" },
    ];

    return (
        <nav className="fixed top-0 left-0 z-50 h-[var(--navbar-height)] w-full bg-synapse-black px-5 shadow-lg md:px-12" aria-label="Navegación principal">
            <div className="flex h-full items-center justify-between gap-4">
                <Link
                    href="/"
                    className="min-w-0 shrink font-mono tracking-widest"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Image src="/Recurso7.png" alt="SYNAPSE Logo" width={130} height={100} className="h-14 w-auto max-w-full object-contain lg:h-16" />
                </Link>

                <button
                    type="button"
                    className="inline-flex h-11 w-11 shrink-0 items-center justify-center border border-white/15 text-white transition hover:border-synapse-yellow hover:text-synapse-yellow lg:hidden"
                    aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                    aria-expanded={isMenuOpen}
                    aria-controls="mobile-menu"
                    onClick={() => setIsMenuOpen((open) => !open)}
                >
                    <span className="sr-only">{isMenuOpen ? "Cerrar menú" : "Abrir menú"}</span>
                    <span className="relative block h-4 w-5" aria-hidden="true">
                        <span className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition ${isMenuOpen ? "translate-y-2 rotate-45" : ""}`} />
                        <span className={`absolute left-0 top-2 h-0.5 w-5 bg-current transition ${isMenuOpen ? "opacity-0" : ""}`} />
                        <span className={`absolute left-0 top-4 h-0.5 w-5 bg-current transition ${isMenuOpen ? "-translate-y-2 -rotate-45" : ""}`} />
                    </span>
                </button>

                <ul className="hidden items-center gap-6 xl:gap-8 lg:flex">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="text-xs uppercase tracking-wide text-white/50 transition hover:text-synapse-yellow"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                id="mobile-menu"
                hidden={!isMenuOpen}
                className="absolute inset-x-0 top-full max-h-[calc(100dvh-var(--navbar-height))] overflow-y-auto bg-synapse-black px-5 pb-4 shadow-lg md:px-12 lg:hidden"
            >
                <ul className="divide-y divide-white/10 border-t border-white/10">
                    {links.map((link) => (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className="block py-3 font-mono text-xs uppercase tracking-wide text-white/70 transition hover:text-synapse-yellow"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
