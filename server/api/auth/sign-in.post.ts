import { authErrors } from '#shared/content/auth'

// Former Server Action `signIn`. Instead of redirecting, it answers where to go; the page navigates there
// and refreshes its data (app/utils/auth-actions.ts).
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = checkCredentials(event, bodyText(body, 'email'), bodyText(body, 'password'))
  if (!user) return { error: authErrors.wrongPassword }

  startSession(event, user)
  return { redirect: safeNextPath(bodyText(body, 'next')) }
})
