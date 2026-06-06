import { NextResponse } from "next/server";
import teamData from "@/data/team.json";

export async function GET() {
    return NextResponse.json(teamData);
}