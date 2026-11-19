export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export function ensureUniqueSlug(
  slug: string,
  table: "posts" | "projects",
  ignoreId?: number
): string {
  const { getDb } = require("./db")
  const db = getDb()
  let candidate = slug || "item"
  let n = 1
  while (
    db
      .prepare(`SELECT 1 FROM ${table} WHERE slug = ? AND id != ?`)
      .get(candidate, ignoreId ?? -1)
  ) {
    n += 1
    candidate = `${slug}-${n}`
  }
  return candidate
}
