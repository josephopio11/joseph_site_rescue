import { getDb, withTransaction } from "./db"

export type Post = {
  id: number
  title: string
  slug: string
  body: string
  excerpt: string | null
  category: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

function rowToPost(r: any): Post {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    body: r.body,
    excerpt: r.excerpt ?? null,
    category: r.category ?? null,
    published: Boolean(r.published),
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function listPublishedPosts(limit = 100): Post[] {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT * FROM posts WHERE published = 1
       ORDER BY datetime(created_at) DESC LIMIT ?`
    )
    .all(limit)
  return rows.map(rowToPost)
}

export function listAllPosts(): Post[] {
  const db = getDb()
  const rows = db
    .prepare("SELECT * FROM posts ORDER BY datetime(updated_at) DESC")
    .all()
  return rows.map(rowToPost)
}

export function getPostBySlug(slug: string): Post | null {
  const db = getDb()
  const row = db
    .prepare("SELECT * FROM posts WHERE slug = ?")
    .get(slug)
  return row ? rowToPost(row) : null
}

export function getPostById(id: number): Post | null {
  const db = getDb()
  const row = db.prepare("SELECT * FROM posts WHERE id = ?").get(id)
  return row ? rowToPost(row) : null
}

export function createPost(input: {
  title: string
  body: string
  excerpt?: string | null
  category?: string | null
  published?: boolean
}): Post {
  const slug = slugify(input.title)
  const now = new Date().toISOString()
  const db = getDb()
  const info = db
    .prepare(
      `INSERT INTO posts(title, slug, body, excerpt, category, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.title,
      slug,
      input.body,
      input.excerpt ?? null,
      input.category ?? null,
      input.published ? 1 : 0,
      now,
      now
    )
  return getPostById(Number(info.lastInsertRowid))!
}

export function updatePost(
  id: number,
  input: Partial<{
    title: string
    body: string
    excerpt: string | null
    category: string | null
    published: boolean
  }>
): Post | null {
  const existing = getPostById(id)
  if (!existing) return null
  const title = input.title ?? existing.title
  const slug = input.title ? slugify(input.title) : existing.slug
  const now = new Date().toISOString()
  const db = getDb()
  db.prepare(
    `UPDATE posts SET title = ?, slug = ?, body = ?, excerpt = ?, category = ?,
     published = ?, updated_at = ? WHERE id = ?`
  ).run(
    title,
    slug,
    input.body ?? existing.body,
    input.excerpt ?? null,
    input.category ?? null,
    input.published ? 1 : 0,
    now,
    id
  )
  return getPostById(id)
}

export function deletePost(id: number): boolean {
  const db = getDb()
  const info = db.prepare("DELETE FROM posts WHERE id = ?").run(id)
  return info.changes > 0
}

export function ensureUniqueSlug(slug: string, ignoreId?: number): string {
  const db = getDb()
  let candidate = slug || "post"
  let n = 1
  while (
    db
      .prepare("SELECT 1 FROM posts WHERE slug = ? AND id != ?")
      .get(candidate, ignoreId ?? -1)
  ) {
    n += 1
    candidate = `${slug}-${n}`
  }
  return candidate
}
