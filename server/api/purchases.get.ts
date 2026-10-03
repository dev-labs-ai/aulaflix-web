// The student's orders, newest first, for the Compras tab of /conta. Each order carries only its courses' titles.
export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  return getPurchases(event, user).map(({ courses, ...purchase }) => ({
    ...purchase,
    courses: courses.map(course => course.title),
  }))
})
