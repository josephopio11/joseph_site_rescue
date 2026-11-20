import { NextResponse } from "next/server"
import { listPublishedProjects } from "@/lib/projects"

export async function GET() {
  return NextResponse.json({ projects: listPublishedProjects() })
}