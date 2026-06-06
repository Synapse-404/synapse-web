import Link from "next/link";
import { Project } from "@/types";

interface Props {
    project: Project;
}

const ProjectCard = ({ project }: Props) => {
    return (
        <div className="bg-white border border-gray-200 p-6 rounded-sm hover:shadow-lg transition">
            <div className="flex justify-between items-start mb-4">
                <span className={`font-mono text-[10px] px-3 py-1 rounded-full ${project.status === "activo" ? "bg-synapse-yellow/10 text-synapse-yellow" : "bg-gray-200 text-gray-600"
                    }`}>
                    {project.status === "activo" ? "Activo" : "Finalizado"}
                </span>
                <span className="font-mono text-[10px] text-gray-400">{project.year}</span>
            </div>
            <h3 className="font-display text-xl text-synapse-black mb-2">{project.title}</h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
                {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="text-[10px] font-mono bg-synapse-black text-white px-2 py-1">{tech}</span>
                ))}
            </div>
            <Link href={`/proyectos/${project.slug}`} className="font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">
                Ver proyecto →
            </Link>
        </div>
    );
};

export default ProjectCard;