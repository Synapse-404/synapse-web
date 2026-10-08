import { NextResponse } from "next/server";
import projectsData from "@/data/projects.json";

export async function GET() {
    return NextResponse.json(projectsData, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}