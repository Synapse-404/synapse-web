import PublicationCard from "@/components/PublicationCard";
import publicationsData from "@/data/publications.json";
import type {Publication} from "@/types";
const publications=publicationsData as Publication[];
export const metadata={title:"Publicaciones",description:"Producción académica y tecnológica del semillero de investigación SYNAPSE."};
export default function PublicationsPage(){const types=Array.from(new Set(publications.map(p=>p.type)));return <div className="inner-page"><div className="content-width"><header className="inner-hero"><p className="eyebrow"><span className="eyebrow-dot"/> PUBLICACIONES / CONOCIMIENTO</p><h1>Conocimiento que<br /><em>se comparte.</em></h1><p>Resultados de investigación, artículos, proyectos de software y producción académica del semillero.</p></header><div className="detail-pills">{types.map(t=><span key={t}>{t}</span>)}</div><div className="publication-list">{publications.map((p,i)=><PublicationCard publication={p} index={i} key={p.id}/>)}</div></div></div>}
