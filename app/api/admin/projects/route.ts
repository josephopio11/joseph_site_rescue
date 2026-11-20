import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import {
  listAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/projects"

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  return NextResponse.json({ projects: listAllProjects() })
}

export async function POST(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const body = await req.json()
  const project = createProject({
    title: body.title,
    description: body.description ?? null,
    body: body.body ?? null,
    url: body.url ?? null,
    repo: body.repo ?? null,
    tech: body.tech ?? null,
    image: body.image ?? null,
    published: body.published ?? false,
  })
  return NextResponse.json({ project }, { status: 201 })
}

export async function PUT(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const body = await req.json()
  const project = updateProject(Number(body.id), {
    title: body.title,
    description: body.description ?? null,
    body: body.body ?? null,
    url: body.url ?? null,
    repo: body.repo ?? null,
    tech: body.tech ?? null,
    image: body.image ?? null,
    published: body.published,
  })
  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ project })
}

export async function DELETE(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const { id } = await req.json().catch(() => ({}))
  const ok = deleteProject(Number(id))
  return NextResponse.json({ ok })
}