/**
 * Tells screen readers which page opened after a client-side navigation, as the route announcer of Next's App
 * Router does in the reference app: it announces the document title, or the first h1 when there is no title, and
 * only when that changed. Not on first load, when screen readers read the new page themselves.
 *
 * It replaces Nuxt's `<NuxtRouteAnnouncer>`, which is polite, announces on first load too, and lives in app.vue,
 * so the 404 page (error.vue) had none. Created once on <body>, this one stays put when error.vue replaces app.vue.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const region = document.createElement('div')
  region.setAttribute('role', 'alert')
  region.setAttribute('aria-live', 'assertive')
  // Visually hidden, with the reference app's styles.
  region.style.cssText
    = 'position:absolute;border:0;height:1px;margin:-1px;padding:0;width:1px;clip:rect(0 0 0 0);overflow:hidden;white-space:nowrap;word-wrap:normal'
  document.body.appendChild(region)

  let previousTitle = currentTitle()
  // Nuxt holds head updates while the next page loads, so once the head renders, the title is the new page's.
  injectHead(nuxtApp)?.hooks?.hook('dom:rendered', () => {
    const title = currentTitle()
    if (title !== previousTitle) region.textContent = title
    previousTitle = title
  })
})

function currentTitle() {
  if (document.title) return document.title
  const heading = document.querySelector('h1')
  return heading?.innerText || heading?.textContent || ''
}
