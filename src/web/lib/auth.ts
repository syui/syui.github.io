import { BrowserOAuthClient } from '@atproto/oauth-client-browser'
import { Agent } from '@atproto/api'
import { getNetworks } from './api'

let oauthClient: BrowserOAuthClient | null = null
let agent: Agent | null = null
let sessionDid: string | null = null
let sessionHandle: string | null = null
let currentNetworkConfig: { bsky: string; plc: string } | null = null

// Get client ID based on environment
function getClientId(): string {
  const host = window.location.host

  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    const port = window.location.port || '5173'
    const redirectUri = `http://127.0.0.1:${port}/`
    return `http://localhost?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent('atproto transition:generic')}`
  }

  return `${window.location.origin}/client-metadata.json`
}

// Set network config (call before login)
export async function setNetworkConfig(handle: string): Promise<void> {
  const networks = await getNetworks()

  for (const [domain, network] of Object.entries(networks)) {
    if (handle.endsWith(`.${domain}`)) {
      currentNetworkConfig = { bsky: network.bsky, plc: network.plc }
      oauthClient = null
      return
    }
  }

  // Check syui.ai -> syu.is
  if (handle.endsWith('.syui.ai')) {
    const network = networks['syu.is']
    if (network) {
      currentNetworkConfig = { bsky: network.bsky, plc: network.plc }
      oauthClient = null
      return
    }
  }

  // Default to first network
  const first = Object.values(networks)[0]
  currentNetworkConfig = { bsky: first.bsky, plc: first.plc }
  oauthClient = null
}

// Initialize OAuth client
async function initOAuthClient(): Promise<BrowserOAuthClient> {
  if (oauthClient) return oauthClient

  const handleResolver = currentNetworkConfig?.bsky || 'https://bsky.social'
  const plcDirectoryUrl = currentNetworkConfig?.plc || 'https://plc.directory'

  oauthClient = await BrowserOAuthClient.load({
    clientId: getClientId(),
    handleResolver,
    plcDirectoryUrl,
  })

  return oauthClient
}

// Login with handle
export async function login(handle: string): Promise<void> {
  await setNetworkConfig(handle)

  try {
    const client = await initOAuthClient()
    await client.signIn(handle, {
      scope: 'atproto transition:generic'
    })
  } catch (e) {
    console.error('Login failed:', e)
    throw e
  }
}

// Handle OAuth callback
export async function handleCallback(): Promise<string | null> {
  // Check query params first, then hash fragment
  let params = new URLSearchParams(window.location.search)

  if (!params.has('code') && !params.has('state')) {
    // Try hash fragment
    if (window.location.hash && window.location.hash.length > 1) {
      params = new URLSearchParams(window.location.hash.slice(1))
    }
  }

  if (!params.has('code') && !params.has('state')) {
    return null
  }

  try {
    // Detect network from issuer (iss param) and set config before init
    const iss = params.get('iss') || ''
    if (iss && !currentNetworkConfig) {
      const networks = await getNetworks()
      for (const [domain, network] of Object.entries(networks)) {
        if (iss.includes(domain)) {
          currentNetworkConfig = { bsky: network.bsky, plc: network.plc }
          break
        }
      }
    }

    const client = await initOAuthClient()

    // Initialize client to restore state from storage
    await client.init()

    const result = await client.callback(params)
    sessionDid = result.session.did

    // Create agent and get handle
    agent = new Agent(result.session)
    try {
      const profile = await agent.getProfile({ actor: sessionDid })
      sessionHandle = profile.data.handle
    } catch {
      // Could not get handle
    }

    // Clear URL params and hash
    window.history.replaceState({}, '', window.location.pathname)

    return sessionDid
  } catch (e) {
    console.error('OAuth callback error:', e)
    return null
  }
}

// Logout
export async function logout(): Promise<void> {
  // Clear module state
  sessionDid = null
  sessionHandle = null
  agent = null
  oauthClient = null
  currentNetworkConfig = null

  // Clear all storage
  sessionStorage.clear()
  localStorage.clear()

  // Clear IndexedDB (used by OAuth client)
  try {
    const databases = await indexedDB.databases()
    for (const db of databases) {
      if (db.name) {
        indexedDB.deleteDatabase(db.name)
      }
    }
  } catch (e) {
    // IndexedDB.databases() not supported in some browsers
    console.warn('Could not clear IndexedDB:', e)
  }

  window.location.reload()
}

// Restore session from storage
export async function restoreSession(): Promise<string | null> {
  try {
    // Try to initialize with default network first
    const networks = await getNetworks()
    const first = Object.values(networks)[0]
    currentNetworkConfig = { bsky: first.bsky, plc: first.plc }

    const client = await initOAuthClient()
    const result = await client.init()

    if (result?.session) {
      sessionDid = result.session.did

      // Create agent and get handle
      agent = new Agent(result.session)
      try {
        const profile = await agent.getProfile({ actor: sessionDid })
        sessionHandle = profile.data.handle
      } catch {
        // Could not get handle
      }

      return sessionDid
    }
  } catch (e) {
    // Silently fail - no session to restore
  }
  return null
}

// Check if logged in
export function isLoggedIn(): boolean {
  return sessionDid !== null
}

// Get logged in DID
export function getLoggedInDid(): string | null {
  return sessionDid
}

// Get logged in handle
export function getLoggedInHandle(): string | null {
  return sessionHandle
}

// Get agent
export function getAgent(): Agent | null {
  return agent
}

// Create post
export async function createPost(
  collection: string,
  title: string,
  content: string
): Promise<{ uri: string; cid: string } | null> {
  if (!agent) return null

  try {
    const result = await agent.com.atproto.repo.createRecord({
      repo: agent.assertDid,
      collection,
      record: {
        $type: collection,
        title,
        content,
        createdAt: new Date().toISOString(),
      },
    })

    return { uri: result.data.uri, cid: result.data.cid }
  } catch (err) {
    console.error('Create post error:', err)
    throw err
  }
}

// Update post
export async function updatePost(
  collection: string,
  rkey: string,
  title: string,
  content: string
): Promise<{ uri: string; cid: string } | null> {
  if (!agent) return null

  try {
    const result = await agent.com.atproto.repo.putRecord({
      repo: agent.assertDid,
      collection,
      rkey,
      record: {
        $type: collection,
        title,
        content,
        createdAt: new Date().toISOString(),
      },
    })

    return { uri: result.data.uri, cid: result.data.cid }
  } catch (err) {
    console.error('Update post error:', err)
    throw err
  }
}

// Delete record
export async function deleteRecord(
  collection: string,
  rkey: string
): Promise<boolean> {
  if (!agent) return false

  try {
    await agent.com.atproto.repo.deleteRecord({
      repo: agent.assertDid,
      collection,
      rkey,
    })
    return true
  } catch (err) {
    console.error('Delete record error:', err)
    throw err
  }
}
