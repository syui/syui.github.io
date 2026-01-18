import { searchPostsForUrl, getCurrentNetwork, type SearchPost } from '../lib/api'

const DISCUSSION_POST_LIMIT = 10

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

function getPostUrl(uri: string, appUrl: string): string {
  // at://did:plc:xxx/app.bsky.feed.post/rkey -> {appUrl}/profile/did:plc:xxx/post/rkey
  const parts = uri.replace('at://', '').split('/')
  if (parts.length >= 3) {
    return `${appUrl}/profile/${parts[0]}/post/${parts[2]}`
  }
  return '#'
}

export function renderDiscussion(postUrl: string, appUrl: string = 'https://bsky.app'): string {
  // Build search URL with host/@username only
  let searchQuery = postUrl
  try {
    const urlObj = new URL(postUrl)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    // pathParts[0] = @username.domain (e.g., @syui.syui.ai)
    // Extract just @username
    if (pathParts[0]?.startsWith('@')) {
      const handlePart = pathParts[0].slice(1) // remove @
      const username = handlePart.split('.')[0] // get first part before .
      searchQuery = `${urlObj.host}/@${username}`
    } else {
      searchQuery = urlObj.host
    }
  } catch {
    // Keep original
  }

  const searchUrl = `${appUrl}/search?q=${encodeURIComponent(searchQuery)}`

  return `
    <div class="discussion-section">
      <a href="${searchUrl}" target="_blank" rel="noopener" class="discussion-link">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2.546 20.2A1.5 1.5 0 0 0 4 22h.5l2.83-.892A9.96 9.96 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
        </svg>
        Discuss on Bluesky
      </a>
      <div id="discussion-posts" class="discussion-posts" data-app-url="${escapeHtml(appUrl)}"></div>
    </div>
  `
}

export async function loadDiscussionPosts(container: HTMLElement, postUrl: string, appUrl: string = 'https://bsky.app'): Promise<void> {
  const postsContainer = container.querySelector('#discussion-posts') as HTMLElement
  if (!postsContainer) return

  // Get appUrl from network config (overrides default)
  const network = await getCurrentNetwork()
  const dataAppUrl = network.web || postsContainer.dataset.appUrl || appUrl

  postsContainer.innerHTML = '<div class="loading-small">Loading comments...</div>'

  const posts = await searchPostsForUrl(postUrl)

  if (posts.length === 0) {
    postsContainer.innerHTML = ''
    return
  }

  const postsHtml = posts.slice(0, DISCUSSION_POST_LIMIT).map((post: SearchPost) => {
    const author = post.author
    const avatar = author.avatar || ''
    const displayName = author.displayName || author.handle
    const handle = author.handle
    const record = post.record as { text?: string; createdAt?: string }
    const text = record?.text || ''
    const createdAt = record?.createdAt || ''
    const postLink = getPostUrl(post.uri, dataAppUrl)

    // Truncate text
    const truncatedText = text.length > 200 ? text.slice(0, 200) + '...' : text

    return `
      <a href="${postLink}" target="_blank" rel="noopener" class="discussion-post">
        <div class="discussion-author">
          ${avatar ? `<img src="${escapeHtml(avatar)}" class="discussion-avatar" alt="">` : '<div class="discussion-avatar-placeholder"></div>'}
          <div class="discussion-author-info">
            <span class="discussion-name">${escapeHtml(displayName)}</span>
            <span class="discussion-handle">@${escapeHtml(handle)}</span>
          </div>
          <span class="discussion-date">${formatDate(createdAt)}</span>
        </div>
        <div class="discussion-text">${escapeHtml(truncatedText)}</div>
      </a>
    `
  }).join('')

  postsContainer.innerHTML = postsHtml
}
