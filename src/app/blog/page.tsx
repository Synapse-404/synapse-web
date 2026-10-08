import { createSeoMetadata } from "@/lib/seo";
import BlogCard from "@/components/BlogCard";
import blogData from "@/data/blog.json";
import type {BlogPost} from "@/types";
const posts=(blogData as BlogPost[]).slice().sort((a,b)=>b.date.localeCompare(a.date));
export const metadata = createSeoMetadata({ title: 'Bitácora', description: 'Noticias, aprendizajes, encuentros y avances de los proyectos del semillero de investigación SYNAPSE.', path: '/blog' });
export default function BlogPage(){return <div className="inner-page"><div className="content-width"><header className="inner-hero"><p className="eyebrow"><span className="eyebrow-dot"/> BITÁCORA / ACTUALIDAD</p><h1>Todo avance<br /><em>tiene una historia.</em></h1><p>Seguimos el proceso de investigación: aprendizajes, encuentros y proyectos que dan forma a SYNAPSE.</p></header><div className="journal-grid">{posts.map((p,i)=><BlogCard post={p} index={i} key={p.id}/>)}</div></div></div>}
