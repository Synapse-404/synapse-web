import TeamCard from "@/components/TeamCard";
import {team} from "@/lib/team";
import type { TeamMember } from "@/types";

const groupOrder: Array<NonNullable<TeamMember["group"]>> = ["docente", "coordinación", "investigación", "desarrollo", "documentación"];
const groupLabels: Record<NonNullable<TeamMember["group"]>,{title:string; description:string}> = {
  docente:{title:"Docentes líderes",description:"Orientan el enfoque académico, metodológico e institucional del semillero."},
  coordinación:{title:"Coordinación operativa",description:"Articula el seguimiento a proyectos, compromisos y grupos de trabajo."},
  investigación:{title:"Investigación",description:"Construye preguntas, desarrolla metodologías, analiza datos y genera conocimiento."},
  desarrollo:{title:"Desarrollo",description:"Transforma ideas en prototipos, plataformas y soluciones de software."},
  documentación:{title:"Documentación",description:"Conserva evidencias, bitácoras y productos derivados del trabajo colaborativo."},
};
export const metadata={title:"Equipo",description:"Conoce a las personas y los grupos de trabajo del semillero SYNAPSE."};
export default function TeamPage(){return <div className="inner-page"><div className="content-width">
  <header className="inner-hero"><p className="eyebrow"><span className="eyebrow-dot"/> EQUIPO / COMUNIDAD</p><h1>El talento que mueve<br /><em>las ideas.</em></h1><p>Investigadores, desarrolladores y gestores que comparten un compromiso: hacer que el conocimiento tenga impacto desde el Chocó.</p></header>
  <div className="inner-metrics"><div className="inner-metric"><strong>{String(team.length).padStart(2,"0")}</strong><span>Integrantes</span></div><div className="inner-metric"><strong>03</strong><span>Grupos base</span></div><div className="inner-metric"><strong>01</strong><span>Coordinación operativa</span></div></div>
  <div className="inner-groups">{groupOrder.map(group=>{const members=team.filter(m=>m.group===group);if(!members.length)return null;return <section className="inner-group" key={group}><header><p className="eyebrow"><span className="eyebrow-dot"/>{group.toUpperCase()}</p><h2>{groupLabels[group].title}</h2><p>{groupLabels[group].description}</p></header><div className="team-grid">{members.map(m=><TeamCard member={m} key={m.id}/>)}</div></section>})}</div>
</div></div>}
