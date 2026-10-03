// Whether the signed-in student owns the course, for the course page to show "Continuar" instead of the price.
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const user = getSessionUser(event)
  return { owned: Boolean(user && getEnrollment(event, user, slug)) }
})
