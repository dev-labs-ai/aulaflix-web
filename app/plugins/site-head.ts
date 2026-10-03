import { site } from '#shared/content/site'

// Set in a plugin rather than in app.vue so that error.vue, which replaces app.vue, gets it too.
export default defineNuxtPlugin(() => {
  useHead({
    titleTemplate: title => (title ? `${title} | ${site.name}` : site.title),
  })
  useSeoMeta({ description: site.description })
})
