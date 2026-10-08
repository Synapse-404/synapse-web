import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import {notFound} from "next/navigation";
import posts from "@/data/blog.json";
export async function generateStaticParams(){return posts.map(p=>({slug:p.slug}))}
interface Props{params:Promise<{slug:string}>}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = posts.find(item => item.slug === slug);
  if (!item) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: item.title, description: item.excerpt, path: `/blog/${slug}`, type: "article", publishedTime: item.date });
}
export default async function BlogPostPage({params}:Props){const {slug}=await params;const post=posts.find(p=>p.slug===slug);if(!post)notFound();const date=new Date(`${post.date}T12:00:00`).toLocaleDateString("es-CO",{day:"numeric",month:"long",year:"numeric"});return <article className="inner-page"><div className="content-width"><div className="inner-detail"><Link href="/blog" className="back-link">← Volver a la bitácora</Link><div className="detail-meta"><span className="tag">BITÁCORA</span><span>{date} / {post.author}</span></div><h1 className="detail-heading">{post.title}</h1><p className="detail-lead">{post.excerpt}</p><div className="detail-divider"/><section className="detail-section"><p>{post.content||"Contenido disponible próximamente."}</p></section></div></div></article>}
