import { NextResponse } from "next/server";
import publicationsData from "@/data/publications.json";

export async function GET() {
    return NextResponse.json(publicationsData);
}