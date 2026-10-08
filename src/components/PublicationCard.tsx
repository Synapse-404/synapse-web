import Link from "next/link";
import type { Publication } from "@/types";

export default function PublicationCard({ publication, index = 0 }: { publication: Publication; index?: number }) {
  return (
    <article className="publication-row">
      <span className="publication-number">{String(index + 1).padStart(2, "0")}</span>
      <div className="publication-body"><span className="small-label">{publication.type} · {publication.year}</span><h3>{publication.title}</h3><p>{publication.authors}</p></div>
      <Link href={`/publicaciones/${publication.id}`} className="publication-link" aria-label={`Ver detalles de ${publication.title}`}>↗</Link>
    </article>
  );
}
