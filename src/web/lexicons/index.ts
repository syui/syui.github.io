// Auto-generated from ATProto lexicons
// Run `ailog gen` to regenerate
// Do not edit manually

export interface Endpoint {
  nsid: string
  method: 'GET' | 'POST'
}

/** Build XRPC URL for an endpoint */
export function xrpcUrl(pds: string, endpoint: Endpoint): string {
  return `https://${pds}/xrpc/${endpoint.nsid}`
}

export const appBskyActor = {
  getPreferences: { nsid: 'app.bsky.actor.getPreferences', method: 'GET' } as Endpoint,
  getProfile: { nsid: 'app.bsky.actor.getProfile', method: 'GET' } as Endpoint,
  getProfiles: { nsid: 'app.bsky.actor.getProfiles', method: 'GET' } as Endpoint,
  getSuggestions: { nsid: 'app.bsky.actor.getSuggestions', method: 'GET' } as Endpoint,
  putPreferences: { nsid: 'app.bsky.actor.putPreferences', method: 'POST' } as Endpoint,
  searchActors: { nsid: 'app.bsky.actor.searchActors', method: 'GET' } as Endpoint,
  searchActorsTypeahead: { nsid: 'app.bsky.actor.searchActorsTypeahead', method: 'GET' } as Endpoint,
} as const

export const appBskyAgeassurance = {
  begin: { nsid: 'app.bsky.ageassurance.begin', method: 'POST' } as Endpoint,
  getConfig: { nsid: 'app.bsky.ageassurance.getConfig', method: 'GET' } as Endpoint,
  getState: { nsid: 'app.bsky.ageassurance.getState', method: 'GET' } as Endpoint,
} as const

export const appBskyBookmark = {
  createBookmark: { nsid: 'app.bsky.bookmark.createBookmark', method: 'POST' } as Endpoint,
  deleteBookmark: { nsid: 'app.bsky.bookmark.deleteBookmark', method: 'POST' } as Endpoint,
  getBookmarks: { nsid: 'app.bsky.bookmark.getBookmarks', method: 'GET' } as Endpoint,
} as const

export const appBskyContact = {
  dismissMatch: { nsid: 'app.bsky.contact.dismissMatch', method: 'POST' } as Endpoint,
  getMatches: { nsid: 'app.bsky.contact.getMatches', method: 'GET' } as Endpoint,
  getSyncStatus: { nsid: 'app.bsky.contact.getSyncStatus', method: 'GET' } as Endpoint,
  importContacts: { nsid: 'app.bsky.contact.importContacts', method: 'POST' } as Endpoint,
  removeData: { nsid: 'app.bsky.contact.removeData', method: 'POST' } as Endpoint,
  sendNotification: { nsid: 'app.bsky.contact.sendNotification', method: 'POST' } as Endpoint,
  startPhoneVerification: { nsid: 'app.bsky.contact.startPhoneVerification', method: 'POST' } as Endpoint,
  verifyPhone: { nsid: 'app.bsky.contact.verifyPhone', method: 'POST' } as Endpoint,
} as const

export const appBskyDraft = {
  createDraft: { nsid: 'app.bsky.draft.createDraft', method: 'POST' } as Endpoint,
  deleteDraft: { nsid: 'app.bsky.draft.deleteDraft', method: 'POST' } as Endpoint,
  getDrafts: { nsid: 'app.bsky.draft.getDrafts', method: 'GET' } as Endpoint,
  updateDraft: { nsid: 'app.bsky.draft.updateDraft', method: 'POST' } as Endpoint,
} as const

export const appBskyFeed = {
  describeFeedGenerator: { nsid: 'app.bsky.feed.describeFeedGenerator', method: 'GET' } as Endpoint,
  getActorFeeds: { nsid: 'app.bsky.feed.getActorFeeds', method: 'GET' } as Endpoint,
  getActorLikes: { nsid: 'app.bsky.feed.getActorLikes', method: 'GET' } as Endpoint,
  getAuthorFeed: { nsid: 'app.bsky.feed.getAuthorFeed', method: 'GET' } as Endpoint,
  getFeed: { nsid: 'app.bsky.feed.getFeed', method: 'GET' } as Endpoint,
  getFeedGenerator: { nsid: 'app.bsky.feed.getFeedGenerator', method: 'GET' } as Endpoint,
  getFeedGenerators: { nsid: 'app.bsky.feed.getFeedGenerators', method: 'GET' } as Endpoint,
  getFeedSkeleton: { nsid: 'app.bsky.feed.getFeedSkeleton', method: 'GET' } as Endpoint,
  getLikes: { nsid: 'app.bsky.feed.getLikes', method: 'GET' } as Endpoint,
  getListFeed: { nsid: 'app.bsky.feed.getListFeed', method: 'GET' } as Endpoint,
  getPostThread: { nsid: 'app.bsky.feed.getPostThread', method: 'GET' } as Endpoint,
  getPosts: { nsid: 'app.bsky.feed.getPosts', method: 'GET' } as Endpoint,
  getQuotes: { nsid: 'app.bsky.feed.getQuotes', method: 'GET' } as Endpoint,
  getRepostedBy: { nsid: 'app.bsky.feed.getRepostedBy', method: 'GET' } as Endpoint,
  getSuggestedFeeds: { nsid: 'app.bsky.feed.getSuggestedFeeds', method: 'GET' } as Endpoint,
  getTimeline: { nsid: 'app.bsky.feed.getTimeline', method: 'GET' } as Endpoint,
  searchPosts: { nsid: 'app.bsky.feed.searchPosts', method: 'GET' } as Endpoint,
  sendInteractions: { nsid: 'app.bsky.feed.sendInteractions', method: 'POST' } as Endpoint,
} as const

export const appBskyGraph = {
  getActorStarterPacks: { nsid: 'app.bsky.graph.getActorStarterPacks', method: 'GET' } as Endpoint,
  getBlocks: { nsid: 'app.bsky.graph.getBlocks', method: 'GET' } as Endpoint,
  getFollowers: { nsid: 'app.bsky.graph.getFollowers', method: 'GET' } as Endpoint,
  getFollows: { nsid: 'app.bsky.graph.getFollows', method: 'GET' } as Endpoint,
  getKnownFollowers: { nsid: 'app.bsky.graph.getKnownFollowers', method: 'GET' } as Endpoint,
  getList: { nsid: 'app.bsky.graph.getList', method: 'GET' } as Endpoint,
  getListBlocks: { nsid: 'app.bsky.graph.getListBlocks', method: 'GET' } as Endpoint,
  getListMutes: { nsid: 'app.bsky.graph.getListMutes', method: 'GET' } as Endpoint,
  getLists: { nsid: 'app.bsky.graph.getLists', method: 'GET' } as Endpoint,
  getListsWithMembership: { nsid: 'app.bsky.graph.getListsWithMembership', method: 'GET' } as Endpoint,
  getMutes: { nsid: 'app.bsky.graph.getMutes', method: 'GET' } as Endpoint,
  getRelationships: { nsid: 'app.bsky.graph.getRelationships', method: 'GET' } as Endpoint,
  getStarterPack: { nsid: 'app.bsky.graph.getStarterPack', method: 'GET' } as Endpoint,
  getStarterPacks: { nsid: 'app.bsky.graph.getStarterPacks', method: 'GET' } as Endpoint,
  getStarterPacksWithMembership: { nsid: 'app.bsky.graph.getStarterPacksWithMembership', method: 'GET' } as Endpoint,
  getSuggestedFollowsByActor: { nsid: 'app.bsky.graph.getSuggestedFollowsByActor', method: 'GET' } as Endpoint,
  muteActor: { nsid: 'app.bsky.graph.muteActor', method: 'POST' } as Endpoint,
  muteActorList: { nsid: 'app.bsky.graph.muteActorList', method: 'POST' } as Endpoint,
  muteThread: { nsid: 'app.bsky.graph.muteThread', method: 'POST' } as Endpoint,
  searchStarterPacks: { nsid: 'app.bsky.graph.searchStarterPacks', method: 'GET' } as Endpoint,
  unmuteActor: { nsid: 'app.bsky.graph.unmuteActor', method: 'POST' } as Endpoint,
  unmuteActorList: { nsid: 'app.bsky.graph.unmuteActorList', method: 'POST' } as Endpoint,
  unmuteThread: { nsid: 'app.bsky.graph.unmuteThread', method: 'POST' } as Endpoint,
} as const

export const appBskyLabeler = {
  getServices: { nsid: 'app.bsky.labeler.getServices', method: 'GET' } as Endpoint,
} as const

export const appBskyNotification = {
  getPreferences: { nsid: 'app.bsky.notification.getPreferences', method: 'GET' } as Endpoint,
  getUnreadCount: { nsid: 'app.bsky.notification.getUnreadCount', method: 'GET' } as Endpoint,
  listActivitySubscriptions: { nsid: 'app.bsky.notification.listActivitySubscriptions', method: 'GET' } as Endpoint,
  listNotifications: { nsid: 'app.bsky.notification.listNotifications', method: 'GET' } as Endpoint,
  putActivitySubscription: { nsid: 'app.bsky.notification.putActivitySubscription', method: 'POST' } as Endpoint,
  putPreferences: { nsid: 'app.bsky.notification.putPreferences', method: 'POST' } as Endpoint,
  putPreferencesV2: { nsid: 'app.bsky.notification.putPreferencesV2', method: 'POST' } as Endpoint,
  registerPush: { nsid: 'app.bsky.notification.registerPush', method: 'POST' } as Endpoint,
  unregisterPush: { nsid: 'app.bsky.notification.unregisterPush', method: 'POST' } as Endpoint,
  updateSeen: { nsid: 'app.bsky.notification.updateSeen', method: 'POST' } as Endpoint,
} as const

export const appBskyUnspecced = {
  getAgeAssuranceState: { nsid: 'app.bsky.unspecced.getAgeAssuranceState', method: 'GET' } as Endpoint,
  getConfig: { nsid: 'app.bsky.unspecced.getConfig', method: 'GET' } as Endpoint,
  getOnboardingSuggestedStarterPacks: { nsid: 'app.bsky.unspecced.getOnboardingSuggestedStarterPacks', method: 'GET' } as Endpoint,
  getOnboardingSuggestedStarterPacksSkeleton: { nsid: 'app.bsky.unspecced.getOnboardingSuggestedStarterPacksSkeleton', method: 'GET' } as Endpoint,
  getPopularFeedGenerators: { nsid: 'app.bsky.unspecced.getPopularFeedGenerators', method: 'GET' } as Endpoint,
  getPostThreadOtherV2: { nsid: 'app.bsky.unspecced.getPostThreadOtherV2', method: 'GET' } as Endpoint,
  getPostThreadV2: { nsid: 'app.bsky.unspecced.getPostThreadV2', method: 'GET' } as Endpoint,
  getSuggestedFeeds: { nsid: 'app.bsky.unspecced.getSuggestedFeeds', method: 'GET' } as Endpoint,
  getSuggestedFeedsSkeleton: { nsid: 'app.bsky.unspecced.getSuggestedFeedsSkeleton', method: 'GET' } as Endpoint,
  getSuggestedStarterPacks: { nsid: 'app.bsky.unspecced.getSuggestedStarterPacks', method: 'GET' } as Endpoint,
  getSuggestedStarterPacksSkeleton: { nsid: 'app.bsky.unspecced.getSuggestedStarterPacksSkeleton', method: 'GET' } as Endpoint,
  getSuggestedUsers: { nsid: 'app.bsky.unspecced.getSuggestedUsers', method: 'GET' } as Endpoint,
  getSuggestedUsersSkeleton: { nsid: 'app.bsky.unspecced.getSuggestedUsersSkeleton', method: 'GET' } as Endpoint,
  getSuggestionsSkeleton: { nsid: 'app.bsky.unspecced.getSuggestionsSkeleton', method: 'GET' } as Endpoint,
  getTaggedSuggestions: { nsid: 'app.bsky.unspecced.getTaggedSuggestions', method: 'GET' } as Endpoint,
  getTrendingTopics: { nsid: 'app.bsky.unspecced.getTrendingTopics', method: 'GET' } as Endpoint,
  getTrends: { nsid: 'app.bsky.unspecced.getTrends', method: 'GET' } as Endpoint,
  getTrendsSkeleton: { nsid: 'app.bsky.unspecced.getTrendsSkeleton', method: 'GET' } as Endpoint,
  initAgeAssurance: { nsid: 'app.bsky.unspecced.initAgeAssurance', method: 'POST' } as Endpoint,
  searchActorsSkeleton: { nsid: 'app.bsky.unspecced.searchActorsSkeleton', method: 'GET' } as Endpoint,
  searchPostsSkeleton: { nsid: 'app.bsky.unspecced.searchPostsSkeleton', method: 'GET' } as Endpoint,
  searchStarterPacksSkeleton: { nsid: 'app.bsky.unspecced.searchStarterPacksSkeleton', method: 'GET' } as Endpoint,
} as const

export const appBskyVideo = {
  getJobStatus: { nsid: 'app.bsky.video.getJobStatus', method: 'GET' } as Endpoint,
  getUploadLimits: { nsid: 'app.bsky.video.getUploadLimits', method: 'GET' } as Endpoint,
  uploadVideo: { nsid: 'app.bsky.video.uploadVideo', method: 'POST' } as Endpoint,
} as const

export const comAtprotoAdmin = {
  deleteAccount: { nsid: 'com.atproto.admin.deleteAccount', method: 'POST' } as Endpoint,
  disableAccountInvites: { nsid: 'com.atproto.admin.disableAccountInvites', method: 'POST' } as Endpoint,
  disableInviteCodes: { nsid: 'com.atproto.admin.disableInviteCodes', method: 'POST' } as Endpoint,
  enableAccountInvites: { nsid: 'com.atproto.admin.enableAccountInvites', method: 'POST' } as Endpoint,
  getAccountInfo: { nsid: 'com.atproto.admin.getAccountInfo', method: 'GET' } as Endpoint,
  getAccountInfos: { nsid: 'com.atproto.admin.getAccountInfos', method: 'GET' } as Endpoint,
  getInviteCodes: { nsid: 'com.atproto.admin.getInviteCodes', method: 'GET' } as Endpoint,
  getSubjectStatus: { nsid: 'com.atproto.admin.getSubjectStatus', method: 'GET' } as Endpoint,
  searchAccounts: { nsid: 'com.atproto.admin.searchAccounts', method: 'GET' } as Endpoint,
  sendEmail: { nsid: 'com.atproto.admin.sendEmail', method: 'POST' } as Endpoint,
  updateAccountEmail: { nsid: 'com.atproto.admin.updateAccountEmail', method: 'POST' } as Endpoint,
  updateAccountHandle: { nsid: 'com.atproto.admin.updateAccountHandle', method: 'POST' } as Endpoint,
  updateAccountPassword: { nsid: 'com.atproto.admin.updateAccountPassword', method: 'POST' } as Endpoint,
  updateAccountSigningKey: { nsid: 'com.atproto.admin.updateAccountSigningKey', method: 'POST' } as Endpoint,
  updateSubjectStatus: { nsid: 'com.atproto.admin.updateSubjectStatus', method: 'POST' } as Endpoint,
} as const

export const comAtprotoIdentity = {
  getRecommendedDidCredentials: { nsid: 'com.atproto.identity.getRecommendedDidCredentials', method: 'GET' } as Endpoint,
  refreshIdentity: { nsid: 'com.atproto.identity.refreshIdentity', method: 'POST' } as Endpoint,
  requestPlcOperationSignature: { nsid: 'com.atproto.identity.requestPlcOperationSignature', method: 'POST' } as Endpoint,
  resolveDid: { nsid: 'com.atproto.identity.resolveDid', method: 'GET' } as Endpoint,
  resolveHandle: { nsid: 'com.atproto.identity.resolveHandle', method: 'GET' } as Endpoint,
  resolveIdentity: { nsid: 'com.atproto.identity.resolveIdentity', method: 'GET' } as Endpoint,
  signPlcOperation: { nsid: 'com.atproto.identity.signPlcOperation', method: 'POST' } as Endpoint,
  submitPlcOperation: { nsid: 'com.atproto.identity.submitPlcOperation', method: 'POST' } as Endpoint,
  updateHandle: { nsid: 'com.atproto.identity.updateHandle', method: 'POST' } as Endpoint,
} as const

export const comAtprotoLabel = {
  queryLabels: { nsid: 'com.atproto.label.queryLabels', method: 'GET' } as Endpoint,
} as const

export const comAtprotoLexicon = {
  resolveLexicon: { nsid: 'com.atproto.lexicon.resolveLexicon', method: 'GET' } as Endpoint,
} as const

export const comAtprotoModeration = {
  createReport: { nsid: 'com.atproto.moderation.createReport', method: 'POST' } as Endpoint,
} as const

export const comAtprotoRepo = {
  applyWrites: { nsid: 'com.atproto.repo.applyWrites', method: 'POST' } as Endpoint,
  createRecord: { nsid: 'com.atproto.repo.createRecord', method: 'POST' } as Endpoint,
  deleteRecord: { nsid: 'com.atproto.repo.deleteRecord', method: 'POST' } as Endpoint,
  describeRepo: { nsid: 'com.atproto.repo.describeRepo', method: 'GET' } as Endpoint,
  getRecord: { nsid: 'com.atproto.repo.getRecord', method: 'GET' } as Endpoint,
  importRepo: { nsid: 'com.atproto.repo.importRepo', method: 'POST' } as Endpoint,
  listMissingBlobs: { nsid: 'com.atproto.repo.listMissingBlobs', method: 'GET' } as Endpoint,
  listRecords: { nsid: 'com.atproto.repo.listRecords', method: 'GET' } as Endpoint,
  putRecord: { nsid: 'com.atproto.repo.putRecord', method: 'POST' } as Endpoint,
  uploadBlob: { nsid: 'com.atproto.repo.uploadBlob', method: 'POST' } as Endpoint,
} as const

export const comAtprotoServer = {
  activateAccount: { nsid: 'com.atproto.server.activateAccount', method: 'POST' } as Endpoint,
  checkAccountStatus: { nsid: 'com.atproto.server.checkAccountStatus', method: 'GET' } as Endpoint,
  confirmEmail: { nsid: 'com.atproto.server.confirmEmail', method: 'POST' } as Endpoint,
  createAccount: { nsid: 'com.atproto.server.createAccount', method: 'POST' } as Endpoint,
  createAppPassword: { nsid: 'com.atproto.server.createAppPassword', method: 'POST' } as Endpoint,
  createInviteCode: { nsid: 'com.atproto.server.createInviteCode', method: 'POST' } as Endpoint,
  createInviteCodes: { nsid: 'com.atproto.server.createInviteCodes', method: 'POST' } as Endpoint,
  createSession: { nsid: 'com.atproto.server.createSession', method: 'POST' } as Endpoint,
  deactivateAccount: { nsid: 'com.atproto.server.deactivateAccount', method: 'POST' } as Endpoint,
  deleteAccount: { nsid: 'com.atproto.server.deleteAccount', method: 'POST' } as Endpoint,
  deleteSession: { nsid: 'com.atproto.server.deleteSession', method: 'POST' } as Endpoint,
  describeServer: { nsid: 'com.atproto.server.describeServer', method: 'GET' } as Endpoint,
  getAccountInviteCodes: { nsid: 'com.atproto.server.getAccountInviteCodes', method: 'GET' } as Endpoint,
  getServiceAuth: { nsid: 'com.atproto.server.getServiceAuth', method: 'GET' } as Endpoint,
  getSession: { nsid: 'com.atproto.server.getSession', method: 'GET' } as Endpoint,
  listAppPasswords: { nsid: 'com.atproto.server.listAppPasswords', method: 'GET' } as Endpoint,
  refreshSession: { nsid: 'com.atproto.server.refreshSession', method: 'POST' } as Endpoint,
  requestAccountDelete: { nsid: 'com.atproto.server.requestAccountDelete', method: 'POST' } as Endpoint,
  requestEmailConfirmation: { nsid: 'com.atproto.server.requestEmailConfirmation', method: 'POST' } as Endpoint,
  requestEmailUpdate: { nsid: 'com.atproto.server.requestEmailUpdate', method: 'POST' } as Endpoint,
  requestPasswordReset: { nsid: 'com.atproto.server.requestPasswordReset', method: 'POST' } as Endpoint,
  reserveSigningKey: { nsid: 'com.atproto.server.reserveSigningKey', method: 'POST' } as Endpoint,
  resetPassword: { nsid: 'com.atproto.server.resetPassword', method: 'POST' } as Endpoint,
  revokeAppPassword: { nsid: 'com.atproto.server.revokeAppPassword', method: 'POST' } as Endpoint,
  updateEmail: { nsid: 'com.atproto.server.updateEmail', method: 'POST' } as Endpoint,
} as const

export const comAtprotoSync = {
  getBlob: { nsid: 'com.atproto.sync.getBlob', method: 'GET' } as Endpoint,
  getBlocks: { nsid: 'com.atproto.sync.getBlocks', method: 'GET' } as Endpoint,
  getCheckout: { nsid: 'com.atproto.sync.getCheckout', method: 'GET' } as Endpoint,
  getHead: { nsid: 'com.atproto.sync.getHead', method: 'GET' } as Endpoint,
  getHostStatus: { nsid: 'com.atproto.sync.getHostStatus', method: 'GET' } as Endpoint,
  getLatestCommit: { nsid: 'com.atproto.sync.getLatestCommit', method: 'GET' } as Endpoint,
  getRecord: { nsid: 'com.atproto.sync.getRecord', method: 'GET' } as Endpoint,
  getRepo: { nsid: 'com.atproto.sync.getRepo', method: 'GET' } as Endpoint,
  getRepoStatus: { nsid: 'com.atproto.sync.getRepoStatus', method: 'GET' } as Endpoint,
  listBlobs: { nsid: 'com.atproto.sync.listBlobs', method: 'GET' } as Endpoint,
  listHosts: { nsid: 'com.atproto.sync.listHosts', method: 'GET' } as Endpoint,
  listRepos: { nsid: 'com.atproto.sync.listRepos', method: 'GET' } as Endpoint,
  listReposByCollection: { nsid: 'com.atproto.sync.listReposByCollection', method: 'GET' } as Endpoint,
  notifyOfUpdate: { nsid: 'com.atproto.sync.notifyOfUpdate', method: 'POST' } as Endpoint,
  requestCrawl: { nsid: 'com.atproto.sync.requestCrawl', method: 'POST' } as Endpoint,
} as const

export const comAtprotoTemp = {
  addReservedHandle: { nsid: 'com.atproto.temp.addReservedHandle', method: 'POST' } as Endpoint,
  checkHandleAvailability: { nsid: 'com.atproto.temp.checkHandleAvailability', method: 'GET' } as Endpoint,
  checkSignupQueue: { nsid: 'com.atproto.temp.checkSignupQueue', method: 'GET' } as Endpoint,
  dereferenceScope: { nsid: 'com.atproto.temp.dereferenceScope', method: 'GET' } as Endpoint,
  fetchLabels: { nsid: 'com.atproto.temp.fetchLabels', method: 'GET' } as Endpoint,
  requestPhoneVerification: { nsid: 'com.atproto.temp.requestPhoneVerification', method: 'POST' } as Endpoint,
  revokeAccountCredentials: { nsid: 'com.atproto.temp.revokeAccountCredentials', method: 'POST' } as Endpoint,
} as const

