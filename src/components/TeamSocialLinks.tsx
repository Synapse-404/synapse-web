import type { TeamMember } from "@/types";

const labels: Record<string, string> = {
    linkedin: "LinkedIn",
    github: "GitHub",
    instagram: "Instagram",
    facebook: "Facebook",
    x: "X",
    youtube: "YouTube",
    tiktok: "TikTok",
    website: "Sitio web",
    orcid: "ORCID",
};

export default function TeamSocialLinks({ member, profile = false }: {
    member: Pick<TeamMember, "name" | "social">;
    profile?: boolean;
}) {
    const links = Object.entries(member.social ?? {}).filter(([, url]) => {
        try {
            return ["https:", "http:"].includes(new URL(url).protocol);
        } catch {
            return false;
        }
    });
    if (links.length === 0) return null;

    return (
        <div className={`flex flex-wrap justify-center gap-x-4 gap-y-2 ${profile ? "mt-8" : "mt-4"}`}>
            {links.map(([network, url]) => (
                <a key={network} href={url} target="_blank" rel="noopener noreferrer"
                    aria-label={`${labels[network] ?? network} de ${member.name} (abre en otra pestaña)`}
                    className="inline-flex min-h-6 items-center font-mono text-xs text-gray-600 underline decoration-gray-300 underline-offset-4 hover:text-synapse-yellow focus-visible:outline-2 focus-visible:outline-offset-4">
                    {labels[network] ?? network}
                </a>
            ))}
        </div>
    );
}
