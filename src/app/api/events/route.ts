import { NextResponse } from "next/server";
import eventsData from "@/data/events.json";

export async function GET() {
    return NextResponse.json(eventsData, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}