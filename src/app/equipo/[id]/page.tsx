import type { Metadata } from "next";
import { createSeoMetadata } from "@/lib/seo";
import Link from "next/link";
import {notFound} from "next/navigation";
import {team,getTeamMember} from "@/lib/team";
import TeamAvatar from "@/components/TeamAvatar";
import TeamSocialLinks from "@/components/TeamSocialLinks";
export async function generateStaticParams(){return team.map(m=>({id:m.id}))}
interface Props {params:Promise<{id:string}>}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = team.find(item => item.id === id);
  if (!item) return { robots: { index: false, follow: false } };
  return createSeoMetadata({ title: item.name, description: item.bio, path: `/equipo/${id}`, type: "website" });
}
export default async function TeamMemberPage({params}:Props){const {id}=await params;const member=getTeamMember(id);if(!member)notFound();return <article className="inner-page"><div className="content-width"><div className="inner-detail"><Link href="/equipo" className="back-link">← Volver al equipo</Link><div className="profile-detail"><TeamAvatar member={member} size="profile"/><div><div className="detail-meta"><span className="tag">{member.groupRole??member.group??"Semillerista"}</span><span>SYNAPSE / EQUIPO</span></div><h1 className="detail-heading">{member.name}</h1><p className="detail-meta">{member.role}</p><p className="detail-lead">{member.bio}</p>{!!member.responsibilities?.length&&<section className="detail-section"><h2>Responsabilidades</h2><ul>{member.responsibilities.map(t=><li key={t}>{t}</li>)}</ul></section>}<div className="profile-social"><TeamSocialLinks member={member} profile/></div></div></div></div></div></article>}
