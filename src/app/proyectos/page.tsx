import ProjectCard from "@/components/ProjectCard";
import projectsData from "@/data/projects.json";
import { Project } from "@/types";

const projects = projectsData as Project[];

export const metadata = {
    title: "Proyectos | SYNAPSE",
    description: "Proyectos en desarrollo del semillero de investigación SYNAPSE.",
};

export default function ProjectsPage() {
    const activeProjects = projects.filter((project) => project.status === "activo").length;

    return (
        <section className="bg-gray-50 py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-12 max-w-3xl">
                    <span className="font-mono text-xs tracking-wider text-synapse-yellow">Proyectos en desarrollo</span>
                    <h1 className="mt-3 font-display text-4xl text-synapse-black md:text-5xl">
                        Soluciones con enfoque en <span className="text-synapse-yellow">Quibdó, Chocó</span>
                    </h1>
                    <p className="mt-5 text-gray-600">
                        Iniciativas de investigación aplicada, desarrollo de software, inteligencia artificial y datos para responder a necesidades educativas, sociales y ambientales del territorio.
                    </p>
                </div>

                <div className="mb-10 grid gap-4 sm:grid-cols-3">
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">{projects.length}</p>
                        <p className="font-mono text-xs text-white/60">Proyectos registrados</p>
                    </div>
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">{activeProjects}</p>
                        <p className="font-mono text-xs text-white/60">En desarrollo</p>
                    </div>
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">{projects.filter((project) => project.status === "finalizado").length}</p>
                        <p className="font-mono text-xs text-white/60">Proyectos finalizados</p>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </div>
        </section>
    );
}
