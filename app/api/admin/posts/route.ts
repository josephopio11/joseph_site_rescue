import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import {
  listAllPosts,
  createPost,
  updatePost,
  deletePost,
} from "@/lib/posts"

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  return NextResponse.json({ posts: listAllPosts() })
}

export async function POST(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const body = await req.json()
  const post = createPost({
    title: body.title,
    body: body.body,
    excerpt: body.excerpt ?? null,
    category: body.category ?? null,
    published: body.published ?? false,
  })
  return NextResponse.json({ post }, { status: 201 })
}

export async function PUT(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const body = await req.json()
  const post = updatePost(Number(body.id), {
    title: body.title,
    body: body.body,
    excerpt: body.excerpt ?? null,
    category: body.category ?? null,
    published: body.published,
  })
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
  return NextResponse.json({ post })
}

export async function DELETE(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const { id } = await req.json().catch(() => ({}))
  const ok = deletePost(Number(id))
  return NextResponse.json({ ok })
}