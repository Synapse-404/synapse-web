import { NextRequest, NextResponse } from "next/server";
import projectsData from "@/data/projects.json";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = projectsData.find((p) => p.id === id);
    if (!project) {
        return NextResponse.json({ error: "Proyecto no encontrado" }, { status: 404 });
    }
    return NextResponse.json(project);
}