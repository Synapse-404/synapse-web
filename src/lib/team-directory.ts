import type { TeamMember } from "@/types";

export type TeamDirectoryGroup = NonNullable<TeamMember["group"]> | "todos";

export function normalizeTeamQuery(value: string): string {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es").trim();
}

/** Filters only public profile fields; never mutates the source array. */
export function filterTeamMembers(
  members: TeamMember[],
  activeGroup: TeamDirectoryGroup,
  search: string,
): TeamMember[] {
  const query = normalizeTeamQuery(search);
  return members.filter((member) => {
    if (activeGroup !== "todos" && member.group !== activeGroup) return false;
    if (!query) return true;
    const searchable = [member.name, member.role, member.groupRole, member.bio, member.group]
      .filter(Boolean).join(" ");
    return normalizeTeamQuery(searchable).includes(query);
  });
}
