import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, gotoHydrated } from './helpers'

const cards = [
  { slug: 'backend-com-node-js', area: 'Backend', title: 'Backend com Node.js', size: '12 aulas', status: 'R$ 497' },
  { slug: 'frontend-com-react', area: 'Frontend', title: 'Frontend com React', size: '12 aulas', status: 'R$ 597' },
  { slug: 'sql-e-modelagem-de-dados', area: 'Banco de dados', title: 'SQL e Modelagem de Dados', size: '9 aulas', status: 'R$ 397' },
  { slug: 'devops-na-pratica', area: 'DevOps', title: 'DevOps na Prática', size: '6 tópicos previstos', status: 'Em breve' },
  { slug: 'ia-para-desenvolvedores', area: 'IA', title: 'IA para Desenvolvedores', size: '6 tópicos previstos', status: 'Em breve' },
  { slug: 'testes-automatizados', area: 'Qualidade', title: 'Testes Automatizados', size: '6 tópicos previstos', status: 'Em breve' },
  { slug: 'arquitetura-de-software', area: 'Arquitetura', title: 'Arquitetura de Software', size: '6 tópicos previstos', status: 'Em breve' },
]
const onSale = cards.slice(0, 3)
const waitlist = cards.slice(3)

const courseList = (page: Page) => page.getByRole('list', { name: 'Cursos' })
const filterGroup = (page: Page, label: 'Área' | 'Situação') =>
  page.getByRole('navigation', { name: 'Filtrar cursos' }).getByRole('list', { name: label })

// Scoped to <main>, because Nuxt's route announcer is a status region too (#18).
const resultCount = (page: Page) => page.getByRole('main').getByRole('status')

async function expectTitles(page: Page, titles: string[]) {
  await expect(courseList(page).getByRole('heading', { level: 3 })).toHaveText(titles)
  await expect(resultCount(page)).toHaveText(titles.length === 1 ? '1 curso' : `${titles.length} cursos`)
}

test.describe('course catalog', () => {
  test('lists every course as a card', async ({ page }) => {
    await page.goto('/cursos')

    await expect(page).toHaveTitle('Cursos | Aulaflix')
    await expect(page.getByRole('heading', { level: 1, name: 'Todos os cursos' })).toBeVisible()
    await expect(
      page.getByText('Conheça os cursos do Aulaflix: os que já estão à venda e os que estão chegando.'),
    ).toBeVisible()
    await expectTitles(page, cards.map(card => card.title))

    const links = courseList(page).getByRole('link')
    for (const [index, card] of cards.entries()) {
      const link = links.nth(index)
      await expect(link).toHaveAttribute('href', `/cursos/${card.slug}`)
      const paragraphs = link.locator('p')
      await expect(paragraphs.first()).toHaveText(card.area)
      await expect(paragraphs.last().locator('span')).toHaveText([card.size, card.status])
    }
    await expect(links.first()).toContainText(
      'Construa APIs REST com Node.js e TypeScript: rotas, validação, banco de dados, autenticação e testes, até colocar o serviço no ar.',
    )
  })

  test('cards are ruled, with a solid stripe on sale and a dashed one on the waitlist', async ({ page }) => {
    await page.goto('/cursos')
    const links = courseList(page).getByRole('link')

    for (const [index, card] of cards.entries()) {
      const link = links.nth(index)
      const stripe = link.locator('span[aria-hidden="true"]').first()
      if (waitlist.includes(card)) {
        await expect(stripe).toHaveCSS('background-image', /repeating-linear-gradient/)
      }
      else {
        await expect(stripe).toHaveCSS('background-image', 'none')
      }
      await expect(link.locator('div').first()).toHaveCSS('background-image', /repeating-linear-gradient/)
    }
  })

  test('shows the area and status filters, with "Todas" selected', async ({ page }) => {
    await page.goto('/cursos')

    const areas = filterGroup(page, 'Área').getByRole('link')
    await expect(areas).toHaveText(['Todas', 'Backend', 'Frontend', 'Banco de dados', 'DevOps', 'IA', 'Qualidade', 'Arquitetura'])
    await expect(areas.nth(0)).toHaveAttribute('href', '/cursos')
    await expect(areas.nth(3)).toHaveAttribute('href', '/cursos?area=banco-de-dados')

    const statuses = filterGroup(page, 'Situação').getByRole('link')
    await expect(statuses).toHaveText(['Todas', 'À venda', 'Em breve'])
    await expect(statuses.nth(1)).toHaveAttribute('href', '/cursos?situacao=a-venda')
    await expect(statuses.nth(2)).toHaveAttribute('href', '/cursos?situacao=em-breve')

    for (const label of ['Área', 'Situação'] as const) {
      const current = filterGroup(page, label).locator('a[aria-current]')
      await expect(current).toHaveCount(1)
      await expect(current).toHaveText('Todas')
      await expect(current).toHaveAttribute('aria-current', 'true')
    }
  })

  test('?area= filters by area and keeps the status in the links', async ({ page }) => {
    await page.goto('/cursos?area=backend')

    await expectTitles(page, ['Backend com Node.js'])
    await expect(filterGroup(page, 'Área').getByRole('link', { name: 'Backend' })).toHaveAttribute('aria-current', 'true')
    await expect(filterGroup(page, 'Área').getByRole('link', { name: 'Todas' })).not.toHaveAttribute('aria-current')
    await expect(filterGroup(page, 'Situação').getByRole('link', { name: 'Em breve' })).toHaveAttribute(
      'href',
      '/cursos?area=backend&situacao=em-breve',
    )
  })

  test('?situacao= filters by status', async ({ page }) => {
    await page.goto('/cursos?situacao=a-venda')
    await expectTitles(page, onSale.map(card => card.title))
    await expect(filterGroup(page, 'Situação').getByRole('link', { name: 'À venda' })).toHaveAttribute('aria-current', 'true')

    await page.goto('/cursos?situacao=em-breve')
    await expectTitles(page, waitlist.map(card => card.title))
  })

  test('area and status combine', async ({ page }) => {
    await page.goto('/cursos?area=qualidade&situacao=em-breve')
    await expectTitles(page, ['Testes Automatizados'])
    await expect(filterGroup(page, 'Área').getByRole('link', { name: 'Todas' })).toHaveAttribute(
      'href',
      '/cursos?situacao=em-breve',
    )
  })

  test('unknown or repeated filter values count as "Todas"', async ({ page }) => {
    await page.goto('/cursos?area=culinaria&situacao=esgotado')
    await expectTitles(page, cards.map(card => card.title))

    await page.goto('/cursos?area=backend&area=frontend')
    await expectTitles(page, cards.map(card => card.title))
  })

  test('a filter with no results shows the empty state', async ({ page }) => {
    await page.goto('/cursos?area=devops&situacao=a-venda')

    await expect(resultCount(page)).toHaveText('0 cursos')
    await expect(courseList(page)).toHaveCount(0)
    await expect(page.getByText('Nenhum curso por aqui ainda.')).toBeVisible()
    await expect(page.getByText('Ainda não há cursos de DevOps à venda.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Ver todos os cursos de DevOps' })).toHaveAttribute(
      'href',
      '/cursos?area=devops',
    )
  })

  test('the empty state link shows every course of the area', async ({ page }) => {
    await gotoHydrated(page, '/cursos?area=devops&situacao=a-venda')
    await page.getByRole('link', { name: 'Ver todos os cursos de DevOps' }).click()

    await expect(page).toHaveURL('/cursos?area=devops')
    await expectTitles(page, ['DevOps na Prática'])
  })

  test('a card leads to its course page', async ({ page }) => {
    await gotoHydrated(page, '/cursos')
    await courseList(page).getByRole('link', { name: /SQL e Modelagem de Dados/ }).click()
    await expect(page).toHaveURL('/cursos/sql-e-modelagem-de-dados')
  })
})

test.describe('course catalog on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  test('choosing a filter updates the grid without scrolling to the top', async ({ page }) => {
    await gotoHydrated(page, '/cursos')
    const filter = filterGroup(page, 'Situação').getByRole('link', { name: 'Em breve' })
    await page.mouse.wheel(0, 400)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
    const before = await page.evaluate(() => window.scrollY)

    await filter.click()
    await expect(page).toHaveURL('/cursos?situacao=em-breve')
    await expectTitles(page, waitlist.map(card => card.title))
    expect(await page.evaluate(() => window.scrollY)).toBe(before)
  })

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/cursos')
    await expectNoHorizontalScroll(page)
    await page.goto('/cursos?area=devops&situacao=a-venda')
    await expectNoHorizontalScroll(page)
  })
})

test.describe('course catalog on desktop', () => {
  test.use({ viewport: { width: 1440, height: 900 } })

  test('has no horizontal scroll', async ({ page }) => {
    await page.goto('/cursos')
    await expectNoHorizontalScroll(page)
  })
})
