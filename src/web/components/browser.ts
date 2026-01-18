// AT-Browser: Server info and collection hierarchy

// Group collections by service domain
function groupCollectionsByService(collections: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>()

  for (const collection of collections) {
    // Extract service from collection (e.g., "app.bsky.feed.post" -> "bsky.app")
    const parts = collection.split('.')
    let service: string

    if (parts.length >= 2) {
      // Reverse first two parts: app.bsky -> bsky.app, ai.syui -> syui.ai
      service = `${parts[1]}.${parts[0]}`
    } else {
      service = collection
    }

    if (!groups.has(service)) {
      groups.set(service, [])
    }
    groups.get(service)!.push(collection)
  }

  return groups
}

// Local favicon mappings
const localFavicons: Record<string, string> = {
  'syui.ai': '/favicon/syui.ai.png',
  'bsky.app': '/favicon/bsky.app.png',
  'atproto.com': '/favicon/atproto.com.png',
}

// Get favicon URL for service
function getFaviconUrl(service: string): string {
  if (localFavicons[service]) {
    return localFavicons[service]
  }
  return `https://www.google.com/s2/favicons?domain=${service}&sz=32`
}

// Render compact collection buttons for user page (horizontal)
export function renderCollectionButtons(collections: string[], handle: string): string {
  if (collections.length === 0) {
    return ''
  }

  const groups = groupCollectionsByService(collections)

  const buttons = Array.from(groups.keys()).map(service => {
    const favicon = getFaviconUrl(service)
    return `
      <a href="/@${handle}/at/service/${encodeURIComponent(service)}" class="collection-btn" title="${service}">
        <img src="${favicon}" alt="" class="collection-btn-icon" onerror="this.style.display='none'">
        <span>${service}</span>
      </a>
    `
  }).join('')

  return `<div class="collection-buttons">${buttons}</div>`
}

// Render server info section (for AT-Browser)
export function renderServerInfo(did: string, pds: string | null): string {
  return `
    <div class="server-info">
      <h3>Server</h3>
      <dl class="server-details">
        <div class="server-row">
          <dt>PDS</dt>
          <dd>${pds || 'Unknown'}</dd>
        </div>
        <div class="server-row">
          <dt>DID</dt>
          <dd>${did}</dd>
        </div>
      </dl>
    </div>
  `
}

// Render service list (grouped collections) for AT-Browser
export function renderServiceList(collections: string[], handle: string): string {
  if (collections.length === 0) {
    return '<p class="no-collections">No collections found.</p>'
  }

  const groups = groupCollectionsByService(collections)

  const items = Array.from(groups.entries()).map(([service, cols]) => {
    const favicon = getFaviconUrl(service)
    const count = cols.length

    return `
      <li class="service-list-item">
        <a href="/@${handle}/at/service/${encodeURIComponent(service)}" class="service-list-link">
          <img src="${favicon}" alt="" class="service-list-favicon" onerror="this.style.display='none'">
          <span class="service-list-name">${service}</span>
          <span class="service-list-count">${count}</span>
        </a>
      </li>
    `
  }).join('')

  return `
    <div class="services-list">
      <h3>Collections</h3>
      <ul class="service-list">${items}</ul>
    </div>
  `
}

// Render collections for a specific service
export function renderCollectionList(
  collections: string[],
  handle: string,
  service: string
): string {
  const favicon = getFaviconUrl(service)

  const items = collections.map(collection => {
    return `
      <li class="collection-item">
        <a href="/@${handle}/at/collection/${collection}" class="collection-link">
          <span class="collection-nsid">${collection}</span>
        </a>
      </li>
    `
  }).join('')

  return `
    <div class="collections">
      <h3 class="collection-header">
        <img src="${favicon}" alt="" class="collection-header-favicon" onerror="this.style.display='none'">
        ${service}
      </h3>
      <ul class="collection-list">${items}</ul>
    </div>
  `
}

// Render records list
export function renderRecordList(
  records: { uri: string; cid: string; value: unknown }[],
  handle: string,
  collection: string
): string {
  if (records.length === 0) {
    return '<p class="no-records">No records found.</p>'
  }

  const items = records.map(record => {
    const rkey = record.uri.split('/').pop() || ''
    const value = record.value as Record<string, unknown>
    const preview = getRecordPreview(value)

    return `
      <li class="record-item">
        <a href="/@${handle}/at/collection/${collection}/${rkey}" class="record-link">
          <span class="record-rkey">${rkey}</span>
          <span class="record-preview">${escapeHtml(preview)}</span>
        </a>
      </li>
    `
  }).join('')

  return `
    <div class="records">
      <h3>${collection}</h3>
      <p class="record-count">${records.length} records</p>
      <ul class="record-list">${items}</ul>
    </div>
  `
}

// Render single record detail
export function renderRecordDetail(
  record: { uri: string; cid: string; value: unknown },
  collection: string,
  isOwner: boolean = false
): string {
  const rkey = record.uri.split('/').pop() || ''
  const deleteBtn = isOwner ? `
    <button type="button" class="record-delete-btn" id="record-delete-btn" data-collection="${collection}" data-rkey="${rkey}">Delete</button>
  ` : ''

  return `
    <article class="record-detail">
      <header class="record-header">
        <h3>${collection}</h3>
        <p class="record-uri">URI: ${record.uri}</p>
        <p class="record-cid">CID: ${record.cid}</p>
        ${deleteBtn}
      </header>
      <div class="json-view">
        <pre><code>${escapeHtml(JSON.stringify(record.value, null, 2))}</code></pre>
      </div>
    </article>
  `
}

// Get preview text from record value
function getRecordPreview(value: Record<string, unknown>): string {
  if (typeof value.text === 'string') return value.text.slice(0, 60)
  if (typeof value.title === 'string') return value.title
  if (typeof value.name === 'string') return value.name
  if (typeof value.displayName === 'string') return value.displayName
  if (typeof value.handle === 'string') return value.handle
  if (typeof value.subject === 'string') return value.subject
  if (typeof value.description === 'string') return value.description.slice(0, 60)
  return ''
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}
