/** Protótipo: faz o papel do link de confirmação que iria por e-mail (Server Action `confirmEmail`). */
export default defineEventHandler((event) => {
  const user = getSessionUser(event)
  if (user && !user.verified) markEmailVerified(event, user.email)
  return null
})
