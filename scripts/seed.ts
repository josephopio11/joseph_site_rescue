// Seeds the database with the initial admin account and sample content.
// Run once: `pnpm db:seed`. Re-running is idempotent for the admin user.
import { getDb } from "../lib/db"
import { hashPassword } from "../lib/auth"
import { createPost } from "../lib/posts"
import { createProject } from "../lib/projects"
import { setSettings } from "../lib/settings"

const db = getDb()

const adminUsername = process.env.ADMIN_USERNAME || "joseph"
const adminPassword = process.env.ADMIN_PASSWORD || "change-me-1234"

const existing = db
  .prepare("SELECT id FROM admins WHERE username = ?")
  .get(adminUsername)
if (!existing) {
  db.prepare(
    "INSERT INTO admins(username, password_hash, created_at) VALUES (?, ?, ?)"
  ).run(adminUsername, hashPassword(adminPassword), new Date().toISOString())
  console.log(`Created admin user "${adminUsername}"`)
} else {
  console.log(`Admin user "${adminUsername}" already exists`)
}

const existingPosts = db.prepare("SELECT COUNT(*) AS c FROM posts").get() as any
if (existingPosts.c === 0) {
  createPost({
    title: "Create retro games with PICO-8",
    body: `<p>Learn how to build 8-bit style games with the PICO-8 virtual console. Perfect for beginners and a great portfolio project.</p><p>By the end of this post you'll have a tiny working game you can expand into something bigger.</p>`,
    excerpt: "Build 8-bit style games with the PICO-8 virtual console.",
    category: "Game Dev",
    published: true,
  })
  createPost({
    title: "Using Gamification Techniques to Teach Python Coding",
    body: `<p>Making Python instruction stick is hard. Points, levels, badges, and challenges can help.</p><p>This post walks through concrete gamification techniques that work in a classroom setting.</p>`,
    excerpt: "Practical gamification techniques for teaching Python.",
    category: "Teaching",
    published: true,
  })
  createPost({
    title: "Common Challenges in Teaching Data Representation",
    body: `<p>Data representation is one of the trickiest topics in introductory CS. Here are the common challenges and strategies to overcome them.</p>`,
    excerpt: "Strategies for teaching data representation concepts.",
    category: "Teaching",
    published: true,
  })
  console.log("Seeded 3 sample posts")
}

const existingProjects = db.prepare("SELECT COUNT(*) AS c FROM projects").get() as any
if (existingProjects.c === 0) {
  createProject({
    title: "DevMgmt.msc",
    description: "A desktop application for managing development environments and workflows.",
    body: "<p>DevMgmt.msc is a desktop tool for managing development environments and workflows.</p>",
    url: "https://example.com/devmgmt",
    tech: "Electron, TypeScript, React",
    published: true,
  })
  console.log("Seeded 1 sample project")
}

setSettings({
  siteTitle: "Joseph Opio",
  siteDescription:
    "Computer Science teacher, freelance web and app developer, and designer.",
})
console.log("Seed complete")
