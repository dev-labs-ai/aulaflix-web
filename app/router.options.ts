import type { RouterConfig } from 'nuxt/schema'
import { parseQuery, stringifyQuery, type LocationQueryRaw } from 'vue-router'

/**
 * The query string each parsed query came from. vue-router writes a URL back from its query object, with its own
 * encoding, and Nuxt replaces the first URL with that one after hydration: `/entrar?next=%2Fcursos` became
 * `/entrar?next=/cursos` in the address bar. The reference app leaves a URL as it was opened, encoded or not, so a
 * query read from a URL is written back as that URL had it. A query built in code is encoded as usual.
 */
const searchOf = new WeakMap<LocationQueryRaw, string>()

export default {
  parseQuery(search) {
    const query = parseQuery(search)
    searchOf.set(query, search.startsWith('?') ? search.slice(1) : search)
    return query
  },
  stringifyQuery: query => (query && searchOf.get(query)) ?? stringifyQuery(query),
} satisfies RouterConfig
