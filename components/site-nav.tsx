"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const links = [
  { label: "Home", href: "/" },
  { label: "Posts", href: "/posts" },
  { label: "Projects", href: "/projects" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function SiteNav() {
  const pathname = usePathname()
  return (
    <>
      {links.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground ${active ? "text-foreground" : ""}`}
          >
            {l.label}
          </Link>
        )
      })}
    </>
  )
}
