import Link from "next/link";
import type { BlogPost } from "@/types";

export default function BlogCard({ post, index = 0 }: { post: BlogPost; index?: number }) {
  const date = new Date(`${post.date}T12:00:00`).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  return (
    <article className="journal-card">
      <div className="journal-art" aria-hidden="true"><span className="journal-art-circle"/><span className="journal-art-line"/><span className="journal-art-number">{String(index + 1).padStart(2, "0")}</span></div>
      <div className="journal-card-meta"><span>BITÁCORA / {date}</span><span>↗</span></div>
      <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
      <p>{post.excerpt}</p>
      <Link href={`/blog/${post.slug}`} className="journal-read">Leer artículo <span aria-hidden="true">↗</span></Link>
    </article>
  );
}
