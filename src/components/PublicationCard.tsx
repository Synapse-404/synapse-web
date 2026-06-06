import Link from "next/link";
import { Publication } from "@/types";

interface Props {
    publication: Publication;
}

const PublicationCard = ({ publication }: Props) => {
    return (
        <div className="bg-gray-50 p-5 border-l-4 border-synapse-yellow rounded-r-sm">
            <div className="flex justify-between">
                <span className="font-mono text-[10px] text-synapse-yellow">{publication.type}</span>
                <span className="text-gray-400 text-xs">{publication.year}</span>
            </div>
            <h3 className="font-display text-lg mt-1">{publication.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{publication.authors}</p>
            {publication.venue && <p className="text-xs text-gray-500 mt-2">{publication.venue}</p>}
            <Link href={`/publicaciones/${publication.id}`} className="inline-block mt-3 font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50">
                Ver detalles →
            </Link>
        </div>
    );
};

export default PublicationCard;