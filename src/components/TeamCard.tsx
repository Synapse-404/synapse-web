import Link from "next/link";
import { TeamMember } from "@/types";
import TeamAvatar from "@/components/TeamAvatar";
import TeamSocialLinks from "@/components/TeamSocialLinks";

interface Props {
    member: TeamMember;
}

const TeamCard = ({ member }: Props) => {
    return (
        <div className="text-center p-6 bg-gray-50 rounded-sm border border-gray-100 hover:shadow-md transition">
            <TeamAvatar member={member} />
            <h3 className="font-display text-xl">{member.name}</h3>
            <p className="text-synapse-yellow font-mono text-xs mt-1">{member.role}</p>
            {member.groupRole && (
                <p className="mt-2 inline-block bg-synapse-black px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">
                    {member.groupRole}
                </p>
            )}
            <p className="text-gray-500 text-sm mt-3">{member.bio}</p>
            <TeamSocialLinks member={member} />
            <Link href={`/equipo/${member.id}`} className="inline-block mt-3 font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50">
                Ver perfil →
            </Link>
        </div>
    );
};

export default TeamCard;
