import { NextResponse } from "next/server";
import { team } from "@/lib/team";

export async function GET() {
    return NextResponse.json(team, { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=3600" } });
}
