import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { demoAccount, expectNoHorizontalScroll, getCookie, gotoHydrated, jsonCookie, longEmail, setCookie, signIn } from './helpers'

const card = (page: Page, name: string) => page.getByRole('region', { name })

/** A fresh address per test, so tests that create accounts don't depend on each other. */
const newEmail = (label: string) => `${label}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@exemplo.com`

async function submitEmail(page: Page, email: string) {
  await page.getByLabel('E-mail').fill(email)
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
}

async function createAccount(page: Page, { name, email, password }: { name: string, email: string, password: string }) {
  await submitEmail(page, email)
  await expect(page.getByRole('heading', { level: 1, name: 'Crie sua conta' })).toBeVisible()
  await page.getByLabel('Nome').fill(name)
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Criar conta' }).click()
}

async function signOutFromMenu(page: Page) {
  await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
  await page.getByRole('menuitem', { name: 'Sair' }).click()
  await expect(page.getByRole('banner').getByRole('link', { name: 'Entrar' })).toBeVisible()
}

/** Where a redirect response points, as a path with its query. */
function redirectPath(location: string | undefined) {
  const url = new URL(location ?? '', 'http://localhost')
  return url.pathname + url.search
}

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('sign-in page', () => {
  test('starts with the email, outside the site header and footer', async ({ page }) => {
    const response = await page.goto('/entrar')
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle('Entrar | Aulaflix')
    await expect(page.getByRole('banner')).toHaveCount(0)
    await expect(page.getByRole('contentinfo')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Aulaflix, página inicial' })).toHaveAttribute('href', '/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Entre ou crie sua conta')
    await expect(page.getByText('Comece pelo seu e-mail. Se ainda não tiver conta, você cria uma no passo seguinte.')).toBeVisible()
    const entry = card(page, 'Entre ou crie sua conta')
    await expect(entry.getByRole('button', { name: 'Continuar com Google' })).toBeVisible()
    await expect(entry.getByRole('button', { name: 'Continuar com GitHub' })).toBeVisible()
    await expect(entry.getByText('ou', { exact: true })).toBeVisible()
    await expect(entry.getByLabel('E-mail')).toHaveAttribute('placeholder', 'seu@email.com')
    await expect(entry.getByLabel('E-mail')).toHaveAttribute('type', 'email')
    await expect(entry.getByRole('button', { name: 'Continuar', exact: true })).toBeVisible()
  })

  test('the Google and GitHub buttons only say they are not available yet', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    const notice = page.getByText('Protótipo: a autenticação ainda não está disponível.')

    await expect(notice).toHaveCount(0)
    await page.getByRole('button', { name: 'Continuar com Google' }).click()
    await expect(notice).toBeVisible()

    await gotoHydrated(page, '/entrar')
    await expect(notice).toHaveCount(0)
    await page.getByRole('button', { name: 'Continuar com GitHub' }).click()
    await expect(notice).toBeVisible()
    await expect(page).toHaveURL('/entrar')
  })

  test('validates the email', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    const email = page.getByLabel('E-mail')

    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await expect(page.getByText('Digite seu e-mail.')).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')

    await email.fill('maria@')
    await expect(page.getByText('Esse e-mail não parece válido.')).toBeVisible()
    await email.fill('maria@exemplo.com')
    await expect(page.getByText('Esse e-mail não parece válido.')).toHaveCount(0)
    await expect(email).not.toHaveAttribute('aria-invalid')
  })

  test('an email error shows once the field loses focus with something typed', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    const email = page.getByLabel('E-mail')

    await email.click()
    await email.blur()
    await expect(page.getByText('Digite seu e-mail.')).toHaveCount(0)

    await email.fill('maria')
    await expect(page.getByText('Esse e-mail não parece válido.')).toHaveCount(0)
    await email.blur()
    await expect(page.getByText('Esse e-mail não parece válido.')).toBeVisible()
  })

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/entrar')
      await expectNoHorizontalScroll(page)
    })
  }
})

test.describe('signing in with an existing account', () => {
  test('asks for the password of that account', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, demoAccount.email)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Que bom ver você de novo')
    const body = page.getByText(`Digite a senha da conta ${demoAccount.email}.`)
    await expect(body).toBeVisible()
    await expect(body.locator('strong')).toHaveText(demoAccount.email)
    await expect(page.getByRole('button', { name: 'Voltar' })).toBeVisible()

    const password = card(page, 'Entrar').getByLabel('Senha', { exact: true })
    await expect(password).toBeFocused()
    await expect(password).toHaveAttribute('type', 'password')
    await expect(page.getByRole('link', { name: 'Esqueceu a senha?' })).toHaveAttribute('href', '/redefinir-senha')
    await expect(page.getByRole('button', { name: 'Entrar', exact: true })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('validates the password and reports a wrong one', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, demoAccount.email)

    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByText('Digite sua senha.')).toBeVisible()

    await page.getByLabel('Senha', { exact: true }).fill('senha-errada')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page.getByRole('alert').filter({ hasText: 'Senha incorreta. Confira e tente de novo.' })).toBeVisible()
    await expect(page).toHaveURL('/entrar')
  })

  test('the eye button shows and hides the password', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, demoAccount.email)
    const password = page.getByLabel('Senha', { exact: true })

    await page.getByRole('button', { name: 'Mostrar senha' }).click()
    await expect(password).toHaveAttribute('type', 'text')
    await expect(page.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Ocultar senha' }).click()
    await expect(password).toHaveAttribute('type', 'password')
    await expect(page.getByRole('button', { name: 'Mostrar senha' })).toHaveAttribute('aria-pressed', 'false')
  })

  test('"Voltar" goes back to the email step and keeps the email', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, demoAccount.email)
    await page.getByRole('button', { name: 'Voltar' }).click()

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Entre ou crie sua conta')
    await expect(page.getByLabel('E-mail')).toHaveValue(demoAccount.email)
  })

  test('the demo account signs in and the header shows the student', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, demoAccount.email)
    await page.getByLabel('Senha', { exact: true }).fill('aulaflix')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText(demoAccount.initials)
    expect(await getCookie(page, 'aulaflix_session')).toBe(encodeURIComponent(demoAccount.email))
  })

  test('the email is matched without case or surrounding spaces', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, '  AULAFLIX@Email.com ')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Que bom ver você de novo')
  })

  test('a long email wraps without horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await setCookie(page, 'aulaflix_account', jsonCookie.encode({
      name: 'Maria Souza',
      email: longEmail,
      passwordHash: createHash('sha256').update('senha-da-maria').digest('hex'),
      verified: true,
    }))
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, longEmail)

    await expect(page.getByText(`Digite a senha da conta ${longEmail}.`)).toBeVisible()
    await expectNoHorizontalScroll(page)
  })
})

test.describe('?next=', () => {
  test('sends the student to an in-site path after signing in', async ({ page }) => {
    await gotoHydrated(page, '/entrar?next=/cursos?situacao=em-breve')
    await submitEmail(page, demoAccount.email)
    await page.getByLabel('Senha', { exact: true }).fill('aulaflix')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    await expect(page).toHaveURL('/cursos?situacao=em-breve')
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toBeVisible()
  })

  for (const next of ['//evil.example', '/\\evil.example', 'https://evil.example']) {
    test(`ignores ${next}`, async ({ page }) => {
      await gotoHydrated(page, `/entrar?next=${encodeURIComponent(next)}`)
      await submitEmail(page, demoAccount.email)
      await page.getByLabel('Senha', { exact: true }).fill('aulaflix')
      await page.getByRole('button', { name: 'Entrar', exact: true }).click()

      await expect(page).toHaveURL('/')
    })
  }

  test('a signed-in student who opens /entrar goes straight to next, with a temporary redirect', async ({ page }) => {
    await signIn(page)

    let response = await page.request.get('/entrar', { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(redirectPath(response.headers().location)).toBe('/')

    response = await page.request.get('/entrar?next=/cursos', { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(redirectPath(response.headers().location)).toBe('/cursos')

    response = await page.request.get(`/entrar?next=${encodeURIComponent('//evil.example')}`, { maxRedirects: 0 })
    expect(redirectPath(response.headers().location)).toBe('/')

    await page.goto('/entrar?next=/como-funciona')
    await expect(page).toHaveURL('/como-funciona')
  })
})

test.describe('creating an account', () => {
  test('a new email asks for a name and a password', async ({ page }) => {
    const email = newEmail('nova')
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, email)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crie sua conta')
    const body = page.getByText(`Ainda não há conta com ${email}. Falta só seu nome e uma senha.`)
    await expect(body).toBeVisible()
    await expect(body.locator('strong')).toHaveText(email)

    const create = card(page, 'Crie sua conta')
    await expect(create.getByLabel('Nome')).toBeFocused()
    await expect(create.getByLabel('Nome')).toHaveAttribute('placeholder', 'Seu nome')
    await expect(create.getByText('Mínimo de 8 caracteres.')).toBeVisible()
    await expect(create.getByText('Depois mandamos um link para confirmar o e-mail. Você já pode estudar antes disso.')).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('validates the name and the password', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, newEmail('validacao'))
    await page.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page.getByText('Digite seu nome.')).toBeVisible()
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toBeVisible()
    await expect(page.getByText('Mínimo de 8 caracteres.')).toHaveCount(0)

    await page.getByLabel('Senha', { exact: true }).fill('1234567')
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toBeVisible()
    await page.getByLabel('Senha', { exact: true }).fill('12345678')
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toHaveCount(0)
  })

  test('a long email wraps without horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHydrated(page, '/entrar')
    await submitEmail(page, longEmail)

    await expect(page.getByText(`Ainda não há conta com ${longEmail}. Falta só seu nome e uma senha.`)).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('the server rejects a name longer than 80 characters', async ({ page }) => {
    await gotoHydrated(page, '/entrar')
    await createAccount(page, { name: 'M'.repeat(81), email: newEmail('longo'), password: 'senha-segura' })

    await expect(page.getByRole('alert').filter({ hasText: 'Use no máximo 80 caracteres.' })).toBeVisible()
    await expect(page).toHaveURL('/entrar')
  })

  test('creates the account, signs in and asks to confirm the email', async ({ page }) => {
    const email = newEmail('maria')
    await gotoHydrated(page, '/entrar?next=/cursos')
    await createAccount(page, { name: '  Maria   da Silva ', email, password: 'senha-da-maria' })

    await expect(page).toHaveURL('/cursos')
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('MS')
    await expect(page.getByText(`Confirme seu e-mail: mandamos um link para ${email}.`)).toBeVisible()

    const account = jsonCookie.decode((await getCookie(page, 'aulaflix_account'))!) as Record<string, unknown>
    expect(account).toMatchObject({ name: 'Maria da Silva', email, verified: false })
    expect(account.passwordHash).toMatch(/^[0-9a-f]{64}$/)
  })

  test('a new account replaces the one created before in this browser', async ({ page }) => {
    const first = newEmail('primeira')
    await gotoHydrated(page, '/entrar')
    await createAccount(page, { name: 'Primeira Conta', email: first, password: 'senha-primeira' })
    await expect(page).toHaveURL('/')
    await signOutFromMenu(page)

    await gotoHydrated(page, '/entrar')
    await createAccount(page, { name: 'Segunda Conta', email: newEmail('segunda'), password: 'senha-segunda' })
    await expect(page).toHaveURL('/')
    await signOutFromMenu(page)

    await gotoHydrated(page, '/entrar')
    await submitEmail(page, first)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Crie sua conta')
  })
})

test('journey: create an account, sign out, sign back in', async ({ page }) => {
  const email = newEmail('jornada')
  const password = 'senha-da-jornada'

  await gotoHydrated(page, '/entrar')
  await createAccount(page, { name: 'Joana Prado', email, password })
  await expect(page).toHaveURL('/')
  await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('JP')

  await signOutFromMenu(page)
  expect(await getCookie(page, 'aulaflix_session')).toBeUndefined()

  await page.getByRole('banner').getByRole('link', { name: 'Entrar' }).click()
  await expect(page).toHaveURL('/entrar')
  await submitEmail(page, email)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Que bom ver você de novo')
  await page.getByLabel('Senha', { exact: true }).fill('senha-errada')
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()
  await expect(page.getByRole('alert').filter({ hasText: 'Senha incorreta. Confira e tente de novo.' })).toBeVisible()
  await page.getByLabel('Senha', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Entrar', exact: true }).click()

  await expect(page).toHaveURL('/')
  await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('JP')
  await expect(page.getByText(`Confirme seu e-mail: mandamos um link para ${email}.`)).toBeVisible()
})

test('/cadastrar redirects to /entrar with a temporary status, keeping the query', async ({ page }) => {
  let response = await page.request.get('/cadastrar', { maxRedirects: 0 })
  expect(response.status()).toBe(307)
  expect(redirectPath(response.headers().location)).toBe('/entrar')

  response = await page.request.get('/cadastrar?next=/cursos', { maxRedirects: 0 })
  expect(response.status()).toBe(307)
  const location = new URL(response.headers().location ?? '', 'http://localhost')
  expect(location.pathname).toBe('/entrar')
  expect(location.searchParams.get('next')).toBe('/cursos')

  await page.goto('/cadastrar')
  await expect(page).toHaveURL('/entrar')
})
