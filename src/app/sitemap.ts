import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import projects from "@/data/projects.json";
import publications from "@/data/publications.json";
import posts from "@/data/blog.json";
import { team } from "@/lib/team";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: Array<{ path: string; priority: number }> = [
    { path: "/", priority: 1 },
    { path: "/proyectos", priority: 0.9 },
    { path: "/publicaciones", priority: 0.8 },
    { path: "/equipo", priority: 0.7 },
    { path: "/blog", priority: 0.7 },
  ];

  const paths = [
    ...staticPages,
    ...projects.map(({ slug }) => ({ path: `/proyectos/${encodeURIComponent(slug)}`, priority: 0.7 })),
    ...publications.map(({ id }) => ({ path: `/publicaciones/${encodeURIComponent(id)}`, priority: 0.6 })),
    ...team.map(({ id }) => ({ path: `/equipo/${encodeURIComponent(id)}`, priority: 0.5 })),
    ...posts.map(({ slug }) => ({ path: `/blog/${encodeURIComponent(slug)}`, priority: 0.6 })),
  ];

  return paths.map(({ path, priority }) => ({
    url: new URL(path, siteUrl).toString(),
    priority,
    changeFrequency: "monthly" as const,
  }));
}
