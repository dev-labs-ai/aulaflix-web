// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxt/fonts'],
  // Turns the router on before the first page exists, so unknown URLs answer 404.
  pages: true,
  components: [{ path: '~/components', pathPrefix: false }],
  devtools: { enabled: true },
  app: {
    head: {
      htmlAttrs: { lang: 'pt-BR' },
      link: [{ rel: 'icon', href: '/icon.svg', type: 'image/svg+xml', sizes: 'any' }],
    },
  },
  css: ['~/assets/css/fonts.css', '~/assets/css/tailwind.css'],
  // The reference app runs on 3000, so both can run side by side.
  devServer: { port: 3001 },
  compatibilityDate: '2025-07-15',
  vite: { plugins: [tailwindcss()] },
  typescript: {
    // shared/content is copied unchanged from the reference app, which compiles without this flag.
    sharedTsConfig: { compilerOptions: { noUncheckedIndexedAccess: false } },
  },
  fonts: {
    defaults: { weights: ['200 800'], styles: ['normal'], subsets: ['latin'] },
    families: [
      {
        name: 'Bricolage Grotesque',
        provider: 'google',
        // `opsz` gives the large headings the font's display design.
        providerOptions: { google: { experimental: { variableAxis: { opsz: [['12', '96']] } } } },
      },
      { name: 'Atkinson Hyperlegible Next', provider: 'google' },
    ],
  },
})
