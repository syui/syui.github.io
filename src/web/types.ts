// Config types
export interface AppConfig {
  title: string
  handle: string
  collection: string
  network: string
  color: string
  siteUrl: string
}

export interface Networks {
  [domain: string]: {
    plc: string
    bsky: string
    web: string
  }
}

// ATProto types
export interface DescribeRepo {
  did: string
  handle: string
  collections: string[]
}

export interface Profile {
  cid: string
  uri: string
  value: {
    $type: string
    avatar?: {
      $type: string
      mimeType: string
      ref: { $link: string }
      size: number
    }
    displayName?: string
    description?: string
    createdAt?: string
  }
}

export interface Post {
  cid: string
  uri: string
  value: {
    $type: string
    title: string
    content: string
    createdAt: string
    lang?: string
    translations?: {
      [lang: string]: {
        title: string
        content: string
      }
    }
  }
}

export interface ListRecordsResponse<T> {
  records: T[]
  cursor?: string
}
