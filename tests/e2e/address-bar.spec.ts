import { expect, test } from '@playwright/test'
import { gotoHydrated } from './helpers'

// The address bar after the page hydrates: the reference app leaves the URL as the browser got it, encoded or not.
test.describe('address bar', () => {
  for (const url of ['/entrar?next=%2Fcursos', '/entrar?next=/cursos', '/cursos?area=backend&x=%2Fy']) {
    test(`keeps ${url} as it was opened`, async ({ page }) => {
      await gotoHydrated(page, url)
      await expect(page).toHaveURL(url)
    })
  }

  test('keeps next encoded after the /cadastrar redirect', async ({ page }) => {
    await gotoHydrated(page, '/cadastrar?next=/cursos')
    await expect(page).toHaveURL('/entrar?next=%2Fcursos')
  })

  test('keeps next encoded after a signed-out page redirects to sign in', async ({ page }) => {
    await gotoHydrated(page, '/meus-cursos')
    await expect(page).toHaveURL('/entrar?next=%2Fmeus-cursos')
  })
})
