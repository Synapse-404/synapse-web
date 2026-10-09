"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import type { Publication } from "@/types";
import { filterPublications } from "@/lib/research-directory";

export default function PublicationsExplorer({ publications }: { publications: Publication[] }) {
  const [type, setType] = useState("todas");
  const [search, setSearch] = useState("");
  const query = useDeferredValue(search);
  const types = Array.from(new Set(publications.map((item) => item.type)));
  const filtered = useMemo(() => filterPublications(publications, type, query), [publications, type, query]);

  return <section className="atlas-catalog atlas-pub-catalog" id="catalogo" aria-labelledby="atlas-pub-catalog-title">
    <div className="content-width">
      <div className="atlas-heading-bar"><div><p className="atlas-kicker"><i /> 01 / ARCHIVO DE CONOCIMIENTO</p><h2 id="atlas-pub-catalog-title">Ideas para <em>compartir.</em></h2></div><p>Un archivo abierto de producción académica, tecnología y aprendizajes del semillero.</p></div>
      <div className="atlas-explorer-toolbar" role="search" aria-label="Filtrar publicaciones">
        <div className="atlas-filter-list" role="group" aria-label="Tipo de publicación">
          <button type="button" aria-pressed={type === "todas"} className={type === "todas" ? "is-selected" : ""} onClick={() => setType("todas")}>Todas <span>{publications.length}</span></button>
          {types.map((item) => <button type="button" aria-pressed={type === item} className={type === item ? "is-selected" : ""} key={item} onClick={() => setType(item)}>{item.charAt(0).toUpperCase() + item.slice(1)} <span>{publications.filter((p) => p.type === item).length}</span></button>)}
        </div>
        <label className="atlas-search"><span aria-hidden="true">⌕</span><span className="sr-only">Buscar publicaciones por título, autor o año</span><input type="search" placeholder="Buscar título, autor o año" autoComplete="off" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
      </div>
      <div className="atlas-results" aria-live="polite"><span>{String(filtered.length).padStart(2, "0")} {filtered.length === 1 ? "PUBLICACIÓN" : "PUBLICACIONES"}</span><span>ARCHIVO / SYNAPSE ↓</span></div>
      {filtered.length ? <div className="atlas-publication-grid">
        {filtered.map((item, i) => <article className={`atlas-publication-item${i === 0 ? " atlas-publication-item--featured" : ""}`} key={item.id}>
          <div className="atlas-pub-visual" aria-hidden="true"><div className="atlas-pub-paper"><span>PUBLICACIÓN / SYNAPSE</span><b>✳</b><i/><i/><i/><small>{String(publications.indexOf(item) + 1).padStart(2, "0")}</small></div><span className="atlas-pub-visual-corner">SYN / KNOWLEDGE</span></div>
          <div className="atlas-pub-item-body"><div className="atlas-pub-item-meta"><span>{item.type.toUpperCase()} / {item.year}</span><span>Nº {String(publications.indexOf(item) + 1).padStart(2, "0")}</span></div><h3><Link href={`/publicaciones/${item.id}`}>{item.title}</Link></h3><div className="atlas-pub-item-footer"><div><span>AUTORÍA</span><p>{item.authors}</p></div><Link className="atlas-circle-link" href={`/publicaciones/${item.id}`} aria-label={`Consultar publicación ${item.title}`}>↗</Link></div></div>
        </article>)}
      </div> : <div className="atlas-empty" role="status"><span aria-hidden="true">✳</span><h3>Sin publicaciones coincidentes.</h3><p>Prueba otra búsqueda o revisa todas las categorías.</p><button type="button" onClick={() => { setType("todas"); setSearch(""); }}>Restablecer filtros ↗</button></div>}
    </div>
  </section>;
}
