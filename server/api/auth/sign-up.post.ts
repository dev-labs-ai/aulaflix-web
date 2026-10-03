import { settingsCopy } from '#shared/content/account'
import { AUTH_PASSWORD_MIN_LENGTH, authErrors, isEmail } from '#shared/content/auth'

/** Cria a conta e já entra nela; a confirmação do e-mail fica para depois, num aviso no site. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const name = cleanName(bodyText(body, 'name'))
  const email = bodyText(body, 'email')
  const password = bodyText(body, 'password')
  if (!name) return { error: authErrors.nameRequired }
  if (name.length > NAME_MAX_LENGTH) return { error: settingsCopy.nameTooLong }
  if (!isEmail(email)) return { error: authErrors.emailInvalid }
  if (password.length < AUTH_PASSWORD_MIN_LENGTH) return { error: authErrors.passwordTooShort }
  if (accountExists(event, email)) return { error: authErrors.emailTaken }

  startSession(event, createAccount(event, { name, email, password }))
  return { redirect: safeNextPath(bodyText(body, 'next')) }
})
