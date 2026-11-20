"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "@phosphor-icons/react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? (
        <Sun weight="fill" className="size-5" />
      ) : (
        <Moon weight="fill" className="size-5" />
      )}
    </Button>
  )
}
