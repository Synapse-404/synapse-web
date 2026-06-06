import Link from "next/link";
import { BlogPost } from "@/types";

interface Props {
    post: BlogPost;
}

const BlogCard = ({ post }: Props) => {
    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
    };

    return (
        <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition">
            <p className="font-mono text-[10px] text-synapse-yellow">{formatDate(post.date)}</p>
            <h3 className="font-display text-xl mt-1">{post.title}</h3>
            <p className="text-gray-600 text-sm mt-2">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="inline-block mt-4 font-mono text-xs text-synapse-yellow border-b border-synapse-yellow/50">
                Leer más →
            </Link>
        </div>
    );
};

export default BlogCard;