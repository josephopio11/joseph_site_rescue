import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"
import { getDb } from "./db"
import { NextResponse } from "next/server"

const SESSION_COOKIE = "jsr_session"
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 14 // 14 days

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex")
  const hash = scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

function verifyPassword(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(":")
  if (!salt || !hash) return false
  const attempt = scryptSync(password, salt, 64)
  const storedHash = Buffer.from(hash, "hex")
  return (
    storedHash.length === attempt.length &&
    timingSafeEqual(storedHash, attempt)
  )
}

export async function loginAdmin(username: string, password: string) {
  const db = getDb()
  const admin = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username) as any
  if (!admin || !verifyPassword(password, admin.password_hash)) return null

  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString()
  db.prepare(
    "INSERT INTO sessions(token, admin_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, admin.id, expiresAt)
  return { token, expiresAt }
}

export async function createSessionCookie(token: string, expiresAt: string) {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  if (!token) return null
  const db = getDb()
  const session = db
    .prepare(
      `SELECT s.admin_id AS adminId, s.expires_at AS expiresAt
       FROM sessions s WHERE s.token = ?`
    )
    .get(token) as any
  if (!session) return null
  if (new Date(session.expiresAt).getTime() < Date.now()) {
    db.prepare("DELETE FROM sessions WHERE token = ?").run(token)
    return null
  }
  const admin = db
    .prepare("SELECT id, username FROM admins WHERE id = ?")
    .get(session.adminId) as any
  return admin ?? null
}

export function requireAdmin(admin: any) {
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  return null
}

export { hashPassword }
