// Former Server Action `joinWaitlist`: quem entrou na conta se inscreve com um clique em "Avise-me", com o
// e-mail da conta. Signed out, it answers where to sign in instead of redirecting (app/utils/waitlist-actions.ts).
export default defineEventHandler(async (event) => {
  const course = bodyText(await readBody(event), 'course')
  const user = getSessionUser(event)
  if (!user) return { redirect: signInPath(`/cursos/${course}`) }
  setWaitlist(event, user.email, course, true)
  return null
})
