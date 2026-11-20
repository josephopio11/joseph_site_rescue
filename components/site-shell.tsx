import Link from "next/link"
import { Suspense } from "react"
import { SiteNav } from "./site-nav"
import { ThemeToggle } from "./theme-toggle"

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col">
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-heading text-base font-semibold tracking-tight"
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              JO
            </span>
            <span>Joseph Opio</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm sm:flex">
            <Suspense fallback={null}>
              <SiteNav />
            </Suspense>
          </nav>
          <div className="flex items-center gap-1">
            <ThemeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>{/* <Footer /> */}</Suspense>
    </div>
  )
}
