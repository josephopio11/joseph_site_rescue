import { NextResponse } from "next/server"
import { getDb } from "@/lib/db"
import { hashPassword, verifyPassword } from "@/lib/auth"

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}))
  if (!username || !password) {
    return NextResponse.json({ error: "username and password required" }, { status: 400 })
  }

  const db = getDb()
  const admin = db
    .prepare("SELECT * FROM admins WHERE username = ?")
    .get(username) as any
  if (!admin || !verifyPassword(password, admin.password_hash)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const { randomBytes } = await import("node:crypto")
  const token = randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 14).toISOString()
  db.prepare(
    "INSERT INTO sessions(token, admin_id, expires_at) VALUES (?, ?, ?)"
  ).run(token, admin.id, expiresAt)

  const res = NextResponse.json({ ok: true })
  res.cookies.set("jsr_session", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: new Date(expiresAt),
  })
  return res
}