import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import {
  demoAccount,
  expectNoHorizontalScroll,
  getCookie,
  gotoHydrated,
  jsonCookie,
  setCookie,
  signIn,
} from './helpers'

// Every route has the shell; an unknown URL is the one page both apps have until the routes are ported.
const shellPath = '/esta-pagina-nao-existe'

/** An account created at sign-up whose email isn't confirmed yet, stored as the reference app stores it. */
const createdAccount = {
  name: 'Maria Souza',
  email: 'maria@exemplo.com',
  passwordHash: createHash('sha256').update('senha-da-maria').digest('hex'),
  verified: false,
}

async function signInWithCreatedAccount(page: Page) {
  await setCookie(page, 'aulaflix_account', jsonCookie.encode(createdAccount))
  await signIn(page, createdAccount.email)
}

/** Marks the current document, so a test can tell a client-side update from a full reload. */
async function markDocument(page: Page) {
  await page.evaluate(() => {
    (window as Window & { notReloaded?: boolean }).notReloaded = true
  })
}

async function expectSameDocument(page: Page) {
  expect(await page.evaluate(() => (window as Window & { notReloaded?: boolean }).notReloaded)).toBe(true)
}

test.describe('signed-in header on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('shows the student instead of "Entrar"', async ({ page }) => {
    await signIn(page)
    await page.goto(shellPath)
    const header = page.getByRole('banner')

    const menuButton = header.getByRole('button', { name: 'Abrir menu do usuário' })
    await expect(menuButton).toHaveText(demoAccount.initials)
    await expect(menuButton).toHaveAttribute('aria-haspopup', 'menu')
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(header.getByRole('link', { name: 'Entrar' })).toHaveCount(0)
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expectNoHorizontalScroll(page)
  })

  test('the account menu shows the name, the email, Meus cursos, Conta and Sair', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)

    const menuButton = page.getByRole('button', { name: 'Abrir menu do usuário' })
    await menuButton.click()
    await expect(menuButton).toHaveAttribute('aria-expanded', 'true')

    const menu = page.getByRole('menu', { name: 'Menu do usuário' })
    await expect(menu.getByText(demoAccount.name, { exact: true })).toBeVisible()
    await expect(menu.getByText(demoAccount.email, { exact: true })).toBeVisible()
    await expect(menu.getByRole('menuitem')).toHaveText(['Meus cursos', 'Conta', 'Sair'])
    await expect(menu.getByRole('menuitem', { name: 'Meus cursos' })).toHaveAttribute('href', '/meus-cursos')
    await expect(menu.getByRole('menuitem', { name: 'Conta' })).toHaveAttribute('href', '/conta')
    await expectNoHorizontalScroll(page)
  })

  test('Escape closes the account menu and returns focus to its button', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)

    const menuButton = page.getByRole('button', { name: 'Abrir menu do usuário' })
    await menuButton.focus()
    await page.keyboard.press('Enter')
    await expect(page.getByRole('menu')).toBeVisible()

    await page.keyboard.press('Escape')
    await expect(page.getByRole('menu')).toHaveCount(0)
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton).toBeFocused()
  })

  test('clicking outside closes the account menu', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await expect(page.getByRole('menu')).toBeVisible()
    await page.getByRole('main').click()
    await expect(page.getByRole('menu')).toHaveCount(0)
  })

  test('following a link in the account menu closes it', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Conta' }).click()
    await expect(page).toHaveURL('/conta')
    await expect(page.getByRole('menu')).toHaveCount(0)
  })

  test('Sair ends the session and the header returns to signed out without a reload', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)
    await markDocument(page)

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Sair' }).click()

    await expect(page).toHaveURL('/')
    const header = page.getByRole('banner')
    await expect(header.getByRole('link', { name: 'Entrar' })).toBeVisible()
    await expect(header.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveCount(0)
    expect(await getCookie(page, 'aulaflix_session')).toBeUndefined()
    await expectSameDocument(page)
  })

  test('shows the name the student saved in Conta', async ({ page }) => {
    await setCookie(page, 'aulaflix_name', encodeURIComponent('Joana Lima Prado'))
    await signIn(page)
    await gotoHydrated(page, shellPath)

    const menuButton = page.getByRole('button', { name: 'Abrir menu do usuário' })
    await expect(menuButton).toHaveText('JP')
    await menuButton.click()
    await expect(page.getByRole('menu').getByText('Joana Lima Prado', { exact: true })).toBeVisible()
  })

  test('a session cookie for an unknown account shows the signed-out header', async ({ page }) => {
    await signIn(page, 'ninguem@exemplo.com')
    await page.goto(shellPath)

    await expect(page.getByRole('banner').getByRole('link', { name: 'Entrar' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveCount(0)
  })
})

test.describe('signed-in header on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('the mobile menu adds the account links and the student panel', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)
    const header = page.getByRole('banner')

    await expect(header.getByRole('button', { name: 'Abrir menu do usuário' })).toBeHidden()
    await header.getByRole('button', { name: 'Abrir menu' }).click()

    const menu = page.locator('#mobile-menu')
    const nav = menu.getByRole('navigation', { name: 'Principal (mobile)' })
    await expect(nav.getByRole('link')).toHaveText(['Cursos', 'Como funciona', 'Meus cursos', 'Conta'])
    await expect(nav.getByRole('link', { name: 'Meus cursos' })).toHaveAttribute('href', '/meus-cursos')
    await expect(nav.getByRole('link', { name: 'Conta' })).toHaveAttribute('href', '/conta')

    await expect(menu.getByText(demoAccount.name, { exact: true })).toBeVisible()
    await expect(menu.getByText(demoAccount.email, { exact: true })).toBeVisible()
    await expect(menu.getByRole('button', { name: 'Sair' })).toBeVisible()
    await expect(menu.getByRole('link', { name: 'Entrar' })).toHaveCount(0)
    await expectNoHorizontalScroll(page)
  })

  test('Sair in the mobile menu ends the session without a reload', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, shellPath)
    await markDocument(page)
    const header = page.getByRole('banner')

    await header.getByRole('button', { name: 'Abrir menu' }).click()
    await page.locator('#mobile-menu').getByRole('button', { name: 'Sair' }).click()

    await expect(page).toHaveURL('/')
    await header.getByRole('button', { name: 'Abrir menu' }).click()
    await expect(page.locator('#mobile-menu').getByRole('link', { name: 'Entrar' })).toBeVisible()
    expect(await getCookie(page, 'aulaflix_session')).toBeUndefined()
    await expectSameDocument(page)
  })
})

test.describe('email confirmation notice', () => {
  test('is not shown for an account with a confirmed email', async ({ page }) => {
    await signIn(page)
    await page.goto(shellPath)

    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toBeVisible()
    await expect(page.getByText('Confirme seu e-mail')).toHaveCount(0)
  })

  test('asks a created account to confirm its email', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await page.goto(shellPath)

    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('MS')
    const notice = page.getByText(`Confirme seu e-mail: mandamos um link para ${createdAccount.email}.`)
    await expect(notice).toBeVisible()
    await expect(notice.locator('strong')).toHaveText(createdAccount.email)
    await expect(page.getByRole('button', { name: 'Reenviar link' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Protótipo: simular o clique no link' })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })

  test('"Reenviar link" says the link was sent again', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, shellPath)

    await page.getByRole('button', { name: 'Reenviar link' }).click()
    // Scoped to the text, because the Nuxt dev server adds a status region of its own.
    await expect(page.getByRole('status').filter({ hasText: 'Link reenviado.' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Reenviar link' })).toHaveCount(0)
  })

  test('confirming the email hides the notice without a reload', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, shellPath)
    await markDocument(page)

    await page.getByRole('button', { name: 'Protótipo: simular o clique no link' }).click()

    await expect(page.getByText('Confirme seu e-mail')).toHaveCount(0)
    await expectSameDocument(page)
    const account = await getCookie(page, 'aulaflix_account')
    expect(jsonCookie.decode(account!)).toEqual({ ...createdAccount, verified: true })

    await page.reload()
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toBeVisible()
    await expect(page.getByText('Confirme seu e-mail')).toHaveCount(0)
  })
})
