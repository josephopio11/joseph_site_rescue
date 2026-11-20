import { cookies } from "next/headers"
import { getDb } from "./db"

const SESSION_COOKIE = "jsr_session"

export async function requireAuth(): Promise<
  { ok: true; username: string } | { ok: false; response: Response }
> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const db = getDb()
  const session = db
    .prepare(
      `SELECT s.admin_id AS adminId, s.expires_at AS expiresAt
       FROM sessions s WHERE s.token = ?`
    )
    .get(token) as any

  if (!session) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token)
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  const admin = db
    .prepare("SELECT id, username FROM admins WHERE id = ?")
    .get(session.adminId) as any
  if (!admin) {
    return { ok: false, response: Response.json({ error: "Unauthorized" }, { status: 401 }) }
  }

  return { ok: true, username: admin.username }
}

export function json(data: unknown, init: ResponseInit = {}): Response {
  return Response.json(data, init)
}