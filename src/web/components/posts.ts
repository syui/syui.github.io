import type { Post } from '../types'
import { renderMarkdown } from '../lib/markdown'
import { renderDiscussion, loadDiscussionPosts } from './discussion'
import { getCurrentLang } from './mode-tabs'

// Render post list
export function renderPostList(posts: Post[], handle: string): string {
  if (posts.length === 0) {
    return '<p class="no-posts">No posts yet.</p>'
  }

  const currentLang = getCurrentLang()

  const items = posts.map(post => {
    const rkey = post.uri.split('/').pop() || ''
    const date = new Date(post.value.createdAt).toLocaleDateString('en-US')
    const originalLang = post.value.lang || 'ja'
    const translations = post.value.translations

    // Use translation if available
    let displayTitle = post.value.title
    if (translations && currentLang !== originalLang && translations[currentLang]) {
      displayTitle = translations[currentLang].title || post.value.title
    }

    return `
      <article class="post-item">
        <a href="/@${handle}/${rkey}" class="post-link">
          <h2 class="post-title">${escapeHtml(displayTitle)}</h2>
          <time class="post-date">${date}</time>
        </a>
      </article>
    `
  }).join('')

  return `<div class="post-list">${items}</div>`
}

// Render single post detail
export function renderPostDetail(
  post: Post,
  handle: string,
  collection: string,
  isOwner: boolean = false,
  siteUrl?: string,
  appUrl: string = 'https://bsky.app'
): string {
  const rkey = post.uri.split('/').pop() || ''
  const date = new Date(post.value.createdAt).toLocaleDateString('en-US')
  const jsonUrl = `/@${handle}/at/collection/${collection}/${rkey}`

  // Build post URL for discussion search
  const postUrl = siteUrl ? `${siteUrl}/@${handle}/${rkey}` : `${window.location.origin}/@${handle}/${rkey}`

  const editBtn = isOwner ? `<button type="button" class="post-edit-btn" id="post-edit-btn">Edit</button>` : ''

  // Get current language and show appropriate content
  const currentLang = getCurrentLang()
  const translations = post.value.translations
  const originalLang = post.value.lang || 'ja'

  let displayTitle = post.value.title
  let displayContent = post.value.content

  // Use translation if available and not original language
  if (translations && currentLang !== originalLang && translations[currentLang]) {
    const trans = translations[currentLang]
    displayTitle = trans.title || post.value.title
    displayContent = trans.content
  }

  const content = renderMarkdown(displayContent)

  const editForm = isOwner ? `
    <div class="post-edit-form" id="post-edit-form" style="display: none;">
      <input type="text" class="post-edit-title" id="post-edit-title" value="${escapeHtml(post.value.title)}" placeholder="Title">
      <textarea class="post-edit-content" id="post-edit-content" rows="15">${escapeHtml(post.value.content)}</textarea>
      <div class="post-edit-actions">
        <button type="button" class="post-edit-cancel" id="post-edit-cancel">Cancel</button>
        <button type="button" class="post-edit-save" id="post-edit-save" data-collection="${collection}" data-rkey="${rkey}">Save</button>
      </div>
    </div>
  ` : ''

  return `
    <article class="post-detail" data-post-url="${escapeHtml(postUrl)}" data-app-url="${escapeHtml(appUrl)}">
      <header class="post-header">
        <div class="post-meta">
          <time class="post-date">${date}</time>
          <a href="${jsonUrl}" class="json-btn">json</a>
          ${editBtn}
        </div>
      </header>
      ${editForm}
      <div id="post-display">
        <h1 class="post-title">${escapeHtml(displayTitle)}</h1>
        <div class="post-content">${content}</div>
      </div>
    </article>
    ${renderDiscussion(postUrl, appUrl)}
  `
}

// Setup post detail interactions (discussion loading)
export function setupPostDetail(container: HTMLElement): void {
  const article = container.querySelector('.post-detail') as HTMLElement
  if (!article) return

  // Load discussion posts
  const postUrl = article.dataset.postUrl
  const appUrl = article.dataset.appUrl || 'https://bsky.app'
  if (postUrl) {
    loadDiscussionPosts(container, postUrl, appUrl)
  }
}

export function mountPostList(container: HTMLElement, html: string): void {
  container.innerHTML = html
}

export function mountPostDetail(container: HTMLElement, html: string): void {
  container.innerHTML = html
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
