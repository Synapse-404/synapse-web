import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import {notFound} from "next/navigation";
import publications from "@/data/publications.json";
export async function generateStaticParams(){return publications.map(p=>({id:p.id}))}
interface Props{params:Promise<{id:string}>}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = publications.find(item => item.id === id);
  if (!item) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: item.title, description: `${item.title} — publicación académica del semillero de investigación SYNAPSE.`, path: `/publicaciones/${id}`, type: "article" });
}
export default async function PublicationPage({params}:Props){const {id}=await params;const pub=publications.find(p=>p.id===id);if(!pub)notFound();return <article className="inner-page"><div className="content-width"><div className="inner-detail"><Link href="/publicaciones" className="back-link">← Volver a publicaciones</Link><div className="detail-meta"><span className="tag">{pub.type}</span><span>{pub.year} / PRODUCCIÓN ACADÉMICA</span></div><h1 className="detail-heading">{pub.title}</h1><div className="detail-divider"/><section className="detail-section"><h2>Autores</h2><p>{pub.authors}</p></section>{pub.venue&&<section className="detail-section"><h2>Publicado en</h2><p>{pub.venue}</p></section>}<div className="detail-pills">{pub.link&&<a className="detail-external" href={pub.link} target="_blank" rel="noopener noreferrer">Ver publicación ↗</a>}{pub.repository&&pub.repository!==pub.link&&<a className="detail-external" href={pub.repository} target="_blank" rel="noopener noreferrer">Repositorio ↗</a>}</div></div></div></article>}
