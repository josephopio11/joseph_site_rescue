import { renderMarkdown } from "@/lib/markdown"

export function Markdown({ md }: { md: string }) {
  const html = renderMarkdown(md)
  return (
    <div
      className="prose prose-sm dark:prose-invert prose-headings:scroll-mt-24 prose-a:underline prose-a:underline-offset-2 prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:font-mono prose-code:text-sm prose-li:my-1 max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
