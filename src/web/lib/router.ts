export interface Route {
  type: 'home' | 'user' | 'post' | 'postpage' | 'atbrowser' | 'service' | 'collection' | 'record'
  handle?: string
  rkey?: string
  service?: string
  collection?: string
}

// Parse current URL to route
export function parseRoute(): Route {
  const path = window.location.pathname

  // Home: / or /app
  if (path === '/' || path === '' || path === '/app' || path === '/app/') {
    return { type: 'home' }
  }

  // AT-Browser main: /@handle/at or /@handle/at/
  const atBrowserMatch = path.match(/^\/@([^/]+)\/at\/?$/)
  if (atBrowserMatch) {
    return { type: 'atbrowser', handle: atBrowserMatch[1] }
  }

  // AT-Browser service: /@handle/at/service/domain.tld
  const serviceMatch = path.match(/^\/@([^/]+)\/at\/service\/([^/]+)$/)
  if (serviceMatch) {
    return { type: 'service', handle: serviceMatch[1], service: decodeURIComponent(serviceMatch[2]) }
  }

  // AT-Browser collection: /@handle/at/collection/namespace.name
  const collectionMatch = path.match(/^\/@([^/]+)\/at\/collection\/([^/]+)$/)
  if (collectionMatch) {
    return { type: 'collection', handle: collectionMatch[1], collection: collectionMatch[2] }
  }

  // AT-Browser record: /@handle/at/collection/namespace.name/rkey
  const recordMatch = path.match(/^\/@([^/]+)\/at\/collection\/([^/]+)\/([^/]+)$/)
  if (recordMatch) {
    return { type: 'record', handle: recordMatch[1], collection: recordMatch[2], rkey: recordMatch[3] }
  }

  // User page: /@handle or /@handle/
  const userMatch = path.match(/^\/@([^/]+)\/?$/)
  if (userMatch) {
    return { type: 'user', handle: userMatch[1] }
  }

  // Post form page: /@handle/at/post
  const postPageMatch = path.match(/^\/@([^/]+)\/at\/post\/?$/)
  if (postPageMatch) {
    return { type: 'postpage', handle: postPageMatch[1] }
  }

  // Post detail page: /@handle/rkey (for config.collection)
  const postMatch = path.match(/^\/@([^/]+)\/([^/]+)$/)
  if (postMatch) {
    return { type: 'post', handle: postMatch[1], rkey: postMatch[2] }
  }

  // Default to home
  return { type: 'home' }
}

// Navigate to a route
export function navigate(route: Route): void {
  let path = '/'

  if (route.type === 'user' && route.handle) {
    path = `/@${route.handle}`
  } else if (route.type === 'postpage' && route.handle) {
    path = `/@${route.handle}/at/post`
  } else if (route.type === 'post' && route.handle && route.rkey) {
    path = `/@${route.handle}/${route.rkey}`
  } else if (route.type === 'atbrowser' && route.handle) {
    path = `/@${route.handle}/at`
  } else if (route.type === 'service' && route.handle && route.service) {
    path = `/@${route.handle}/at/service/${encodeURIComponent(route.service)}`
  } else if (route.type === 'collection' && route.handle && route.collection) {
    path = `/@${route.handle}/at/collection/${route.collection}`
  } else if (route.type === 'record' && route.handle && route.collection && route.rkey) {
    path = `/@${route.handle}/at/collection/${route.collection}/${route.rkey}`
  }

  window.history.pushState({}, '', path)
  window.dispatchEvent(new PopStateEvent('popstate'))
}

// Subscribe to route changes
export function onRouteChange(callback: (route: Route) => void): void {
  const handler = () => callback(parseRoute())
  window.addEventListener('popstate', handler)

  // Handle link clicks
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const anchor = target.closest('a')
    if (anchor && anchor.href.startsWith(window.location.origin)) {
      e.preventDefault()
      window.history.pushState({}, '', anchor.href)
      handler()
    }
  })
}
