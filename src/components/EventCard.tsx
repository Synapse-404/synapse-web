import Link from "next/link";
import { Event } from "@/types";

interface Props {
    event: Event;
}

const EventCard = ({ event }: Props) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <div className="bg-gray-50 p-4 rounded-sm flex flex-wrap justify-between items-center gap-4">
            <div>
                <span className="font-mono text-xs text-synapse-yellow">{event.type.toUpperCase()}</span>
                <h3 className="font-display text-lg">{event.title}</h3>
                <p className="text-gray-500 text-sm">{formatDate(event.date)}</p>
            </div>
            <Link href={`/eventos/${event.id}`} className="font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50">
                Más info →
            </Link>
        </div>
    );
};

export default EventCard;