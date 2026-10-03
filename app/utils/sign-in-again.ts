/**
 * The session ended after the page loaded, and an API route answered where to sign in, as `requireUser()` did
 * inside the reference app's Server Actions. The data is refreshed first: /entrar reads the cached session, and
 * would send a student it still sees as signed in back here.
 */
export async function signInAgain(redirect: string) {
  await refreshNuxtData()
  await navigateTo(redirect)
}
