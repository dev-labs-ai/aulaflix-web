import { authErrors, isEmail } from '#shared/content/auth'

/** Quem não entrou: pede só o e-mail (Server Action `joinWaitlistWithEmail`). */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const email = bodyText(body, 'email').trim()
  if (!email) return { error: authErrors.emailRequired }
  if (!isEmail(email)) return { error: authErrors.emailInvalid }
  setWaitlist(event, email, bodyText(body, 'course'), true)
  return { email }
})
