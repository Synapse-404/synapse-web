import Link from "next/link";
import projects from "@/data/projects.json";
import publications from "@/data/publications.json";
import team from "@/data/team.json";
import blog from "@/data/blog.json";

export default function ContentOverviewPage() {
  const catalog=[
    {no:"01",title:"Proyectos",count:projects.length,desc:"Iniciativas y líneas de trabajo de investigación.",href:"/proyectos"},
    {no:"02",title:"Publicaciones",count:publications.length,desc:"Artículos, resultados y divulgación científica.",href:"/publicaciones"},
    {no:"03",title:"Participantes",count:team.length,desc:"Personas y perfiles vinculados al semillero.",href:"/equipo"},
    {no:"04",title:"Bitácora",count:blog.length,desc:"Historias, avances y actividades divulgadas.",href:"/blog"},
  ];
  return <div className="adm-content"><div className="adm-topbar"><span className="adm-overline">WORKSPACE / CONTENIDOS</span><Link href="/admin">← Volver al resumen</Link></div><div className="adm-page-title"><span className="adm-overline">02 / PRODUCCIÓN ACADÉMICA</span><h1>Conocimiento<span>.</span></h1><p>Inventario del contenido público existente. La edición desde el dashboard será una fase posterior.</p></div><div className="adm-content-cards">{catalog.map(item=><article className="adm-content-card" key={item.no}><span className="adm-overline">{item.no} / BIBLIOTECA</span><strong>{String(item.count).padStart(2,"0")}</strong><h2>{item.title}</h2><p>{item.desc}</p><Link href={item.href}>Consultar en el sitio ↗</Link></article>)}</div><p className="adm-inline-note">Los datos de estos módulos todavía provienen de archivos JSON. No se simula que estén administrados en PostgreSQL.</p></div>;
}
