import type { Profile } from '../types'
import { getAvatarUrl } from '../lib/api'

export async function renderProfile(
  did: string,
  profile: Profile,
  handle: string,
  webUrl?: string
): Promise<string> {
  const avatarUrl = await getAvatarUrl(did, profile)
  const displayName = profile.value.displayName || handle || 'Unknown'
  const description = profile.value.description || ''

  // Build profile link (e.g., https://bsky.app/profile/did:plc:xxx)
  const profileLink = webUrl ? `${webUrl}/profile/${did}` : null

  const handleHtml = profileLink
    ? `<a href="${profileLink}" class="profile-handle-link" target="_blank" rel="noopener">@${escapeHtml(handle)}</a>`
    : `<span>@${escapeHtml(handle)}</span>`

  const avatarHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="${escapeHtml(displayName)}" class="profile-avatar">`
    : `<div class="profile-avatar-placeholder"></div>`

  return `
    <div class="profile">
      ${avatarHtml}
      <div class="profile-info">
        <h1 class="profile-name">${escapeHtml(displayName)}</h1>
        <p class="profile-handle">${handleHtml}</p>
        ${description ? `<p class="profile-desc">${escapeHtml(description)}</p>` : ''}
      </div>
    </div>
  `
}

export function mountProfile(container: HTMLElement, html: string): void {
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
