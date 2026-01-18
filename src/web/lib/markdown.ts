import { marked } from 'marked'
import hljs from 'highlight.js'

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
})

// Custom renderer for syntax highlighting
const renderer = new marked.Renderer()

renderer.code = function({ text, lang }: { text: string; lang?: string }) {
  if (lang && hljs.getLanguage(lang)) {
    const highlighted = hljs.highlight(text, { language: lang }).value
    return `<pre><code class="hljs language-${lang}">${highlighted}</code></pre>`
  }
  const escaped = escapeHtml(text)
  return `<pre><code>${escaped}</code></pre>`
}

marked.use({ renderer })

// Escape HTML
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

// Render markdown to HTML
export function renderMarkdown(content: string): string {
  return marked(content) as string
}
