import { getDb } from "./db"

export type Project = {
  id: number
  title: string
  slug: string
  description: string | null
  body: string | null
  url: string | null
  repo: string | null
  tech: string | null
  image: string | null
  published: boolean
  createdAt: string
  updatedAt: string
}

function rowToProject(r: any): Project {
  return {
    id: r.id,
    title: r.title,
    slug: r.slug,
    description: r.description ?? null,
    body: r.body ?? null,
    url: r.url ?? null,
    repo: r.repo ?? null,
    tech: r.tech ?? null,
    image: r.image ?? null,
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

export function listPublishedProjects(limit = 100): Project[] {
  const db = getDb()
  const rows = db
    .prepare(
      `SELECT * FROM projects WHERE published = 1
       ORDER BY datetime(created_at) DESC LIMIT ?`
    )
    .all(limit)
  return rows.map(rowToProject)
}

export function listAllProjects(): Project[] {
  const db = getDb()
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY datetime(updated_at) DESC")
    .all()
  return rows.map(rowToProject)
}

export function getProjectBySlug(slug: string): Project | null {
  const db = getDb()
  const row = db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug)
  return row ? rowToProject(row) : null
}

export function getProjectById(id: number): Project | null {
  const db = getDb()
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(id)
  return row ? rowToProject(row) : null
}

export function createProject(input: {
  title: string
  description?: string | null
  body?: string | null
  url?: string | null
  repo?: string | null
  tech?: string | null
  image?: string | null
  published?: boolean
}): Project {
  const slug = slugify(input.title)
  const now = new Date().toISOString()
  const db = getDb()
  const info = db
    .prepare(
      `INSERT INTO projects(title, slug, description, body, url, repo, tech, image, published, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.title,
      slug,
      input.description ?? null,
      input.body ?? null,
      input.url ?? null,
      input.repo ?? null,
      input.tech ?? null,
      input.image ?? null,
      input.published ? 1 : 0,
      now,
      now
    )
  return getProjectById(Number(info.lastInsertRowid))!
}

export function updateProject(
  id: number,
  input: Partial<{
    title: string
    description: string | null
    body: string | null
    url: string | null
    repo: string | null
    tech: string | null
    image: string | null
    published: boolean
  }>
): Project | null {
  const existing = getProjectById(id)
  if (!existing) return null
  const title = input.title ?? existing.title
  const slug = input.title ? slugify(input.title) : existing.slug
  const now = new Date().toISOString()
  const db = getDb()
  db.prepare(
    `UPDATE projects SET title = ?, slug = ?, description = ?, body = ?, url = ?, repo = ?, tech = ?, image = ?,
     published = ?, updated_at = ? WHERE id = ?`
  ).run(
    title,
    slug,
    input.description ?? null,
    input.body ?? null,
    input.url ?? null,
    input.repo ?? null,
    input.tech ?? null,
    input.image ?? null,
    input.published ? 1 : 0,
    now,
    id
  )
  return getProjectById(id)
}

export function deleteProject(id: number): boolean {
  const db = getDb()
  const info = db.prepare("DELETE FROM projects WHERE id = ?").run(id)
  return info.changes > 0
}
