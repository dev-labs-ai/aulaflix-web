// Client side of the reference app's Server Actions in src/lib/waitlist-actions.ts: each one calls its
// API route, then refreshes the page data so the course page picks up the new cookie (ADR 0002).

/**
 * The session ended after the page loaded, and the route answered where to sign in. The data is refreshed
 * first: /entrar reads the cached session, and would send a student it still sees as signed in back here.
 */
async function signInAgain(redirect: string) {
  await refreshNuxtData()
  await navigateTo(redirect)
}

/** Quem entrou na conta: um clique em "Avise-me" usa o e-mail da conta. */
export async function joinWaitlist(course: string) {
  const result = await $fetch('/api/waitlist/join', { method: 'POST', body: { course } })
  if (result) return signInAgain(result.redirect)
  await refreshNuxtData()
}

export async function leaveWaitlist(course: string) {
  const result = await $fetch('/api/waitlist/leave', { method: 'POST', body: { course } })
  if (result) return signInAgain(result.redirect)
  await refreshNuxtData()
}

/** Quem não entrou: só o e-mail. Devolve o e-mail inscrito, ou o erro. */
export async function joinWaitlistWithEmail(course: string, email: string) {
  const result = await $fetch('/api/waitlist/join-with-email', { method: 'POST', body: { course, email } })
  if ('email' in result) await refreshNuxtData()
  return result
}
