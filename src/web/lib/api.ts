import { xrpcUrl, comAtprotoIdentity, comAtprotoRepo } from '../lexicons'
import type { AppConfig, Networks, Profile, Post, ListRecordsResponse } from '../types'

// Cache
let configCache: AppConfig | null = null
let networksCache: Networks | null = null

// Load config.json
export async function getConfig(): Promise<AppConfig> {
  if (configCache) return configCache
  const res = await fetch('/config.json')
  configCache = await res.json()
  return configCache!
}

// Load networks.json
export async function getNetworks(): Promise<Networks> {
  if (networksCache) return networksCache
  const res = await fetch('/networks.json')
  networksCache = await res.json()
  return networksCache!
}

// Resolve handle to DID (try all networks)
export async function resolveHandle(handle: string): Promise<string | null> {
  const networks = await getNetworks()

  // Try each network until one succeeds
  for (const network of Object.values(networks)) {
    try {
      const host = network.bsky.replace('https://', '')
      const url = `${xrpcUrl(host, comAtprotoIdentity.resolveHandle)}?handle=${handle}`
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        return data.did
      }
    } catch {
      // Try next network
    }
  }
  return null
}

// Get PDS endpoint for DID (try all networks)
export async function getPds(did: string): Promise<string | null> {
  const networks = await getNetworks()

  for (const network of Object.values(networks)) {
    try {
      const res = await fetch(`${network.plc}/${did}`)
      if (res.ok) {
        const didDoc = await res.json()
        const service = didDoc.service?.find((s: { type: string }) => s.type === 'AtprotoPersonalDataServer')
        if (service?.serviceEndpoint) {
          return service.serviceEndpoint
        }
      }
    } catch {
      // Try next network
    }
  }
  return null
}

// Load local profile
async function getLocalProfile(did: string): Promise<Profile | null> {
  try {
    const res = await fetch(`/content/${did}/app.bsky.actor.profile/self.json`)
    if (res.ok) return res.json()
  } catch {
    // Not found
  }
  return null
}

// Load profile (local first for admin, remote for others)
export async function getProfile(did: string, localFirst = true): Promise<Profile | null> {
  if (localFirst) {
    const local = await getLocalProfile(did)
    if (local) return local
  }

  const pds = await getPds(did)
  if (!pds) return null

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.getRecord)}?repo=${did}&collection=app.bsky.actor.profile&rkey=self`
    const res = await fetch(url)
    if (res.ok) return res.json()
  } catch {
    // Failed
  }
  return null
}

// Get avatar URL
export async function getAvatarUrl(did: string, profile: Profile): Promise<string | null> {
  if (!profile.value.avatar) return null

  const pds = await getPds(did)
  if (!pds) return null

  return `${pds}/xrpc/com.atproto.sync.getBlob?did=${did}&cid=${profile.value.avatar.ref.$link}`
}

// Load local posts
async function getLocalPosts(did: string, collection: string): Promise<Post[]> {
  try {
    const indexRes = await fetch(`/content/${did}/${collection}/index.json`)
    if (indexRes.ok) {
      const rkeys: string[] = await indexRes.json()
      const posts: Post[] = []
      for (const rkey of rkeys) {
        const res = await fetch(`/content/${did}/${collection}/${rkey}.json`)
        if (res.ok) posts.push(await res.json())
      }
      return posts.sort((a, b) =>
        new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
      )
    }
  } catch {
    // Not found
  }
  return []
}

// Load posts (local first for admin, remote for others)
export async function getPosts(did: string, collection: string, localFirst = true): Promise<Post[]> {
  if (localFirst) {
    const local = await getLocalPosts(did, collection)
    if (local.length > 0) return local
  }

  const pds = await getPds(did)
  if (!pds) return []

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.listRecords)}?repo=${did}&collection=${collection}&limit=100`
    const res = await fetch(url)
    if (res.ok) {
      const data: ListRecordsResponse<Post> = await res.json()
      return data.records.sort((a, b) =>
        new Date(b.value.createdAt).getTime() - new Date(a.value.createdAt).getTime()
      )
    }
  } catch {
    // Failed
  }
  return []
}

// Get single post
export async function getPost(did: string, collection: string, rkey: string, localFirst = true): Promise<Post | null> {
  if (localFirst) {
    try {
      const res = await fetch(`/content/${did}/${collection}/${rkey}.json`)
      if (res.ok) return res.json()
    } catch {
      // Not found
    }
  }

  const pds = await getPds(did)
  if (!pds) return null

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.getRecord)}?repo=${did}&collection=${collection}&rkey=${rkey}`
    const res = await fetch(url)
    if (res.ok) return res.json()
  } catch {
    // Failed
  }
  return null
}

// Describe repo - get collections list
export async function describeRepo(did: string): Promise<string[]> {
  // Try local first
  try {
    const res = await fetch(`/content/${did}/describe.json`)
    if (res.ok) {
      const data = await res.json()
      return data.collections || []
    }
  } catch {
    // Not found
  }

  // Remote
  const pds = await getPds(did)
  if (!pds) return []

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.describeRepo)}?repo=${did}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      return data.collections || []
    }
  } catch {
    // Failed
  }
  return []
}

// List records from any collection
export async function listRecords(did: string, collection: string, limit = 50): Promise<{ uri: string; cid: string; value: unknown }[]> {
  const pds = await getPds(did)
  if (!pds) return []

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.listRecords)}?repo=${did}&collection=${collection}&limit=${limit}`
    const res = await fetch(url)
    if (res.ok) {
      const data = await res.json()
      return data.records || []
    }
  } catch {
    // Failed
  }
  return []
}

// Get single record from any collection
export async function getRecord(did: string, collection: string, rkey: string): Promise<{ uri: string; cid: string; value: unknown } | null> {
  const pds = await getPds(did)
  if (!pds) return null

  try {
    const host = pds.replace('https://', '')
    const url = `${xrpcUrl(host, comAtprotoRepo.getRecord)}?repo=${did}&collection=${collection}&rkey=${rkey}`
    const res = await fetch(url)
    if (res.ok) return res.json()
  } catch {
    // Failed
  }
  return null
}

// Constants for search
const SEARCH_TIMEOUT_MS = 5000

// Get current network config
export async function getCurrentNetwork(): Promise<{ plc: string; bsky: string; web: string }> {
  const config = await getConfig()
  const networks = await getNetworks()
  const networkKey = config.network || 'bsky.social'
  const network = networks[networkKey]
  return {
    plc: network?.plc || 'https://plc.directory',
    bsky: network?.bsky || 'https://public.api.bsky.app',
    web: network?.web || 'https://bsky.app'
  }
}

// Get search endpoint for current network
async function getSearchEndpoint(): Promise<string> {
  const network = await getCurrentNetwork()
  return network.bsky
}

// Search posts that link to a URL
export async function searchPostsForUrl(url: string): Promise<SearchPost[]> {
  // Use current network's endpoint for search
  const endpoint = await getSearchEndpoint()

  // Extract search-friendly patterns from URL
  // Note: Search API doesn't index paths well, so search by domain and filter client-side
  const searchQueries: string[] = []

  try {
    const urlObj = new URL(url)
    // Search by domain only (paths with / don't return results)
    searchQueries.push(urlObj.host)
  } catch {
    searchQueries.push(url)
  }

  const allPosts: SearchPost[] = []
  const seenUris = new Set<string>()

  for (const query of searchQueries) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), SEARCH_TIMEOUT_MS)

      const res = await fetch(
        `${endpoint}/xrpc/app.bsky.feed.searchPosts?q=${encodeURIComponent(query)}&limit=20`,
        { signal: controller.signal }
      )
      clearTimeout(timeoutId)

      if (!res.ok) continue

      const data = await res.json()
      const posts = (data.posts || []).filter((post: SearchPost) => {
        const embedUri = (post.record as { embed?: { external?: { uri?: string } } })?.embed?.external?.uri
        const text = (post.record as { text?: string })?.text || ''
        return embedUri === url || text.includes(url) || embedUri?.includes(url.replace(/\/$/, ''))
      })

      for (const post of posts) {
        if (!seenUris.has(post.uri)) {
          seenUris.add(post.uri)
          allPosts.push(post)
        }
      }
    } catch {
      // Timeout or network error
    }
  }

  // Sort by date (newest first)
  allPosts.sort((a, b) => {
    const aDate = (a.record as { createdAt?: string })?.createdAt || ''
    const bDate = (b.record as { createdAt?: string })?.createdAt || ''
    return new Date(bDate).getTime() - new Date(aDate).getTime()
  })

  return allPosts
}

// Search post type
export interface SearchPost {
  uri: string
  cid: string
  author: {
    did: string
    handle: string
    displayName?: string
    avatar?: string
  }
  record: unknown
}
