import { settingsCopy } from '#shared/content/account'
import { authErrors } from '#shared/content/auth'

// Former Server Action `updateName`: o nome editado em Conta. Signed out, it answers where to sign in instead of
// redirecting (app/utils/auth-actions.ts).
export default defineEventHandler(async (event) => {
  const user = getSessionUser(event)
  if (!user) return { redirect: signInPath('/conta') }
  const name = cleanName(bodyText(await readBody(event), 'name'))
  if (!name) return { error: authErrors.nameRequired }
  if (name.length > NAME_MAX_LENGTH) return { error: settingsCopy.nameTooLong }

  setDisplayName(event, user, name)
  return { error: null }
})
