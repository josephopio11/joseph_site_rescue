import { getDb } from "./db"

export type SiteSettings = {
  siteTitle: string
  siteDescription: string
  name: string
  tagline: string
  email: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
  avatarInitials: string
}

const DEFAULTS: SiteSettings = {
  siteTitle: "Joseph Opio | Computer Science Teacher",
  siteDescription:
    "Computer Science teacher, freelance web and app developer, and designer based in Uganda.",
  name: "Joseph Opio",
  tagline: "Computer Science Teacher · Developer · Designer",
  email: "joseph@example.com",
  githubUrl: "",
  linkedinUrl: "",
  twitterUrl: "",
  avatarInitials: "JO",
}

export function getSettings(): SiteSettings {
  const db = getDb()
  const rows = db.prepare("SELECT key, value FROM settings").all() as any[]
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  return { ...DEFAULTS, ...(map as any) }
}

export function setSettings(values: Partial<SiteSettings>): SiteSettings {
  const db = getDb()
  const upsert = db.prepare(
    "INSERT INTO settings(key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value"
  )
  const transaction = db.transaction(() => {
    for (const [key, value] of Object.entries(values)) {
      if (value === undefined) continue
      upsert.run(key, String(value))
    }
  })
  transaction()
  return getSettings()
}
