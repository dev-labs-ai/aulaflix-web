// The student's orders, newest first: the Compras tab of /conta lists them, and the checkout looks in them for the
// course and the order to confirm. Signed out, there are none. Each order carries only its courses' slugs and titles.
export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) return []
  return getPurchases(event, user).map(({ courses, ...purchase }) => ({
    ...purchase,
    courses: courses.map(({ slug, title }) => ({ slug, title })),
  }))
})
