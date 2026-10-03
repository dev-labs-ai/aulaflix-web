/**
 * Who is signed in, read from the session cookie on the server. The explicit key lets every caller share
 * one request, and `refreshNuxtData()` after an action refreshes it with the rest of the page data.
 */
export function useSessionUser() {
  return useFetch('/api/auth/session', { key: 'session-user' })
}
