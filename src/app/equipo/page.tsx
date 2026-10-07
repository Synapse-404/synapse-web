import TeamCard from "@/components/TeamCard";
import { team } from "@/lib/team";
import { TeamMember } from "@/types";

const groupOrder: Array<NonNullable<TeamMember["group"]>> = [
    "docente",
    "coordinación",
    "investigación",
    "desarrollo",
    "documentación",
];

const groupLabels: Record<NonNullable<TeamMember["group"]>, { title: string; description: string }> = {
    docente: {
        title: "Docentes líderes",
        description: "Orientan la ruta académica, metodológica e institucional del semillero.",
    },
    coordinación: {
        title: "Coordinación operativa",
        description: "Fiscaliza compromisos, consolida avances y conecta a los líderes de grupo con los docentes líderes del semillero.",
    },
    investigación: {
        title: "Grupo de investigación",
        description: "Formula metodologías, analiza datos y produce conocimiento académico.",
    },
    desarrollo: {
        title: "Grupo de desarrollo",
        description: "Construye prototipos, plataformas, tableros y soluciones de software.",
    },
    documentación: {
        title: "Grupo de documentación",
        description: "Sistematiza avances, evidencias, bitácoras, informes y entregables.",
    },
};

export const metadata = {
    title: "Equipo | SYNAPSE",
    description: "Integrantes y estructura de trabajo del semillero de investigación SYNAPSE.",
};

export default function TeamPage() {
    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-12 max-w-3xl">
                    <span className="font-mono text-xs tracking-wider text-synapse-yellow">Estructura del semillero</span>
                    <h1 className="mt-3 font-display text-4xl text-synapse-black md:text-5xl">
                        Equipo organizado por <span className="text-synapse-yellow">grupos de trabajo</span>
                    </h1>
                    <p className="mt-5 text-gray-600">
                        SYNAPSE articula sus actividades en grupos de investigación, desarrollo y documentación, con una coordinación operativa encargada de hacer seguimiento a compromisos y mantener comunicación directa con los líderes y los docentes líderes.
                    </p>
                </div>

                <div className="mb-12 grid gap-4 md:grid-cols-3">
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">{team.length}</p>
                        <p className="font-mono text-xs text-white/60">Integrantes</p>
                    </div>
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">3</p>
                        <p className="font-mono text-xs text-white/60">Grupos base</p>
                    </div>
                    <div className="bg-synapse-black p-5 text-white">
                        <p className="font-display text-3xl text-synapse-yellow">1</p>
                        <p className="font-mono text-xs text-white/60">Enlace operativo</p>
                    </div>
                </div>

                <div className="space-y-14">
                    {groupOrder.map((group) => {
                        const members = team.filter((member) => member.group === group);
                        if (members.length === 0) return null;

                        return (
                            <section key={group} className="border-t border-gray-100 pt-10">
                                <div className="mb-6 max-w-2xl">
                                    <span className="font-mono text-xs uppercase tracking-wide text-synapse-yellow">{group}</span>
                                    <h2 className="mt-2 font-display text-3xl text-synapse-black">{groupLabels[group].title}</h2>
                                    <p className="mt-3 text-sm text-gray-600">{groupLabels[group].description}</p>
                                </div>
                                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                    {members.map((member) => (
                                        <TeamCard key={member.id} member={member} />
                                    ))}
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
