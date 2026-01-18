//! Auto-generated from ATProto lexicons
//! Run `ailog gen` to regenerate
//! Do not edit manually

#![allow(dead_code)]

#[derive(Debug, Clone, Copy)]
pub struct Endpoint {
    pub nsid: &'static str,
    pub method: &'static str,
}

/// Build XRPC URL for an endpoint
pub fn url(pds: &str, endpoint: &Endpoint) -> String {
    format!("https://{}/xrpc/{}", pds, endpoint.nsid)
}

pub mod app_bsky_actor {
    use super::Endpoint;

    pub const GET_PREFERENCES: Endpoint = Endpoint { nsid: "app.bsky.actor.getPreferences", method: "GET" };
    pub const GET_PROFILE: Endpoint = Endpoint { nsid: "app.bsky.actor.getProfile", method: "GET" };
    pub const GET_PROFILES: Endpoint = Endpoint { nsid: "app.bsky.actor.getProfiles", method: "GET" };
    pub const GET_SUGGESTIONS: Endpoint = Endpoint { nsid: "app.bsky.actor.getSuggestions", method: "GET" };
    pub const PUT_PREFERENCES: Endpoint = Endpoint { nsid: "app.bsky.actor.putPreferences", method: "POST" };
    pub const SEARCH_ACTORS: Endpoint = Endpoint { nsid: "app.bsky.actor.searchActors", method: "GET" };
    pub const SEARCH_ACTORS_TYPEAHEAD: Endpoint = Endpoint { nsid: "app.bsky.actor.searchActorsTypeahead", method: "GET" };
}

pub mod app_bsky_ageassurance {
    use super::Endpoint;

    pub const BEGIN: Endpoint = Endpoint { nsid: "app.bsky.ageassurance.begin", method: "POST" };
    pub const GET_CONFIG: Endpoint = Endpoint { nsid: "app.bsky.ageassurance.getConfig", method: "GET" };
    pub const GET_STATE: Endpoint = Endpoint { nsid: "app.bsky.ageassurance.getState", method: "GET" };
}

pub mod app_bsky_bookmark {
    use super::Endpoint;

    pub const CREATE_BOOKMARK: Endpoint = Endpoint { nsid: "app.bsky.bookmark.createBookmark", method: "POST" };
    pub const DELETE_BOOKMARK: Endpoint = Endpoint { nsid: "app.bsky.bookmark.deleteBookmark", method: "POST" };
    pub const GET_BOOKMARKS: Endpoint = Endpoint { nsid: "app.bsky.bookmark.getBookmarks", method: "GET" };
}

pub mod app_bsky_contact {
    use super::Endpoint;

    pub const DISMISS_MATCH: Endpoint = Endpoint { nsid: "app.bsky.contact.dismissMatch", method: "POST" };
    pub const GET_MATCHES: Endpoint = Endpoint { nsid: "app.bsky.contact.getMatches", method: "GET" };
    pub const GET_SYNC_STATUS: Endpoint = Endpoint { nsid: "app.bsky.contact.getSyncStatus", method: "GET" };
    pub const IMPORT_CONTACTS: Endpoint = Endpoint { nsid: "app.bsky.contact.importContacts", method: "POST" };
    pub const REMOVE_DATA: Endpoint = Endpoint { nsid: "app.bsky.contact.removeData", method: "POST" };
    pub const SEND_NOTIFICATION: Endpoint = Endpoint { nsid: "app.bsky.contact.sendNotification", method: "POST" };
    pub const START_PHONE_VERIFICATION: Endpoint = Endpoint { nsid: "app.bsky.contact.startPhoneVerification", method: "POST" };
    pub const VERIFY_PHONE: Endpoint = Endpoint { nsid: "app.bsky.contact.verifyPhone", method: "POST" };
}

pub mod app_bsky_draft {
    use super::Endpoint;

    pub const CREATE_DRAFT: Endpoint = Endpoint { nsid: "app.bsky.draft.createDraft", method: "POST" };
    pub const DELETE_DRAFT: Endpoint = Endpoint { nsid: "app.bsky.draft.deleteDraft", method: "POST" };
    pub const GET_DRAFTS: Endpoint = Endpoint { nsid: "app.bsky.draft.getDrafts", method: "GET" };
    pub const UPDATE_DRAFT: Endpoint = Endpoint { nsid: "app.bsky.draft.updateDraft", method: "POST" };
}

pub mod app_bsky_feed {
    use super::Endpoint;

    pub const DESCRIBE_FEED_GENERATOR: Endpoint = Endpoint { nsid: "app.bsky.feed.describeFeedGenerator", method: "GET" };
    pub const GET_ACTOR_FEEDS: Endpoint = Endpoint { nsid: "app.bsky.feed.getActorFeeds", method: "GET" };
    pub const GET_ACTOR_LIKES: Endpoint = Endpoint { nsid: "app.bsky.feed.getActorLikes", method: "GET" };
    pub const GET_AUTHOR_FEED: Endpoint = Endpoint { nsid: "app.bsky.feed.getAuthorFeed", method: "GET" };
    pub const GET_FEED: Endpoint = Endpoint { nsid: "app.bsky.feed.getFeed", method: "GET" };
    pub const GET_FEED_GENERATOR: Endpoint = Endpoint { nsid: "app.bsky.feed.getFeedGenerator", method: "GET" };
    pub const GET_FEED_GENERATORS: Endpoint = Endpoint { nsid: "app.bsky.feed.getFeedGenerators", method: "GET" };
    pub const GET_FEED_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.feed.getFeedSkeleton", method: "GET" };
    pub const GET_LIKES: Endpoint = Endpoint { nsid: "app.bsky.feed.getLikes", method: "GET" };
    pub const GET_LIST_FEED: Endpoint = Endpoint { nsid: "app.bsky.feed.getListFeed", method: "GET" };
    pub const GET_POST_THREAD: Endpoint = Endpoint { nsid: "app.bsky.feed.getPostThread", method: "GET" };
    pub const GET_POSTS: Endpoint = Endpoint { nsid: "app.bsky.feed.getPosts", method: "GET" };
    pub const GET_QUOTES: Endpoint = Endpoint { nsid: "app.bsky.feed.getQuotes", method: "GET" };
    pub const GET_REPOSTED_BY: Endpoint = Endpoint { nsid: "app.bsky.feed.getRepostedBy", method: "GET" };
    pub const GET_SUGGESTED_FEEDS: Endpoint = Endpoint { nsid: "app.bsky.feed.getSuggestedFeeds", method: "GET" };
    pub const GET_TIMELINE: Endpoint = Endpoint { nsid: "app.bsky.feed.getTimeline", method: "GET" };
    pub const SEARCH_POSTS: Endpoint = Endpoint { nsid: "app.bsky.feed.searchPosts", method: "GET" };
    pub const SEND_INTERACTIONS: Endpoint = Endpoint { nsid: "app.bsky.feed.sendInteractions", method: "POST" };
}

pub mod app_bsky_graph {
    use super::Endpoint;

    pub const GET_ACTOR_STARTER_PACKS: Endpoint = Endpoint { nsid: "app.bsky.graph.getActorStarterPacks", method: "GET" };
    pub const GET_BLOCKS: Endpoint = Endpoint { nsid: "app.bsky.graph.getBlocks", method: "GET" };
    pub const GET_FOLLOWERS: Endpoint = Endpoint { nsid: "app.bsky.graph.getFollowers", method: "GET" };
    pub const GET_FOLLOWS: Endpoint = Endpoint { nsid: "app.bsky.graph.getFollows", method: "GET" };
    pub const GET_KNOWN_FOLLOWERS: Endpoint = Endpoint { nsid: "app.bsky.graph.getKnownFollowers", method: "GET" };
    pub const GET_LIST: Endpoint = Endpoint { nsid: "app.bsky.graph.getList", method: "GET" };
    pub const GET_LIST_BLOCKS: Endpoint = Endpoint { nsid: "app.bsky.graph.getListBlocks", method: "GET" };
    pub const GET_LIST_MUTES: Endpoint = Endpoint { nsid: "app.bsky.graph.getListMutes", method: "GET" };
    pub const GET_LISTS: Endpoint = Endpoint { nsid: "app.bsky.graph.getLists", method: "GET" };
    pub const GET_LISTS_WITH_MEMBERSHIP: Endpoint = Endpoint { nsid: "app.bsky.graph.getListsWithMembership", method: "GET" };
    pub const GET_MUTES: Endpoint = Endpoint { nsid: "app.bsky.graph.getMutes", method: "GET" };
    pub const GET_RELATIONSHIPS: Endpoint = Endpoint { nsid: "app.bsky.graph.getRelationships", method: "GET" };
    pub const GET_STARTER_PACK: Endpoint = Endpoint { nsid: "app.bsky.graph.getStarterPack", method: "GET" };
    pub const GET_STARTER_PACKS: Endpoint = Endpoint { nsid: "app.bsky.graph.getStarterPacks", method: "GET" };
    pub const GET_STARTER_PACKS_WITH_MEMBERSHIP: Endpoint = Endpoint { nsid: "app.bsky.graph.getStarterPacksWithMembership", method: "GET" };
    pub const GET_SUGGESTED_FOLLOWS_BY_ACTOR: Endpoint = Endpoint { nsid: "app.bsky.graph.getSuggestedFollowsByActor", method: "GET" };
    pub const MUTE_ACTOR: Endpoint = Endpoint { nsid: "app.bsky.graph.muteActor", method: "POST" };
    pub const MUTE_ACTOR_LIST: Endpoint = Endpoint { nsid: "app.bsky.graph.muteActorList", method: "POST" };
    pub const MUTE_THREAD: Endpoint = Endpoint { nsid: "app.bsky.graph.muteThread", method: "POST" };
    pub const SEARCH_STARTER_PACKS: Endpoint = Endpoint { nsid: "app.bsky.graph.searchStarterPacks", method: "GET" };
    pub const UNMUTE_ACTOR: Endpoint = Endpoint { nsid: "app.bsky.graph.unmuteActor", method: "POST" };
    pub const UNMUTE_ACTOR_LIST: Endpoint = Endpoint { nsid: "app.bsky.graph.unmuteActorList", method: "POST" };
    pub const UNMUTE_THREAD: Endpoint = Endpoint { nsid: "app.bsky.graph.unmuteThread", method: "POST" };
}

pub mod app_bsky_labeler {
    use super::Endpoint;

    pub const GET_SERVICES: Endpoint = Endpoint { nsid: "app.bsky.labeler.getServices", method: "GET" };
}

pub mod app_bsky_notification {
    use super::Endpoint;

    pub const GET_PREFERENCES: Endpoint = Endpoint { nsid: "app.bsky.notification.getPreferences", method: "GET" };
    pub const GET_UNREAD_COUNT: Endpoint = Endpoint { nsid: "app.bsky.notification.getUnreadCount", method: "GET" };
    pub const LIST_ACTIVITY_SUBSCRIPTIONS: Endpoint = Endpoint { nsid: "app.bsky.notification.listActivitySubscriptions", method: "GET" };
    pub const LIST_NOTIFICATIONS: Endpoint = Endpoint { nsid: "app.bsky.notification.listNotifications", method: "GET" };
    pub const PUT_ACTIVITY_SUBSCRIPTION: Endpoint = Endpoint { nsid: "app.bsky.notification.putActivitySubscription", method: "POST" };
    pub const PUT_PREFERENCES: Endpoint = Endpoint { nsid: "app.bsky.notification.putPreferences", method: "POST" };
    pub const PUT_PREFERENCES_V2: Endpoint = Endpoint { nsid: "app.bsky.notification.putPreferencesV2", method: "POST" };
    pub const REGISTER_PUSH: Endpoint = Endpoint { nsid: "app.bsky.notification.registerPush", method: "POST" };
    pub const UNREGISTER_PUSH: Endpoint = Endpoint { nsid: "app.bsky.notification.unregisterPush", method: "POST" };
    pub const UPDATE_SEEN: Endpoint = Endpoint { nsid: "app.bsky.notification.updateSeen", method: "POST" };
}

pub mod app_bsky_unspecced {
    use super::Endpoint;

    pub const GET_AGE_ASSURANCE_STATE: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getAgeAssuranceState", method: "GET" };
    pub const GET_CONFIG: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getConfig", method: "GET" };
    pub const GET_ONBOARDING_SUGGESTED_STARTER_PACKS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getOnboardingSuggestedStarterPacks", method: "GET" };
    pub const GET_ONBOARDING_SUGGESTED_STARTER_PACKS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getOnboardingSuggestedStarterPacksSkeleton", method: "GET" };
    pub const GET_POPULAR_FEED_GENERATORS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getPopularFeedGenerators", method: "GET" };
    pub const GET_POST_THREAD_OTHER_V2: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getPostThreadOtherV2", method: "GET" };
    pub const GET_POST_THREAD_V2: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getPostThreadV2", method: "GET" };
    pub const GET_SUGGESTED_FEEDS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedFeeds", method: "GET" };
    pub const GET_SUGGESTED_FEEDS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedFeedsSkeleton", method: "GET" };
    pub const GET_SUGGESTED_STARTER_PACKS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedStarterPacks", method: "GET" };
    pub const GET_SUGGESTED_STARTER_PACKS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedStarterPacksSkeleton", method: "GET" };
    pub const GET_SUGGESTED_USERS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedUsers", method: "GET" };
    pub const GET_SUGGESTED_USERS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestedUsersSkeleton", method: "GET" };
    pub const GET_SUGGESTIONS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getSuggestionsSkeleton", method: "GET" };
    pub const GET_TAGGED_SUGGESTIONS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getTaggedSuggestions", method: "GET" };
    pub const GET_TRENDING_TOPICS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getTrendingTopics", method: "GET" };
    pub const GET_TRENDS: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getTrends", method: "GET" };
    pub const GET_TRENDS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.getTrendsSkeleton", method: "GET" };
    pub const INIT_AGE_ASSURANCE: Endpoint = Endpoint { nsid: "app.bsky.unspecced.initAgeAssurance", method: "POST" };
    pub const SEARCH_ACTORS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.searchActorsSkeleton", method: "GET" };
    pub const SEARCH_POSTS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.searchPostsSkeleton", method: "GET" };
    pub const SEARCH_STARTER_PACKS_SKELETON: Endpoint = Endpoint { nsid: "app.bsky.unspecced.searchStarterPacksSkeleton", method: "GET" };
}

pub mod app_bsky_video {
    use super::Endpoint;

    pub const GET_JOB_STATUS: Endpoint = Endpoint { nsid: "app.bsky.video.getJobStatus", method: "GET" };
    pub const GET_UPLOAD_LIMITS: Endpoint = Endpoint { nsid: "app.bsky.video.getUploadLimits", method: "GET" };
    pub const UPLOAD_VIDEO: Endpoint = Endpoint { nsid: "app.bsky.video.uploadVideo", method: "POST" };
}

pub mod com_atproto_admin {
    use super::Endpoint;

    pub const DELETE_ACCOUNT: Endpoint = Endpoint { nsid: "com.atproto.admin.deleteAccount", method: "POST" };
    pub const DISABLE_ACCOUNT_INVITES: Endpoint = Endpoint { nsid: "com.atproto.admin.disableAccountInvites", method: "POST" };
    pub const DISABLE_INVITE_CODES: Endpoint = Endpoint { nsid: "com.atproto.admin.disableInviteCodes", method: "POST" };
    pub const ENABLE_ACCOUNT_INVITES: Endpoint = Endpoint { nsid: "com.atproto.admin.enableAccountInvites", method: "POST" };
    pub const GET_ACCOUNT_INFO: Endpoint = Endpoint { nsid: "com.atproto.admin.getAccountInfo", method: "GET" };
    pub const GET_ACCOUNT_INFOS: Endpoint = Endpoint { nsid: "com.atproto.admin.getAccountInfos", method: "GET" };
    pub const GET_INVITE_CODES: Endpoint = Endpoint { nsid: "com.atproto.admin.getInviteCodes", method: "GET" };
    pub const GET_SUBJECT_STATUS: Endpoint = Endpoint { nsid: "com.atproto.admin.getSubjectStatus", method: "GET" };
    pub const SEARCH_ACCOUNTS: Endpoint = Endpoint { nsid: "com.atproto.admin.searchAccounts", method: "GET" };
    pub const SEND_EMAIL: Endpoint = Endpoint { nsid: "com.atproto.admin.sendEmail", method: "POST" };
    pub const UPDATE_ACCOUNT_EMAIL: Endpoint = Endpoint { nsid: "com.atproto.admin.updateAccountEmail", method: "POST" };
    pub const UPDATE_ACCOUNT_HANDLE: Endpoint = Endpoint { nsid: "com.atproto.admin.updateAccountHandle", method: "POST" };
    pub const UPDATE_ACCOUNT_PASSWORD: Endpoint = Endpoint { nsid: "com.atproto.admin.updateAccountPassword", method: "POST" };
    pub const UPDATE_ACCOUNT_SIGNING_KEY: Endpoint = Endpoint { nsid: "com.atproto.admin.updateAccountSigningKey", method: "POST" };
    pub const UPDATE_SUBJECT_STATUS: Endpoint = Endpoint { nsid: "com.atproto.admin.updateSubjectStatus", method: "POST" };
}

pub mod com_atproto_identity {
    use super::Endpoint;

    pub const GET_RECOMMENDED_DID_CREDENTIALS: Endpoint = Endpoint { nsid: "com.atproto.identity.getRecommendedDidCredentials", method: "GET" };
    pub const REFRESH_IDENTITY: Endpoint = Endpoint { nsid: "com.atproto.identity.refreshIdentity", method: "POST" };
    pub const REQUEST_PLC_OPERATION_SIGNATURE: Endpoint = Endpoint { nsid: "com.atproto.identity.requestPlcOperationSignature", method: "POST" };
    pub const RESOLVE_DID: Endpoint = Endpoint { nsid: "com.atproto.identity.resolveDid", method: "GET" };
    pub const RESOLVE_HANDLE: Endpoint = Endpoint { nsid: "com.atproto.identity.resolveHandle", method: "GET" };
    pub const RESOLVE_IDENTITY: Endpoint = Endpoint { nsid: "com.atproto.identity.resolveIdentity", method: "GET" };
    pub const SIGN_PLC_OPERATION: Endpoint = Endpoint { nsid: "com.atproto.identity.signPlcOperation", method: "POST" };
    pub const SUBMIT_PLC_OPERATION: Endpoint = Endpoint { nsid: "com.atproto.identity.submitPlcOperation", method: "POST" };
    pub const UPDATE_HANDLE: Endpoint = Endpoint { nsid: "com.atproto.identity.updateHandle", method: "POST" };
}

pub mod com_atproto_label {
    use super::Endpoint;

    pub const QUERY_LABELS: Endpoint = Endpoint { nsid: "com.atproto.label.queryLabels", method: "GET" };
}

pub mod com_atproto_lexicon {
    use super::Endpoint;

    pub const RESOLVE_LEXICON: Endpoint = Endpoint { nsid: "com.atproto.lexicon.resolveLexicon", method: "GET" };
}

pub mod com_atproto_moderation {
    use super::Endpoint;

    pub const CREATE_REPORT: Endpoint = Endpoint { nsid: "com.atproto.moderation.createReport", method: "POST" };
}

pub mod com_atproto_repo {
    use super::Endpoint;

    pub const APPLY_WRITES: Endpoint = Endpoint { nsid: "com.atproto.repo.applyWrites", method: "POST" };
    pub const CREATE_RECORD: Endpoint = Endpoint { nsid: "com.atproto.repo.createRecord", method: "POST" };
    pub const DELETE_RECORD: Endpoint = Endpoint { nsid: "com.atproto.repo.deleteRecord", method: "POST" };
    pub const DESCRIBE_REPO: Endpoint = Endpoint { nsid: "com.atproto.repo.describeRepo", method: "GET" };
    pub const GET_RECORD: Endpoint = Endpoint { nsid: "com.atproto.repo.getRecord", method: "GET" };
    pub const IMPORT_REPO: Endpoint = Endpoint { nsid: "com.atproto.repo.importRepo", method: "POST" };
    pub const LIST_MISSING_BLOBS: Endpoint = Endpoint { nsid: "com.atproto.repo.listMissingBlobs", method: "GET" };
    pub const LIST_RECORDS: Endpoint = Endpoint { nsid: "com.atproto.repo.listRecords", method: "GET" };
    pub const PUT_RECORD: Endpoint = Endpoint { nsid: "com.atproto.repo.putRecord", method: "POST" };
    pub const UPLOAD_BLOB: Endpoint = Endpoint { nsid: "com.atproto.repo.uploadBlob", method: "POST" };
}

pub mod com_atproto_server {
    use super::Endpoint;

    pub const ACTIVATE_ACCOUNT: Endpoint = Endpoint { nsid: "com.atproto.server.activateAccount", method: "POST" };
    pub const CHECK_ACCOUNT_STATUS: Endpoint = Endpoint { nsid: "com.atproto.server.checkAccountStatus", method: "GET" };
    pub const CONFIRM_EMAIL: Endpoint = Endpoint { nsid: "com.atproto.server.confirmEmail", method: "POST" };
    pub const CREATE_ACCOUNT: Endpoint = Endpoint { nsid: "com.atproto.server.createAccount", method: "POST" };
    pub const CREATE_APP_PASSWORD: Endpoint = Endpoint { nsid: "com.atproto.server.createAppPassword", method: "POST" };
    pub const CREATE_INVITE_CODE: Endpoint = Endpoint { nsid: "com.atproto.server.createInviteCode", method: "POST" };
    pub const CREATE_INVITE_CODES: Endpoint = Endpoint { nsid: "com.atproto.server.createInviteCodes", method: "POST" };
    pub const CREATE_SESSION: Endpoint = Endpoint { nsid: "com.atproto.server.createSession", method: "POST" };
    pub const DEACTIVATE_ACCOUNT: Endpoint = Endpoint { nsid: "com.atproto.server.deactivateAccount", method: "POST" };
    pub const DELETE_ACCOUNT: Endpoint = Endpoint { nsid: "com.atproto.server.deleteAccount", method: "POST" };
    pub const DELETE_SESSION: Endpoint = Endpoint { nsid: "com.atproto.server.deleteSession", method: "POST" };
    pub const DESCRIBE_SERVER: Endpoint = Endpoint { nsid: "com.atproto.server.describeServer", method: "GET" };
    pub const GET_ACCOUNT_INVITE_CODES: Endpoint = Endpoint { nsid: "com.atproto.server.getAccountInviteCodes", method: "GET" };
    pub const GET_SERVICE_AUTH: Endpoint = Endpoint { nsid: "com.atproto.server.getServiceAuth", method: "GET" };
    pub const GET_SESSION: Endpoint = Endpoint { nsid: "com.atproto.server.getSession", method: "GET" };
    pub const LIST_APP_PASSWORDS: Endpoint = Endpoint { nsid: "com.atproto.server.listAppPasswords", method: "GET" };
    pub const REFRESH_SESSION: Endpoint = Endpoint { nsid: "com.atproto.server.refreshSession", method: "POST" };
    pub const REQUEST_ACCOUNT_DELETE: Endpoint = Endpoint { nsid: "com.atproto.server.requestAccountDelete", method: "POST" };
    pub const REQUEST_EMAIL_CONFIRMATION: Endpoint = Endpoint { nsid: "com.atproto.server.requestEmailConfirmation", method: "POST" };
    pub const REQUEST_EMAIL_UPDATE: Endpoint = Endpoint { nsid: "com.atproto.server.requestEmailUpdate", method: "POST" };
    pub const REQUEST_PASSWORD_RESET: Endpoint = Endpoint { nsid: "com.atproto.server.requestPasswordReset", method: "POST" };
    pub const RESERVE_SIGNING_KEY: Endpoint = Endpoint { nsid: "com.atproto.server.reserveSigningKey", method: "POST" };
    pub const RESET_PASSWORD: Endpoint = Endpoint { nsid: "com.atproto.server.resetPassword", method: "POST" };
    pub const REVOKE_APP_PASSWORD: Endpoint = Endpoint { nsid: "com.atproto.server.revokeAppPassword", method: "POST" };
    pub const UPDATE_EMAIL: Endpoint = Endpoint { nsid: "com.atproto.server.updateEmail", method: "POST" };
}

pub mod com_atproto_sync {
    use super::Endpoint;

    pub const GET_BLOB: Endpoint = Endpoint { nsid: "com.atproto.sync.getBlob", method: "GET" };
    pub const GET_BLOCKS: Endpoint = Endpoint { nsid: "com.atproto.sync.getBlocks", method: "GET" };
    pub const GET_CHECKOUT: Endpoint = Endpoint { nsid: "com.atproto.sync.getCheckout", method: "GET" };
    pub const GET_HEAD: Endpoint = Endpoint { nsid: "com.atproto.sync.getHead", method: "GET" };
    pub const GET_HOST_STATUS: Endpoint = Endpoint { nsid: "com.atproto.sync.getHostStatus", method: "GET" };
    pub const GET_LATEST_COMMIT: Endpoint = Endpoint { nsid: "com.atproto.sync.getLatestCommit", method: "GET" };
    pub const GET_RECORD: Endpoint = Endpoint { nsid: "com.atproto.sync.getRecord", method: "GET" };
    pub const GET_REPO: Endpoint = Endpoint { nsid: "com.atproto.sync.getRepo", method: "GET" };
    pub const GET_REPO_STATUS: Endpoint = Endpoint { nsid: "com.atproto.sync.getRepoStatus", method: "GET" };
    pub const LIST_BLOBS: Endpoint = Endpoint { nsid: "com.atproto.sync.listBlobs", method: "GET" };
    pub const LIST_HOSTS: Endpoint = Endpoint { nsid: "com.atproto.sync.listHosts", method: "GET" };
    pub const LIST_REPOS: Endpoint = Endpoint { nsid: "com.atproto.sync.listRepos", method: "GET" };
    pub const LIST_REPOS_BY_COLLECTION: Endpoint = Endpoint { nsid: "com.atproto.sync.listReposByCollection", method: "GET" };
    pub const NOTIFY_OF_UPDATE: Endpoint = Endpoint { nsid: "com.atproto.sync.notifyOfUpdate", method: "POST" };
    pub const REQUEST_CRAWL: Endpoint = Endpoint { nsid: "com.atproto.sync.requestCrawl", method: "POST" };
}

pub mod com_atproto_temp {
    use super::Endpoint;

    pub const ADD_RESERVED_HANDLE: Endpoint = Endpoint { nsid: "com.atproto.temp.addReservedHandle", method: "POST" };
    pub const CHECK_HANDLE_AVAILABILITY: Endpoint = Endpoint { nsid: "com.atproto.temp.checkHandleAvailability", method: "GET" };
    pub const CHECK_SIGNUP_QUEUE: Endpoint = Endpoint { nsid: "com.atproto.temp.checkSignupQueue", method: "GET" };
    pub const DEREFERENCE_SCOPE: Endpoint = Endpoint { nsid: "com.atproto.temp.dereferenceScope", method: "GET" };
    pub const FETCH_LABELS: Endpoint = Endpoint { nsid: "com.atproto.temp.fetchLabels", method: "GET" };
    pub const REQUEST_PHONE_VERIFICATION: Endpoint = Endpoint { nsid: "com.atproto.temp.requestPhoneVerification", method: "POST" };
    pub const REVOKE_ACCOUNT_CREDENTIALS: Endpoint = Endpoint { nsid: "com.atproto.temp.revokeAccountCredentials", method: "POST" };
}

