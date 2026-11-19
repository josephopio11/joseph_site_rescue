import { getSettings } from "@/lib/settings"

export function Footer() {
  const s = getSettings()
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} {s.name}. All rights reserved.</p>
        <p className="font-mono text-xs">Built with Next.js &amp; SQLite.</p>
      </div>
    </footer>
  )
}
