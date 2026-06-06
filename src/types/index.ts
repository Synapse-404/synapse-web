export interface Project {
    id: string;
    title: string;
    slug: string;
    description: string;
    status: "activo" | "finalizado";
    year: number;
    technologies: string[];
    team: string[];
    activities?: string[];
    expectedImpact?: string[];
    image?: string;
    repository?: string;
}

export interface Publication {
    id: string;
    title: string;
    authors: string;
    year: number;
    type: "artículo" | "software" | "dataset" | "presentación";
    venue?: string;
    link?: string;
    repository?: string;
}

export interface Event {
    id: string;
    title: string;
    date: string;
    type: "online" | "presencial" | "híbrido";
    description?: string;
    link?: string;
}

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
    author: string;
    content: string;
    image?: string;
}

export interface TeamMember {
    id: string;
    name: string;
    role: string;
    group?: "desarrollo" | "investigación" | "documentación" | "coordinación" | "docente";
    groupRole?: string;
    bio: string;
    responsibilities?: string[];
    image?: string;
    social?: {
        linkedin?: string;
        github?: string;
    };
}
