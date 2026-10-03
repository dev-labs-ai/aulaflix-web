// Who is signed in, for the pages to render during SSR (the reference app's server components read it directly).
export default defineEventHandler(event => getSessionUser(event))
