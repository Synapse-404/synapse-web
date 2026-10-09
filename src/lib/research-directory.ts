import type { Project, Publication } from "@/types";

function normalize(value: unknown): string {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es")
    .trim();
}

/** Filtra sin modificar el orden original ni los objetos de origen. */
export function filterProjects(projects: readonly Project[], status: "todos" | Project["status"], search: string): Project[] {
  const query = normalize(search);
  return projects.filter((project) => {
    if (status !== "todos" && project.status !== status) return false;
    const content = normalize([project.title, project.description, project.year, ...project.technologies, ...project.team].join(" "));
    return !query || content.includes(query);
  });
}

/** Filtra por formato y términos bibliográficos, ignorando mayúsculas y tildes. */
export function filterPublications(publications: readonly Publication[], type: string, search: string): Publication[] {
  const query = normalize(search);
  return publications.filter((publication) => {
    if (type !== "todas" && publication.type !== type) return false;
    const content = normalize([publication.title, publication.authors, publication.year, publication.type, publication.venue].join(" "));
    return !query || content.includes(query);
  });
}

/** No ofrecer enlaces ficticios usados como marcadores en los JSON. */
export function isExternalResource(link?: string): boolean {
  return Boolean(link && /^https?:\/\/[^\s]+/i.test(link.trim()));
}
