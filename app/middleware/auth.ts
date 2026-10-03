/**
 * Páginas só para quem está logado: sem sessão, manda para o login e volta para a página depois de entrar,
 * as `requireUser()` does in the reference app. Pages opt in with `definePageMeta({ middleware: 'auth' })`.
 *
 * It asks the server each time instead of reading the cached session, which is stale right after signing in:
 * the sign-in page navigates here first and refreshes the page data after.
 */
export default defineNuxtRouteMiddleware(async (to) => {
  // The server checked the session before rendering this page, so hydration doesn't ask again.
  const nuxtApp = useNuxtApp()
  if (import.meta.client && nuxtApp.isHydrating && nuxtApp.payload.serverRendered) return

  const user = await useRequestFetch()('/api/auth/session')
  if (!user) return navigateTo(signInPath(to.path), { redirectCode: 307 })
})
