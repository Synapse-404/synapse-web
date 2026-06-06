import PublicationCard from "@/components/PublicationCard";
import publicationsData from "@/data/publications.json";
import { Publication } from "@/types";

const publications = publicationsData as Publication[];

export const metadata = {
    title: "Publicaciones | SYNAPSE",
    description: "Producción académica y tecnológica del semillero de investigación SYNAPSE.",
};

export default function PublicationsPage() {
    const publicationTypes = Array.from(new Set(publications.map((publication) => publication.type)));

    return (
        <section className="bg-white py-20">
            <div className="container mx-auto px-6 md:px-12">
                <div className="mb-12 max-w-3xl">
                    <span className="font-mono text-xs tracking-wider text-synapse-yellow">Producción académica</span>
                    <h1 className="mt-3 font-display text-4xl text-synapse-black md:text-5xl">
                        Conocimiento que <span className="text-synapse-yellow">documenta el impacto</span>
                    </h1>
                    <p className="mt-5 text-gray-600">
                        Publicaciones, software, datasets y productos de investigación derivados de los proyectos del semillero.
                    </p>
                </div>

                <div className="mb-10 flex flex-wrap gap-3">
                    {publicationTypes.map((type) => (
                        <span key={type} className="bg-synapse-black px-3 py-2 font-mono text-xs uppercase tracking-wide text-white">
                            {type}
                        </span>
                    ))}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {publications.map((publication) => (
                        <PublicationCard key={publication.id} publication={publication} />
                    ))}
                </div>
            </div>
        </section>
    );
}
