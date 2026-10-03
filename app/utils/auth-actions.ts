// Client side of the reference app's Server Actions in src/lib/auth-actions.ts: each one calls its
// API route, then refreshes the page data so the header and the page pick up the new cookies (ADR 0002).

/** Primeiro passo do login: diz se já existe conta com o e-mail, ou o erro. */
export function lookUpEmail(email: string) {
  return $fetch('/api/auth/look-up-email', { method: 'POST', body: { email } })
}

/** Entra na conta e segue para `next`. Devolve a mensagem de erro, ou `null` quando entrou. */
export async function signIn(input: { email: string, password: string, next: string }) {
  const result = await $fetch('/api/auth/sign-in', { method: 'POST', body: input })
  if ('error' in result) return result.error
  await navigateTo(result.redirect)
  await refreshNuxtData()
  return null
}

/** Cria a conta, entra nela e segue para `next`. Devolve a mensagem de erro, ou `null` quando entrou. */
export async function signUp(input: { name: string, email: string, password: string, next: string }) {
  const result = await $fetch('/api/auth/sign-up', { method: 'POST', body: input })
  if ('error' in result) return result.error
  await navigateTo(result.redirect)
  await refreshNuxtData()
  return null
}

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

/** Conta: troca o nome exibido, que o header passa a mostrar. Devolve a mensagem de erro, ou `null` quando salvou. */
export async function updateName(name: string) {
  const result = await $fetch('/api/auth/update-name', { method: 'POST', body: { name } })
  if ('redirect' in result) {
    await signInAgain(result.redirect)
    return null
  }
  if (result.error) return result.error
  await refreshNuxtData()
  return null
}
