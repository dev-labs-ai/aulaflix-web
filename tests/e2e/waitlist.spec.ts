import { expect, test, type Locator, type Page } from '@playwright/test'
import { demoAccount, expectNoHorizontalScroll, getCookie, gotoHydrated, jsonCookie, setCookie, signIn } from './helpers'

const slug = 'devops-na-pratica'
const coursePath = `/cursos/${slug}`

const intro = {
  signedOut: 'O curso ainda está em produção. Deixe seu e-mail e avisamos quando as inscrições abrirem.',
  signedIn: (email: string) =>
    `O curso ainda está em produção. Com um clique, avisamos em ${email} quando as inscrições abrirem.`,
}
const confirmation = (email: string) => `Pronto! Vamos avisar em ${email} quando as inscrições abrirem.`

const joinButton = (page: Page) => page.getByRole('button', { name: 'Avise-me' })
const leaveButton = (page: Page) => page.getByRole('button', { name: 'Não quero mais ser avisado' })
/** The confirmation's wrapper, which carries the rise animation. */
const confirmed = (page: Page) => page.locator('p', { hasText: 'Pronto!' }).locator('..')

/** The waitlist cookie, decoded: email → course slugs. */
async function waitlistCookie(page: Page) {
  const raw = await getCookie(page, 'aulaflix_waitlist')
  return raw === undefined ? undefined : jsonCookie.decode(raw)
}

const animationName = (locator: Locator) => locator.evaluate(element => getComputedStyle(element).animationName)

test.describe('waitlist signed out', () => {
  test('asks only for the email, and offers signing in for one-click sign-up', async ({ page }) => {
    await page.goto(coursePath)

    await expect(page.getByText(intro.signedOut)).toBeVisible()
    const email = page.getByLabel('E-mail')
    await expect(email).toHaveAttribute('type', 'email')
    await expect(email).toHaveAttribute('placeholder', 'seu@email.com')
    await expect(email).toHaveAttribute('autocomplete', 'email')
    await expect(joinButton(page)).toBeVisible()

    await expect(page.getByText('Já tem conta? Entre e seja avisado com um clique.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Entre', exact: true })).toHaveAttribute('href', `/entrar?next=${coursePath}`)
  })

  test('validates the email on the server and clears the field after each try', async ({ page }) => {
    await gotoHydrated(page, coursePath)
    const email = page.getByLabel('E-mail')

    await joinButton(page).click()
    await expect(page.getByText('Digite seu e-mail.')).toBeVisible()
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription('Digite seu e-mail.')

    await email.fill('maria@')
    await joinButton(page).click()
    await expect(page.getByText('Esse e-mail não parece válido.')).toBeVisible()
    await expect(page.getByText('Digite seu e-mail.')).toHaveCount(0)
    await expect(email).toHaveValue('')
    await expect(email).toHaveAttribute('aria-invalid', 'true')

    expect(await waitlistCookie(page)).toBeUndefined()
  })

  test('joins with the email and shows the confirmation', async ({ page }) => {
    await gotoHydrated(page, coursePath)

    await page.getByLabel('E-mail').fill('  Maria@Exemplo.com ')
    await joinButton(page).click()

    // The confirmation shows the email as typed, trimmed; the store keys it in lowercase.
    await expect(page.getByText(confirmation('Maria@Exemplo.com'))).toBeVisible()
    await expect(page.getByLabel('E-mail')).toHaveCount(0)
    await expect(joinButton(page)).toHaveCount(0)
    await expect(leaveButton(page)).toHaveCount(0)
    await expect(page.getByText('Já tem conta?')).toHaveCount(0)
    expect(await waitlistCookie(page)).toEqual({ 'maria@exemplo.com': [slug] })
  })

  test('keeps the other sign-ups in the store', async ({ page }) => {
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ 'joao@exemplo.com': ['ia-para-desenvolvedores'] }))
    await gotoHydrated(page, coursePath)

    await page.getByLabel('E-mail').fill('joao@exemplo.com')
    await joinButton(page).click()

    await expect(page.getByText(confirmation('joao@exemplo.com'))).toBeVisible()
    expect(await waitlistCookie(page)).toEqual({ 'joao@exemplo.com': ['ia-para-desenvolvedores', slug] })
  })

  test('a long email wraps without horizontal scroll on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await gotoHydrated(page, coursePath)

    const email = 'uma.pessoa.com.um.endereco.de.email.bem.comprido@exemplo-de-dominio.com.br'
    await page.getByLabel('E-mail').fill(email)
    await joinButton(page).click()

    await expect(page.getByText(confirmation(email))).toBeVisible()
    await expectNoHorizontalScroll(page)
  })
})

test.describe('waitlist signed in', () => {
  test('joins with one click on "Avise-me", using the account email', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, coursePath)

    await expect(page.getByText(intro.signedIn(demoAccount.email))).toBeVisible()
    await expect(page.getByLabel('E-mail')).toHaveCount(0)
    await expect(page.getByText('Já tem conta?')).toHaveCount(0)

    await joinButton(page).click()
    await expect(page.getByText(confirmation(demoAccount.email))).toBeVisible()
    await expect(leaveButton(page)).toBeVisible()
    await expect(joinButton(page)).toHaveCount(0)
    expect(await waitlistCookie(page)).toEqual({ [demoAccount.email]: [slug] })
  })

  test('shows the joined state for a student already on the list', async ({ page }) => {
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
    await signIn(page)
    await page.goto(coursePath)

    await expect(page.getByText(confirmation(demoAccount.email))).toBeVisible()
    await expect(leaveButton(page)).toBeVisible()
  })

  test('an email joined while signed out counts for the account with that email', async ({ page }) => {
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
    await signIn(page)
    await page.goto('/cursos/ia-para-desenvolvedores')

    // Only the course the email joined.
    await expect(page.getByText(intro.signedIn(demoAccount.email))).toBeVisible()
    await expect(joinButton(page)).toBeVisible()
  })

  test('leaving returns to the initial state', async ({ page }) => {
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
    await signIn(page)
    await gotoHydrated(page, coursePath)

    await leaveButton(page).click()
    await expect(page.getByText(intro.signedIn(demoAccount.email))).toBeVisible()
    await expect(joinButton(page)).toBeVisible()
    await expect(leaveButton(page)).toHaveCount(0)
    expect(await waitlistCookie(page)).toEqual({ [demoAccount.email]: [] })
  })

  test('a session that ended after the page loaded is sent to sign in', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, coursePath)

    await page.context().clearCookies()
    await joinButton(page).click()

    await expect(page).toHaveURL(`/entrar?next=${encodeURIComponent(coursePath)}`)
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
    expect(await waitlistCookie(page)).toBeUndefined()
  })

  for (const width of [1440, 390]) {
    test(`the joined state has no horizontal scroll at ${width}px`, async ({ page }) => {
      await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
      await signIn(page)
      await page.setViewportSize({ width, height: 900 })
      await page.goto(coursePath)

      await expect(leaveButton(page)).toBeVisible()
      await expectNoHorizontalScroll(page)
    })
  }
})

test.describe('waitlist confirmation animation', () => {
  test('the confirmation rises in and the check is drawn', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
    await signIn(page)
    await page.goto(coursePath)

    await expect(leaveButton(page)).toBeVisible()
    expect(await animationName(confirmed(page))).not.toBe('none')
    expect(await animationName(confirmed(page).locator('svg path'))).not.toBe('none')
  })

  test('respects reduced motion', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await setCookie(page, 'aulaflix_waitlist', jsonCookie.encode({ [demoAccount.email]: [slug] }))
    await signIn(page)
    await page.goto(coursePath)

    await expect(leaveButton(page)).toBeVisible()
    expect(await animationName(confirmed(page))).toBe('none')
    expect(await animationName(confirmed(page).locator('svg path'))).toBe('none')
    // The check and the underline under the email are drawn from the start.
    expect(await confirmed(page).locator('svg path').evaluate(path => getComputedStyle(path).strokeDashoffset)).toBe('0px')
    expect(
      await confirmed(page)
        .getByText(demoAccount.email, { exact: true })
        .evaluate(email => getComputedStyle(email, '::after').transform),
    ).toBe('matrix(1, 0, 0, 1, 0, 0)')
  })
})

test.describe('waitlist journeys', () => {
  test('signed out: a visitor joins with an email, and the form comes back on the next visit', async ({ page }) => {
    await gotoHydrated(page, coursePath)

    await page.getByLabel('E-mail').fill('ana@exemplo.com')
    await joinButton(page).click()
    await expect(page.getByText(confirmation('ana@exemplo.com'))).toBeVisible()

    // Signed out, the page doesn't know who the visitor is.
    await gotoHydrated(page, coursePath)
    await expect(page.getByText(intro.signedOut)).toBeVisible()

    await page.getByLabel('E-mail').fill('ana@exemplo.com')
    await joinButton(page).click()
    await expect(page.getByText(confirmation('ana@exemplo.com'))).toBeVisible()
    expect(await waitlistCookie(page)).toEqual({ 'ana@exemplo.com': [slug] })
  })

  test('signed in: a student joins with one click, keeps it after a reload, then leaves', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, coursePath)

    await joinButton(page).click()
    await expect(leaveButton(page)).toBeVisible()

    await gotoHydrated(page, coursePath)
    await expect(page.getByText(confirmation(demoAccount.email))).toBeVisible()

    await leaveButton(page).click()
    await expect(joinButton(page)).toBeVisible()

    await page.reload()
    await expect(page.getByText(intro.signedIn(demoAccount.email))).toBeVisible()
    await expect(joinButton(page)).toBeVisible()
  })
})
