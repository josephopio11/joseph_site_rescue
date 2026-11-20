import { NextResponse } from "next/server"
import { listPublishedPosts } from "@/lib/posts"

export async function GET() {
  return NextResponse.json({ posts: listPublishedPosts() })
}