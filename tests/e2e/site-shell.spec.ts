import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, gotoHydrated } from './helpers'

// Every route has the shell; an unknown URL is the one page both apps have until the routes are ported.
const shellPath = '/esta-pagina-nao-existe'

test.describe('signed-out header on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('shows the logo, the main nav and "Entrar"', async ({ page }) => {
    await page.goto(shellPath)
    const header = page.getByRole('banner')

    await expect(header).toHaveCSS('position', 'sticky')
    await expect(header.getByRole('link', { name: 'Aulaflix, página inicial' })).toHaveAttribute('href', '/')

    const nav = header.getByRole('navigation', { name: 'Principal', exact: true })
    await expect(nav.getByRole('link')).toHaveText(['Cursos', 'Como funciona'])
    await expect(nav.getByRole('link', { name: 'Cursos' })).toHaveAttribute('href', '/cursos')
    await expect(nav.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/como-funciona')

    await expect(header.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/entrar')
    await expect(header.getByRole('button', { name: 'Abrir menu' })).toBeHidden()
    await expectNoHorizontalScroll(page)
  })

  test('the logo leads to the home page', async ({ page }) => {
    await page.goto(shellPath)
    await page.getByRole('banner').getByRole('link', { name: 'Aulaflix, página inicial' }).click()
    await expect(page).toHaveURL('/')
  })

  test('"Entrar" leads to the sign-in page', async ({ page }) => {
    await page.goto(shellPath)
    await page.getByRole('banner').getByRole('link', { name: 'Entrar' }).click()
    await expect(page).toHaveURL('/entrar')
  })

  // The reference app doesn't highlight the nav item of the current page, nor mark it with aria-current.
  for (const path of ['/cursos', '/como-funciona']) {
    test(`no nav item is marked as current on ${path}`, async ({ page }) => {
      await page.goto(path)
      const links = page.getByRole('navigation', { name: 'Principal', exact: true }).getByRole('link')
      await expect(links).toHaveCount(2)
      for (const link of await links.all()) {
        await expect(link).not.toHaveAttribute('aria-current')
        await expect(link).toHaveCSS('color', 'rgb(42, 56, 48)')
      }
    })
  }
})

test.describe('signed-out header on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('hides the nav behind a menu button', async ({ page }) => {
    await page.goto(shellPath)
    const header = page.getByRole('banner')

    await expect(header.getByRole('navigation', { name: 'Principal', exact: true })).toBeHidden()
    await expect(header.getByRole('link', { name: 'Entrar' })).toBeHidden()

    const menuButton = header.getByRole('button', { name: 'Abrir menu' })
    await expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    await expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu')
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
    await expectNoHorizontalScroll(page)
  })

  test('the menu button opens and closes the mobile menu', async ({ page }) => {
    await gotoHydrated(page, shellPath)
    const header = page.getByRole('banner')

    await header.getByRole('button', { name: 'Abrir menu' }).click()
    const closeButton = header.getByRole('button', { name: 'Fechar menu' })
    await expect(closeButton).toHaveAttribute('aria-expanded', 'true')

    const menu = page.locator('#mobile-menu')
    const nav = menu.getByRole('navigation', { name: 'Principal (mobile)' })
    await expect(nav.getByRole('link')).toHaveText(['Cursos', 'Como funciona'])
    await expect(nav.getByRole('link', { name: 'Cursos' })).toHaveAttribute('href', '/cursos')
    await expect(nav.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/como-funciona')
    await expect(menu.getByRole('link', { name: 'Entrar' })).toHaveAttribute('href', '/entrar')
    await expectNoHorizontalScroll(page)

    await closeButton.click()
    await expect(header.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
    await expect(menu).toHaveCount(0)
  })

  test('following a link in the mobile menu closes it', async ({ page }) => {
    await gotoHydrated(page, shellPath)
    const header = page.getByRole('banner')

    await header.getByRole('button', { name: 'Abrir menu' }).click()
    await page.locator('#mobile-menu').getByRole('link', { name: 'Cursos' }).click()

    await expect(page).toHaveURL('/cursos')
    await expect(header.getByRole('button', { name: 'Abrir menu' })).toHaveAttribute('aria-expanded', 'false')
    await expect(page.locator('#mobile-menu')).toHaveCount(0)
  })
})

test.describe('footer', () => {
  test('shows the copyright and the legal name', async ({ page }) => {
    await page.goto(shellPath)
    const footer = page.getByRole('contentinfo')

    await expect(footer.getByText(`© ${new Date().getFullYear()} Aulaflix`)).toBeVisible()
    await expect(footer.getByText('AULAFLIX TECNOLOGIA LTDA')).toBeVisible()
    await expect(footer).toHaveCSS('background-color', 'rgb(238, 241, 234)')
  })
})

test.describe('visual identity', () => {
  test('uses the paper and graphite colours and the chalkboard green', async ({ page }) => {
    await page.goto(shellPath)

    await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(246, 247, 243)')
    await expect(page.locator('body')).toHaveCSS('color', 'rgb(31, 42, 36)')

    const signIn = page.getByRole('banner').getByRole('link', { name: 'Entrar' })
    await expect(signIn).toHaveCSS('background-color', 'rgb(34, 57, 46)')
    await expect(signIn).toHaveCSS('color', 'rgb(241, 243, 238)')
  })

  test('loads Bricolage Grotesque for headings and Atkinson Hyperlegible Next for text', async ({ page }) => {
    await page.goto(shellPath)

    await expect(page.getByRole('heading', { level: 1 })).toHaveCSS('font-family', /^"Bricolage Grotesque"/)
    await expect(page.locator('body')).toHaveCSS('font-family', /^"Atkinson Hyperlegible Next"/)

    const loaded = await page.evaluate(async () => {
      await document.fonts.ready
      return [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family.replaceAll('"', ''))
    })
    expect(loaded).toContain('Bricolage Grotesque')
    expect(loaded).toContain('Atkinson Hyperlegible Next')
  })

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`chalk animations with reduced motion set to ${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion })
      await page.goto(shellPath)

      const animations = await page.evaluate(() =>
        ['anim-giz', 'anim-surge'].map((className) => {
          const element = document.createElement('div')
          element.className = className
          document.body.append(element)
          const { animationName } = getComputedStyle(element)
          element.remove()
          return animationName
        }),
      )
      expect(animations).toEqual(reducedMotion === 'reduce' ? ['none', 'none'] : ['giz-escrita', 'giz-surge'])
    })
  }
})
