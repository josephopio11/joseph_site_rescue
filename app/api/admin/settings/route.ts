import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/api-auth"
import { getSettings, setSettings } from "@/lib/settings"

export async function GET() {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  return NextResponse.json({ settings: getSettings() })
}

export async function PUT(req: Request) {
  const auth = await requireAuth()
  if (!auth.ok) return auth.response
  const body = await req.json()
  const settings = setSettings(body)
  return NextResponse.json({ settings })
}