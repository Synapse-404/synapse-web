import Link from "next/link";
import type { TeamMember } from "@/types";
import TeamAvatar from "@/components/TeamAvatar";
import TeamSocialLinks from "@/components/TeamSocialLinks";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <article className="team-card">
      <div className="team-card-photo"><TeamAvatar member={member} /><span className="team-card-spark" aria-hidden="true">✳</span></div>
      <div className="team-card-description"><span className="small-label">{member.groupRole ?? member.group ?? "INVESTIGACIÓN"}</span><h3>{member.name}</h3><p className="team-role">{member.role}</p><p className="team-bio">{member.bio}</p><TeamSocialLinks member={member} /><Link href={`/equipo/${member.id}`} className="team-profile-link">Ver perfil <span aria-hidden="true">↗</span></Link></div>
    </article>
  );
}
