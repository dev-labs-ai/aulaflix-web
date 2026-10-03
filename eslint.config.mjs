// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    // Components keep the names of the reference app's React components (Badge, Board, Logo).
    'vue/multi-word-component-names': 'off',
  },
})
