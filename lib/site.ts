import { getSettings } from "./settings"

export async function loadSite() {
  return getSettings()
}

export function siteNav() {
  return [
    { label: "Home", href: "/" },
    { label: "Posts", href: "/posts" },
    { label: "Projects", href: "/projects" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ]
}
