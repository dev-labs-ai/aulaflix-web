import { authErrors, isEmail } from '#shared/content/auth'

/** Primeiro passo do login: diz se já existe conta com o e-mail, para pedir a senha ou criar a conta. */
export default defineEventHandler(async (event) => {
  const email = bodyText(await readBody(event), 'email')
  if (!isEmail(email)) return { error: authErrors.emailInvalid }
  return { exists: accountExists(event, email) }
})
