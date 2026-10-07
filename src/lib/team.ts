import teamData from "@/data/team.json";
import type { TeamMember } from "@/types";

// Toda la información pública de los integrantes proviene de este JSON.
export const team = teamData as TeamMember[];
export const featuredTeam = team.filter((member) => member.featured).slice(0, 4);

export function getTeamMember(id: string) {
    return team.find((member) => member.id === id);
}
