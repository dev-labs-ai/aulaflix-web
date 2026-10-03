// Client side of the reference app's Server Actions in src/lib/auth-actions.ts: each one calls its
// API route, then refreshes the page data so the header and the page pick up the new cookies (ADR 0002).

export async function signOut() {
  await $fetch('/api/auth/sign-out', { method: 'POST' })
  await navigateTo('/')
  await refreshNuxtData()
}

/** Protótipo: faz o papel do link de confirmação que iria por e-mail. */
export async function confirmEmail() {
  await $fetch('/api/auth/confirm-email', { method: 'POST' })
  await refreshNuxtData()
}
