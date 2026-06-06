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
        <nav className="fixed top-0 left-0 z-50 w-full bg-synapse-black px-5 py-4 shadow-lg md:px-12">
            <div className="flex items-center justify-between gap-4">
                <Link
                    href="/"
                    className="font-mono tracking-widest"
                    onClick={() => setIsMenuOpen(false)}
                >
                    <Image src="/Recurso7.png" alt="SYNAPSE Logo" width={130} height={100} className="h-auto w-full object-contain" />
                </Link>

                <button
                    type="button"
                    className="inline-flex h-10 w-10 items-center justify-center border border-white/15 text-white transition hover:border-synapse-yellow hover:text-synapse-yellow md:hidden"
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

                <ul className="hidden items-center gap-6 lg:gap-8 md:flex">
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
                className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 md:hidden ${isMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
            >
                <ul className="min-h-0 divide-y divide-white/10 pt-4">
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
