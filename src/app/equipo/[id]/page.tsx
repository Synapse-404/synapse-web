import { notFound } from "next/navigation";
import { team, getTeamMember } from "@/lib/team";
import TeamAvatar from "@/components/TeamAvatar";
import TeamSocialLinks from "@/components/TeamSocialLinks";

export async function generateStaticParams() {
    return team.map((member) => ({ id: member.id }));
}

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: Props) {
    const { id } = await params;
    const member = getTeamMember(id);
    if (!member) notFound();

    return (
        <article className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
                <TeamAvatar member={member} size="profile" />
                <h1 className="font-display text-4xl md:text-5xl text-synapse-black">{member.name}</h1>
                <p className="text-synapse-yellow font-mono text-sm mt-2">{member.role}</p>
                {member.groupRole && (
                    <p className="mx-auto mt-3 inline-block bg-synapse-black px-3 py-2 font-mono text-xs uppercase tracking-wide text-white">
                        {member.groupRole}
                    </p>
                )}
                <p className="text-gray-600 max-w-xl mx-auto mt-6">{member.bio}</p>
                {member.responsibilities && member.responsibilities.length > 0 && (
                    <div className="mt-8 text-left">
                        <h2 className="font-display text-2xl text-synapse-black">Responsabilidades</h2>
                        <ul className="mt-4 space-y-3 text-gray-600">
                            {member.responsibilities.map((responsibility) => (
                                <li key={responsibility} className="border-l-2 border-synapse-yellow pl-4">
                                    {responsibility}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                <TeamSocialLinks member={member} profile />
            </div>
        </article>
    );
}
