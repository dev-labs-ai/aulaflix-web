// The signed-in student's enrollment in the course: whether they own it, for the course page to show "Continuar"
// instead of the price, and for /aprender, the lessons done and the one to resume.
export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug') ?? ''
  const user = getSessionUser(event)
  const enrollment = user && getEnrollment(event, user, slug)
  if (!enrollment) return { owned: false as const }
  return { owned: true as const, completedSlugs: [...enrollment.completedSlugs], resume: enrollment.resume.slug }
})
