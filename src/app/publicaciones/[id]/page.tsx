import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ResearchSectionNav from "@/components/ResearchSectionNav";
import { createSeoMetadata } from "@/lib/seo";
import publicationsData from "@/data/publications.json";
import type { Publication } from "@/types";
import { isExternalResource } from "@/lib/research-directory";

const publications = publicationsData as Publication[];
export async function generateStaticParams() { return publications.map((item) => ({ id: item.id })); }
interface Props { params: Promise<{ id: string }> }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const publication = publications.find((item) => item.id === id);
  if (!publication) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: publication.title, description: `${publication.title} — publicación académica del semillero de investigación SYNAPSE.`, path: `/publicaciones/${id}`, type: "article" });
}

export default async function PublicationPage({ params }: Props) {
  const { id } = await params;
  const pub = publications.find((item) => item.id === id);
  if (!pub) notFound();
  const index = publications.findIndex((item) => item.id === id);
  const related = publications.filter((item) => item.id !== pub.id).slice(0,2);
  const officialLink = isExternalResource(pub.link) ? pub.link : null;
  const repositoryLink = isExternalResource(pub.repository) && pub.repository !== officialLink ? pub.repository : null;

  return <div className="atlas-page atlas-detail-page atlas-publication-detail">
    <header className="atlas-detail-hero"><div className="content-width">
      <nav className="atlas-breadcrumb" aria-label="Ruta de navegación"><Link href="/">Inicio</Link><span>/</span><Link href="/publicaciones">Publicaciones</Link><span>/</span><span aria-current="page">{pub.title}</span></nav>
      <div className="atlas-detail-hero-grid"><div className="atlas-detail-hero-copy"><p className="atlas-kicker"><i /> ARCHIVO DE CONOCIMIENTO / {String(index+1).padStart(2,"0")}</p><div className="atlas-detail-tags"><span>{pub.type.toUpperCase()}</span><span>{pub.year}</span></div><h1>{pub.title}<em>.</em></h1><p className="atlas-detail-summary">Una contribución a la producción académica y tecnológica del semillero de investigación SYNAPSE.</p><div className="atlas-detail-hero-links"><a href="#ficha" className="atlas-button atlas-button--amber">Ver ficha de publicación <span aria-hidden="true">↓</span></a><Link href="/publicaciones" className="atlas-quiet-link">Volver al archivo <span aria-hidden="true">↗</span></Link></div></div>
      <div className="atlas-detail-art atlas-detail-art--paper" aria-hidden="true"><div className="atlas-journal"><span>SYNAPSE / ACADEMIC ARCHIVE</span><b>✳</b><i/><i/><i/><small>0{index+1} / {pub.year}</small></div><span className="atlas-art-top">PUBLICACIÓN / {String(index+1).padStart(2,"0")}</span><span className="atlas-art-bottom">INVESTIGACIÓN QUE SE COMPARTE</span></div></div>
      <div className="atlas-detail-hero-foot"><span>PRODUCCIÓN ACADÉMICA</span><span>REGISTRO {String(index+1).padStart(2,"0")} / {String(publications.length).padStart(2,"0")}</span></div>
    </div></header>
    <ResearchSectionNav current="publicaciones" />
    <section className="atlas-detail-content" id="ficha" aria-label="Ficha de publicación"><div className="content-width">
      <div className="atlas-detail-topbar"><span><i className="atlas-live-dot"/> 01 / LA PUBLICACIÓN</span><span>ARCHIVO / SYNAPSE</span></div>
      <div className="atlas-detail-layout"><div className="atlas-detail-primary"><p className="atlas-detail-intro-label">PRODUCCIÓN DE CONOCIMIENTO</p><h2>Investigar.<br/><em>Documentar.</em> Compartir.</h2><p className="atlas-detail-text">Esta ficha reúne los datos bibliográficos disponibles para identificar la publicación, su autoría y los recursos relacionados.</p>
        <section className="atlas-detail-block" aria-labelledby="publication-authors"><div className="atlas-detail-block-head"><span>02 / AUTORÍA</span><h3 id="publication-authors">Quiénes firman.</h3></div><div className="atlas-author-block"><span aria-hidden="true">✳</span><p>{pub.authors}</p></div></section>
        {pub.venue && <section className="atlas-detail-block" aria-labelledby="publication-venue"><div className="atlas-detail-block-head"><span>03 / REFERENCIA</span><h3 id="publication-venue">Dónde se publicó.</h3></div><p className="atlas-detail-text">{pub.venue}</p></section>}
        {(officialLink || repositoryLink) ? <section className="atlas-detail-block" aria-label="Recursos de publicación"><div className="atlas-detail-block-head"><span>04 / RECURSOS</span><h3>Continúa leyendo.</h3></div><div className="atlas-resource-list">{officialLink && <a href={officialLink} target="_blank" rel="noopener noreferrer">Consultar publicación <span aria-hidden="true">↗</span></a>}{repositoryLink && <a href={repositoryLink} target="_blank" rel="noopener noreferrer">Ver repositorio <span aria-hidden="true">↗</span></a>}</div></section> : <p className="atlas-resource-note">No hay un enlace externo disponible para este registro.</p>}
      </div><aside className="atlas-detail-aside"><div className="atlas-aside-panel atlas-aside-panel--dark"><span className="atlas-aside-label">REGISTRO BIBLIOGRÁFICO</span><h3>Ficha de<br/>la publicación<span>.</span></h3><dl><div><dt>TIPO</dt><dd className="atlas-capitalize">{pub.type}</dd></div><div><dt>AÑO</dt><dd>{pub.year}</dd></div><div><dt>REGISTRO</dt><dd>{String(index+1).padStart(2,"0")}</dd></div></dl></div><div className="atlas-aside-panel"><span className="atlas-aside-label">AUTORÍA</span><p className="atlas-aside-description">{pub.authors}</p>{pub.venue && <><span className="atlas-aside-label">PUBLICADO EN</span><p className="atlas-aside-description">{pub.venue}</p></>}</div><div className="atlas-aside-panel atlas-aside-panel--light"><span className="atlas-aside-label">UN MISMO PROPÓSITO</span><p>De la investigación aplicada al conocimiento que otras personas pueden explorar.</p><Link className="atlas-aside-link" href="/proyectos">Conoce los proyectos ↗</Link></div></aside></div>
    </div></section>
    {related.length > 0 && <section className="atlas-related-section" aria-labelledby="related-publications"><div className="content-width"><div className="atlas-related-heading"><div><p className="atlas-kicker"><i/> MÁS CONOCIMIENTO</p><h2 id="related-publications">Sigue <em>explorando.</em></h2></div><Link className="atlas-related-all" href="/publicaciones">Ver todas ↗</Link></div><div className="atlas-related-grid">{related.map((item) => <Link className="atlas-related-tile" key={item.id} href={`/publicaciones/${item.id}`}><div><span>{item.type.toUpperCase()}</span><span>{item.year}</span></div><h3>{item.title}</h3><p>{item.authors}</p><b aria-hidden="true">↗</b></Link>)}</div></div></section>}
    <nav className="atlas-bottom-navigation" aria-label="Navegar entre publicaciones"><div className="content-width"><Link href="/publicaciones"><span>←</span> Volver a publicaciones</Link><Link href={`/publicaciones/${publications[(index+1)%publications.length].id}`}>Siguiente publicación <span>↗</span></Link></div></nav>
  </div>;
}
