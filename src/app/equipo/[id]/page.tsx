import { notFound } from "next/navigation";
import teamData from "@/data/team.json";

export async function generateStaticParams() {
    return teamData.map((member) => ({ id: member.id }));
}

interface Props {
    params: Promise<{ id: string }>;
}

export default async function TeamMemberPage({ params }: Props) {
    const { id } = await params;
    const member = teamData.find((m) => m.id === id);
    if (!member) notFound();

    return (
        <article className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-3xl text-center">
                <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full mb-6 flex items-center justify-center text-4xl font-mono text-gray-500">
                    {member.image === "/avatar-placeholder.png" ? "👤" : "📸"}
                </div>
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
                <div className="flex justify-center gap-4 mt-8">
                    {member.social?.linkedin && (
                        <a href={member.social.linkedin} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50">LinkedIn</a>
                    )}
                    {member.social?.github && (
                        <a href={member.social.github} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50">GitHub</a>
                    )}
                </div>
            </div>
        </article>
    );
}
