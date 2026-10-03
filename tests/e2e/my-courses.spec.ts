import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { courseDetails, courseLessons, type OnSaleCourseDetail } from '../../shared/content/course-details'
import { demoAccount, expectNoHorizontalScroll, gotoHydrated, jsonCookie, setCookie, signIn } from './helpers'

const path = '/meus-cursos'

/** An account created at sign-up, stored as the reference app stores it. It starts with no courses. */
const createdAccount = {
  name: 'Maria Souza',
  email: 'maria@exemplo.com',
  passwordHash: createHash('sha256').update('senha-da-maria').digest('hex'),
  verified: true,
}

async function signInWithCreatedAccount(page: Page, purchases: string[] = []) {
  await setCookie(page, 'aulaflix_account', jsonCookie.encode(createdAccount))
  if (purchases.length > 0) {
    const orders = purchases.map((course, index) => ({
      id: `PEDIDO${index}`,
      createdAt: '2026-10-01T12:00:00.000Z',
      method: 'pix',
      status: 'paid',
      amount: 447.3,
      courses: [course],
    }))
    await setCookie(page, 'aulaflix_purchases', jsonCookie.encode({ [createdAccount.email]: orders }))
  }
  await signIn(page, createdAccount.email)
}

const publishedLessons = (slug: string) =>
  courseLessons(courseDetails[slug] as OnSaleCourseDetail).filter(entry => entry.lesson.duration).map(entry => entry.slug)

/** On /entrar with `?next=` set to this page. The port's address bar shows `next` decoded (#28). */
const onSignIn = (url: URL) => url.pathname === '/entrar' && url.searchParams.get('next') === path

const highlight = (page: Page) => page.getByRole('region', { name: 'Continuar de onde parou' })
const cards = (page: Page) => page.getByRole('main').getByRole('listitem')
const card = (page: Page, title: string) =>
  cards(page).filter({ has: page.getByRole('heading', { level: 2, name: title, exact: true }) })

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('my courses, signed out', () => {
  test('redirects to sign in, coming back here after', async ({ page }) => {
    const response = await page.request.get(path, { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(response.headers().location).toBe('/entrar?next=%2Fmeus-cursos')

    await page.goto(`${path}?aba=1`)
    await expect(page).toHaveURL(onSignIn)
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
  })

  test('a session for an unknown account is sent to sign in too', async ({ page }) => {
    await signIn(page, 'ninguem@exemplo.com')
    const response = await page.request.get(path, { maxRedirects: 0 })
    expect(response.headers().location).toBe('/entrar?next=%2Fmeus-cursos')

    await page.goto(path)
    await expect(page).toHaveURL(onSignIn)
  })

  test('a session that ended is sent to sign in when the page opens from the menu', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/')

    await page.context().clearCookies()
    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Meus cursos' }).click()

    await expect(page).toHaveURL(onSignIn)
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
  })

  // A sign-in test, so it goes through /entrar: after signing in, the page must see the new session.
  test('signing in from the redirect opens my courses', async ({ page }) => {
    await gotoHydrated(page, path)
    await page.getByLabel('E-mail').fill(demoAccount.email)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await page.getByLabel('Senha', { exact: true }).fill('aulaflix')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    await expect(page).toHaveURL(path)
    await expect(page.getByRole('heading', { level: 1, name: 'Meus cursos' })).toBeVisible()
    await expect(highlight(page)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText(demoAccount.initials)
  })
})

test.describe('my courses with the demo account', () => {
  test('shows the lesson to resume and the courses with their progress', async ({ page }) => {
    await signIn(page)
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle('Meus cursos | Aulaflix')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Os cursos que você comprou e o andamento de cada um.',
    )
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Meus cursos')

    const resume = highlight(page)
    await expect(resume.getByRole('heading', { level: 2 })).toHaveText('Continuar de onde parou')
    await expect(resume).toContainText('Tratamento de erros')
    await expect(resume).toContainText('Backend com Node.js · Aula 6 de 12')
    await expect(resume.getByRole('link', { name: 'Continuar aula' })).toHaveAttribute(
      'href',
      '/aprender/backend-com-node-js/tratamento-de-erros',
    )

    await expect(cards(page)).toHaveCount(3)
    await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveText([
      'Continuar de onde parou',
      'Backend com Node.js',
      'Frontend com React',
      'SQL e Modelagem de Dados',
    ])

    const backend = card(page, 'Backend com Node.js')
    await expect(backend).toContainText('5 de 12 aulas (42%)')
    await expect(backend.getByRole('progressbar', { name: 'Andamento em Backend com Node.js' })).toHaveAttribute('aria-valuenow', '42')
    await expect(backend.getByRole('link', { name: 'Continuar', exact: true })).toHaveAttribute(
      'href',
      '/aprender/backend-com-node-js/tratamento-de-erros',
    )

    const frontend = card(page, 'Frontend com React')
    await expect(frontend).toContainText('12 aulas, ainda não começou')
    await expect(frontend.getByRole('progressbar')).toHaveCount(0)
    await expect(frontend.getByRole('link', { name: 'Começar' })).toHaveAttribute(
      'href',
      '/aprender/frontend-com-react/pensando-em-componentes',
    )

    const sql = card(page, 'SQL e Modelagem de Dados')
    await expect(sql).toContainText('9 de 9 aulas (100%), finalizado')
    await expect(sql.getByRole('progressbar', { name: 'Andamento em SQL e Modelagem de Dados' })).toHaveAttribute('aria-valuenow', '100')
    await expect(sql.getByRole('link', { name: 'Rever aulas' })).toHaveAttribute(
      'href',
      '/aprender/sql-e-modelagem-de-dados/do-requisito-ao-modelo-de-dados',
    )

    const more = page.getByText('Mais 4 cursos chegando em breve.')
    await expect(more).toHaveText('Mais 4 cursos chegando em breve. Conhecer o catálogo')
    await expect(more.getByRole('link', { name: 'Conhecer o catálogo' })).toHaveAttribute('href', '/cursos')
  })

  test('resumes at the last lesson opened', async ({ page }) => {
    await setCookie(page, 'aulaflix_visits', jsonCookie.encode({
      [demoAccount.email]: { course: 'frontend-com-react', lessons: { 'frontend-com-react': 'estado-com-usestate' } },
    }))
    await signIn(page)
    await page.goto(path)

    const resume = highlight(page)
    await expect(resume).toContainText('Estado com useState')
    await expect(resume).toContainText('Frontend com React · Aula 4 de 12')
    await expect(resume.getByRole('link', { name: 'Continuar aula' })).toHaveAttribute(
      'href',
      '/aprender/frontend-com-react/estado-com-usestate',
    )
    // Nothing done yet, so the card still says "Começar", but it opens the lesson visited.
    await expect(card(page, 'Frontend com React').getByRole('link', { name: 'Começar' })).toHaveAttribute(
      'href',
      '/aprender/frontend-com-react/estado-com-usestate',
    )
  })

  test('a course with every published lesson done waits for new lessons, and there is nothing to resume', async ({ page }) => {
    await setCookie(page, 'aulaflix_progress', jsonCookie.encode({
      [demoAccount.email]: { 'backend-com-node-js': publishedLessons('backend-com-node-js') },
    }))
    await signIn(page)
    await page.goto(path)

    const backend = card(page, 'Backend com Node.js')
    await expect(backend).toContainText('11 de 12 aulas (92%), aguardando novas aulas')
    await expect(backend.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '92')
    await expect(backend.getByRole('link', { name: 'Rever aulas' })).toHaveAttribute(
      'href',
      '/aprender/backend-com-node-js/como-funciona-uma-requisicao-http',
    )
    await expect(highlight(page)).toHaveCount(0)
    await expect(cards(page)).toHaveCount(3)
  })

  test('the account menu opens my courses', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/')

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Meus cursos' }).click()

    await expect(page).toHaveURL(path)
    await expect(page.getByRole('heading', { level: 1, name: 'Meus cursos' })).toBeVisible()
    await expect(highlight(page)).toContainText('Tratamento de erros')
  })

  test('"Sair" leaves for the home page, signed out', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, path)

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Sair' }).click()

    await expect(page).toHaveURL('/')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Entrar' })).toBeVisible()
  })

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await signIn(page)
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await expect(highlight(page)).toBeVisible()
      await expectNoHorizontalScroll(page)
    })
  }
})

test.describe('my courses with another account', () => {
  test('an account with no courses sees the empty state', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await page.goto(path)

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Meus cursos')
    await expect(page.getByText('Nenhum curso por aqui ainda')).toBeVisible()
    await expect(page.getByText('Quando você comprar um curso, ele aparece nesta página.')).toBeVisible()
    await expect(page.getByRole('main').getByRole('link', { name: 'Ver todos os cursos' })).toHaveAttribute('href', '/cursos')
    await expect(highlight(page)).toHaveCount(0)
    await expect(cards(page)).toHaveCount(0)
    await expect(page.getByText('Conhecer o catálogo')).toHaveCount(0)
  })

  test('a course just bought hasn\'t started, and the rest of the catalog is counted', async ({ page }) => {
    await signInWithCreatedAccount(page, ['frontend-com-react'])
    await page.goto(path)

    await expect(cards(page)).toHaveCount(1)
    const frontend = card(page, 'Frontend com React')
    await expect(frontend).toContainText('12 aulas, ainda não começou')
    await expect(frontend.getByRole('link', { name: 'Começar' })).toHaveAttribute(
      'href',
      '/aprender/frontend-com-react/pensando-em-componentes',
    )
    await expect(highlight(page)).toHaveCount(0)
    await expect(page.getByText('Mais 2 cursos disponíveis.')).toHaveText(
      'Mais 2 cursos disponíveis. Mais 4 cursos chegando em breve. Conhecer o catálogo',
    )
  })

  test('one course left on sale is counted in the singular', async ({ page }) => {
    await signInWithCreatedAccount(page, ['frontend-com-react', 'backend-com-node-js'])
    await page.goto(path)

    // The cards follow the catalog order, not the order of purchase.
    await expect(page.getByRole('main').getByRole('heading', { level: 2 })).toHaveText(['Backend com Node.js', 'Frontend com React'])
    await expect(page.getByText('Mais 1 curso disponível.')).toHaveText(
      'Mais 1 curso disponível. Mais 4 cursos chegando em breve. Conhecer o catálogo',
    )
  })

  for (const width of [1440, 390]) {
    test(`the empty state has no horizontal scroll at ${width}px`, async ({ page }) => {
      await signInWithCreatedAccount(page)
      await page.setViewportSize({ width, height: 900 })
      await page.goto(path)
      await expect(page.getByText('Nenhum curso por aqui ainda')).toBeVisible()
      await expectNoHorizontalScroll(page)
    })
  }
})
