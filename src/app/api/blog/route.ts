import { NextResponse } from "next/server";
import blogData from "@/data/blog.json";

export async function GET() {
    return NextResponse.json(blogData, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}