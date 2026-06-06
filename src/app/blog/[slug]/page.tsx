import { notFound } from "next/navigation";
import blogData from "@/data/blog.json";

export async function generateStaticParams() {
    return blogData.map((post) => ({ slug: post.slug }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogData.find((p) => p.slug === slug);
    if (!post) notFound();

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
    };

    return (
        <article className="py-20 bg-white">
            <div className="container mx-auto px-6 md:px-12 max-w-3xl">
                <div className="mb-8">
                    <p className="font-mono text-xs text-synapse-yellow">{formatDate(post.date)} · Por {post.author}</p>
                    <h1 className="font-display text-4xl md:text-5xl text-synapse-black mt-2">{post.title}</h1>
                </div>
                <div className="prose max-w-none">
                    <p>{post.content || "Contenido completo próximamente."}</p>
                </div>
            </div>
        </article>
    );
}