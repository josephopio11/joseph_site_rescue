import type { Metadata } from "next"
import { Geist, Geist_Mono, Oxanium } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteShell } from "@/components/site-shell"
import { cn } from "cn"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Joseph Opio | Computer Science Teacher",
  description:
    "Computer Science teacher, freelance web and app developer, and designer.",
}

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        oxanium.variable,
        geistHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  )
}
