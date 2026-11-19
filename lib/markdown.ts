// Lightweight markdown -> HTML renderer with no external dependencies.
// Handles headings, paragraphs, bold/italic/code, links, lists, blockquotes.

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function inline(text: string): string {
  let out = escapeHtml(text)
  out = out.replace(
    /\*\*([^*]+)\*\*/g,
    "<strong>$1</strong>"
  )
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>")
  out = out.replace(
    /`([^`]+)`/g,
    '<code class="rounded bg-muted px-1 py-0.5 font-mono text-sm">$1</code>'
  )
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary underline underline-offset-2" target="_blank" rel="noopener noreferrer">$1</a>'
  )
  return out
}

export function renderMarkdown(md: string): string {
  if (!md) return ""
  const lines = md.replace(/\r\n/g, "\n").split("\n")
  const html: string[] = []
  let inList: "ul" | "ol" | null = null
  let inQuote = false

  const closeList = () => {
    if (inList) {
      html.push(inList === "ul" ? "</ul>" : "</ol>")
      inList = null
    }
  }
  const closeQuote = () => {
    if (inQuote) {
      html.push("</blockquote>")
      inQuote = false
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) {
      closeList()
      closeQuote()
      continue
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      closeList()
      closeQuote()
      const level = heading[1].length
      html.push(`<h${level} class="scroll-mt-24">${inline(heading[2])}</h${level}>`)
      continue
    }

    if (line.startsWith("> ")) {
      closeList()
      if (!inQuote) {
        html.push('<blockquote class="border-l-2 border-primary/40 pl-4 italic text-muted-foreground">')
        inQuote = true
      }
      html.push(`<p>${inline(line.slice(2))}</p>`)
      continue
    }

    const ul = line.match(/^[-*]\s+(.*)$/)
    if (ul) {
      closeQuote()
      if (inList !== "ul") {
        closeList()
        html.push('<ul class="my-4 ml-6 list-disc space-y-1">')
        inList = "ul"
      }
      html.push(`<li>${inline(ul[1])}</li>`)
      continue
    }

    const ol = line.match(/^\d+\.\s+(.*)$/)
    if (ol) {
      closeQuote()
      if (inList !== "ol") {
        closeList()
        html.push('<ol class="my-4 ml-6 list-decimal space-y-1">')
        inList = "ol"
      }
      html.push(`<li>${inline(ol[1])}</li>`)
      continue
    }

    closeList()
    closeQuote()
    html.push(`<p class="my-3 leading-7">${inline(line)}</p>`)
  }

  closeList()
  closeQuote()
  return html.join("\n")
}
