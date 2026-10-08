import { NextResponse } from "next/server";
import publicationsData from "@/data/publications.json";

export async function GET() {
    return NextResponse.json(publicationsData, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}