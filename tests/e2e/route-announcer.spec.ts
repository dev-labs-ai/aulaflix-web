import { expect, test, type Page } from '@playwright/test'
import { gotoHydrated } from './helpers'

/**
 * The reference app gets its route announcer from Next's App Router, in a shadow root at the end of <body>, which
 * Playwright's locators reach into. The pages used here have no other alert.
 */
const announcer = (page: Page) => page.getByRole('alert')

async function expectQuietAnnouncer(page: Page) {
  await expect(announcer(page)).toHaveCount(1)
  await expect(announcer(page)).toHaveAttribute('aria-live', 'assertive')
  await expect(announcer(page)).toBeEmpty()
}

const mainNavLink = (page: Page, name: 'Cursos' | 'Como funciona') =>
  page.getByRole('navigation', { name: 'Principal', exact: true }).getByRole('link', { name })

test.describe('route announcer', () => {
  test('is empty on first load', async ({ page }) => {
    await gotoHydrated(page, '/')
    await expectQuietAnnouncer(page)
  })

  // The page's title, not its h1 ("Todos os cursos"): the h1 is read only when the document has no title.
  test('announces the new page\'s title after each client-side navigation', async ({ page }) => {
    await gotoHydrated(page, '/')

    await mainNavLink(page, 'Cursos').click()
    await expect(page).toHaveURL('/cursos')
    await expect(announcer(page)).toHaveText('Cursos | Aulaflix')

    await mainNavLink(page, 'Como funciona').click()
    await expect(page).toHaveURL('/como-funciona')
    await expect(announcer(page)).toHaveText('Como funciona | Aulaflix')

    await page.goBack()
    await expect(page).toHaveURL('/cursos')
    await expect(announcer(page)).toHaveText('Cursos | Aulaflix')

    await page.goBack()
    await expect(page).toHaveURL('/')
    await expect(announcer(page)).toHaveText('Aulaflix — Cursos online para desenvolvedores de software')
  })

  test('stays quiet when a navigation keeps the title', async ({ page }) => {
    await gotoHydrated(page, '/cursos')

    await page.getByRole('navigation', { name: 'Filtrar cursos' }).getByRole('link', { name: 'Backend' }).click()
    await expect(page).toHaveURL('/cursos?area=backend')
    await expect(page.getByRole('list', { name: 'Cursos' }).getByRole('heading', { level: 3 })).toHaveText([
      'Backend com Node.js',
    ])
    await expectQuietAnnouncer(page)
  })

  test('is on the 404 page too, and announces the page it leads to', async ({ page }) => {
    const response = await gotoHydrated(page, '/esta-pagina-nao-existe')
    expect(response?.status()).toBe(404)
    await expectQuietAnnouncer(page)

    await page.getByRole('main').getByRole('link', { name: 'Ver todos os cursos' }).click()
    await expect(page).toHaveURL('/cursos')
    await expect(announcer(page)).toHaveText('Cursos | Aulaflix')
  })
})
