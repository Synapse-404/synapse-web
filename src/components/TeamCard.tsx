import Link from "next/link";
import { TeamMember } from "@/types";

interface Props {
    member: TeamMember;
}

const TeamCard = ({ member }: Props) => {
    return (
        <div className="text-center p-6 bg-gray-50 rounded-sm border border-gray-100 hover:shadow-md transition">
            <div className="w-24 h-24 mx-auto bg-gray-200 rounded-full mb-4 flex items-center justify-center text-3xl font-mono text-gray-500">
                {member.image === "/avatar-placeholder.png" ? "👤" : "📸"}
            </div>
            <h3 className="font-display text-xl">{member.name}</h3>
            <p className="text-synapse-yellow font-mono text-xs mt-1">{member.role}</p>
            {member.groupRole && (
                <p className="mt-2 inline-block bg-synapse-black px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-white">
                    {member.groupRole}
                </p>
            )}
            <p className="text-gray-500 text-sm mt-3">{member.bio}</p>
            <div className="flex justify-center gap-3 mt-4">
                {member.social?.linkedin && (
                    <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-synapse-yellow text-xs">LinkedIn</a>
                )}
                {member.social?.github && (
                    <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-synapse-yellow text-xs">GitHub</a>
                )}
            </div>
            <Link href={`/equipo/${member.id}`} className="inline-block mt-3 font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50">
                Ver perfil →
            </Link>
        </div>
    );
};

export default TeamCard;
