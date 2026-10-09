import Link from "next/link";

const sections = [
  { id: "proyectos", href: "/proyectos", label: "Proyectos", number: "01" },
  { id: "publicaciones", href: "/publicaciones", label: "Publicaciones", number: "02" },
  { id: "equipo", href: "/equipo", label: "Equipo", number: "03" },
] as const;

export default function ResearchSectionNav({ current }: { current: (typeof sections)[number]["id"] }) {
  return (
    <nav className="atlas-nav-rail" aria-label="Explorar SYNAPSE">
      <div className="content-width atlas-nav-rail-inner">
        <span className="atlas-nav-rail-caption">EXPLORA SYNAPSE <span aria-hidden="true">/</span> 001—003</span>
        <div className="atlas-nav-rail-links">
          {sections.map((section) => (
            <Link
              href={section.href}
              key={section.id}
              aria-current={current === section.id ? "page" : undefined}
              className={`atlas-nav-rail-link${current === section.id ? " is-current" : ""}`}
            ><small>{section.number}</small>{section.label}<span aria-hidden="true">↗</span></Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
