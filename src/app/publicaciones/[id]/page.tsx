import { notFound } from "next/navigation";
import publicationsData from "@/data/publications.json";

export async function generateStaticParams() {
    return publicationsData.map((pub) => ({ id: pub.id }));
}

interface Props {
    params: Promise<{ id: string }>;
}

export default async function PublicationPage({ params }: Props) {
    const { id } = await params;
    const pub = publicationsData.find((p) => p.id === id);
    if (!pub) notFound();

    return (
        <article className="py-20 bg-white">
            <div className="container mx-auto px-8 md:px-12 max-w-3xl">
                <div className="mb-8">
                    <span className="font-mono text-xs text-synapse-yellow uppercase tracking-wider">{pub.type}</span>
                    <h1 className="font-display text-4xl md:text-5xl text-synapse-black mt-2">{pub.title}</h1>
                    <p className="text-gray-500 mt-4 font-mono text-sm">Año: {pub.year}</p>
                </div>
                <div className="prose max-w-none">
                    <h2 className="font-display text-xl mb-2">Autores</h2>
                    <p className="text-gray-700 mb-6">{pub.authors}</p>

                    {pub.venue && (
                        <>
                            <h2 className="font-display text-xl mb-2">Publicado en</h2>
                            <p className="text-gray-700 mb-6">{pub.venue}</p>
                        </>
                    )}

                    <div className="flex gap-4 mt-8">
                        {pub.link && (
                            <a href={pub.link} target="_blank" rel="noopener noreferrer" className="inline-block font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">
                                Ver publicación →
                            </a>
                        )}
                        {pub.repository && pub.repository !== pub.link && (
                            <a href={pub.repository} target="_blank" rel="noopener noreferrer" className="inline-block font-mono text-sm text-synapse-yellow border-b border-synapse-yellow/50 hover:border-synapse-yellow transition">
                                Repositorio →
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </article>
    );
}
