import { NextResponse } from "next/server";
import { team } from "@/lib/team";

export async function GET() {
    return NextResponse.json(team);
}
