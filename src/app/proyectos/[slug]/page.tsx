import { notFound } from "next/navigation";
import projectsData from "@/data/projects.json";

export async function generateStaticParams() {
    return projectsData.map((project) => ({ slug: project.slug }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
    const { slug } = await params;
    const project = projectsData.find((p) => p.slug === slug);
    if (!project) notFound();

    return (
        <article className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-4xl">
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className={`font-mono text-xs px-3 py-1 rounded-full ${project.status === "activo" ? "bg-synapse-yellow/10 text-synapse-yellow" : "bg-gray-200 text-gray-600"}`}>
                            {project.status === "activo" ? "Activo" : "Finalizado"}
                        </span>
                        <span className="font-mono text-xs text-gray-400">{project.year}</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-synapse-black">{project.title}</h1>
                </div>
                <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700">{project.description}</p>
                    <h2 className="font-display text-2xl mt-8">Tecnologías utilizadas</h2>
                    <ul className="flex flex-wrap gap-2 list-none pl-0">
                        {project.technologies.map((tech) => (
                            <li key={tech} className="bg-gray-100 px-3 py-1 rounded-full text-sm font-mono">{tech}</li>
                        ))}
                    </ul>
                    <h2 className="font-display text-2xl mt-8">Equipo responsable</h2>
                    <ul>
                        {project.team.map((member) => (
                            <li key={member}>{member}</li>
                        ))}
                    </ul>
                    {project.activities && project.activities.length > 0 && (
                        <>
                            <h2 className="font-display text-2xl mt-8">Qué haremos</h2>
                            <ul>
                                {project.activities.map((activity) => (
                                    <li key={activity}>{activity}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    {project.expectedImpact && project.expectedImpact.length > 0 && (
                        <>
                            <h2 className="font-display text-2xl mt-8">Impacto esperado</h2>
                            <ul>
                                {project.expectedImpact.map((impact) => (
                                    <li key={impact}>{impact}</li>
                                ))}
                            </ul>
                        </>
                    )}
                    {project.repository && (
                        <a href={project.repository} target="_blank" rel="noopener noreferrer" className="inline-block mt-6 font-mono text-synapse-yellow border-b border-synapse-yellow/50">
                            Ver repositorio →
                        </a>
                    )}
                </div>
            </div>
        </article>
    );
}
