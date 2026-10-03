// Former Server Action `leaveWaitlist`. Signed out, it answers where to sign in instead of redirecting.
export default defineEventHandler(async (event) => {
  const course = bodyText(await readBody(event), 'course')
  const user = getSessionUser(event)
  if (!user) return { redirect: signInPath(`/cursos/${course}`) }
  setWaitlist(event, user.email, course, false)
  return null
})
