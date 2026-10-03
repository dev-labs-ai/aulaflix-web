import { expect, test, type Page } from '@playwright/test'
import { courseDetails, courseLessons, getFreeLesson, type OnSaleCourseDetail } from '../../shared/content/course-details'
import { getCourse } from '../../shared/content/courses'
import { expectNoHorizontalScroll, gotoHydrated, signIn } from './helpers'

// The board's figures, as the reference app shows them.
const onSale = [
  { slug: 'backend-com-node-js', price: 'R$ 497', installments: '10x de R$ 49,70 sem juros', pix: 'ou R$ 447,30 no Pix' },
  { slug: 'frontend-com-react', price: 'R$ 597', installments: '10x de R$ 59,70 sem juros', pix: 'ou R$ 537,30 no Pix' },
  { slug: 'sql-e-modelagem-de-dados', price: 'R$ 397', installments: '10x de R$ 39,70 sem juros', pix: 'ou R$ 357,30 no Pix' },
]
const waitlistSlugs = ['devops-na-pratica', 'ia-para-desenvolvedores', 'testes-automatizados', 'arquitetura-de-software']

const course = (slug: string) => getCourse(slug)!
const onSaleDetail = (slug: string) => courseDetails[slug] as OnSaleCourseDetail
const section = (page: Page, title: string) =>
  page.locator('section').filter({ has: page.getByRole('heading', { level: 2, name: title, exact: true }) })

test.describe('course page for a course on sale', () => {
  for (const { slug, price, installments, pix } of onSale) {
    test(`${slug}: title, board and buy buttons`, async ({ page }) => {
      await page.goto(`/cursos/${slug}`)
      const { title, summary } = course(slug)

      await expect(page).toHaveTitle(`${title} | Aulaflix`)
      await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', summary)
      await expect(page.getByRole('main').getByRole('link', { name: 'Cursos', exact: true })).toHaveAttribute('href', '/cursos')

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
      await expect(page.getByText(summary)).toBeVisible()
      await expect(page.getByText('Valor do curso')).toBeVisible()
      // .first(): the mobile buy bar repeats the price and the installments, hidden at this width.
      await expect(page.getByText(price, { exact: true }).first()).toBeVisible()
      await expect(page.getByText(installments, { exact: true }).first()).toBeVisible()
      await expect(page.getByText(pix, { exact: true })).toBeVisible()
      await expect(page.getByText('10% de desconto', { exact: true })).toBeVisible()
      await expect(page.getByRole('link', { name: 'Comprar curso' })).toHaveAttribute('href', `/cursos/${slug}/comprar`)
      await expect(page.getByRole('link', { name: 'Assistir à aula grátis' })).toHaveAttribute('href', /#aula-gratis$/)
      for (const perk of ['Acesso vitalício', 'Materiais de apoio', 'Garantia de 7 dias']) {
        await expect(page.getByRole('listitem').filter({ hasText: perk })).toBeVisible()
      }
    })

    test(`${slug}: syllabus by module`, async ({ page }) => {
      await page.goto(`/cursos/${slug}`)
      const detail = onSaleDetail(slug)
      const lessons = courseLessons(detail)
      const syllabus = section(page, 'Ementa')

      await expect(syllabus).toContainText(`${detail.modules.length} módulos e ${lessons.length} aulas.`)
      await expect(syllabus.getByRole('heading', { level: 3 })).toHaveText(
        detail.modules.map((mod, m) => `Módulo ${m + 1}: ${mod.title}`),
      )
      const rows = syllabus.getByRole('listitem')
      await expect(rows).toHaveCount(lessons.length)
      for (const [index, { lesson, number }] of lessons.entries()) {
        const row = rows.nth(index)
        await expect(row).toContainText(lesson.title)
        await expect(row).toContainText(lesson.duration ?? 'Em breve')
        if (lesson.duration) await expect(row.locator('span[aria-hidden="true"]').first()).toHaveText(String(number))
        // The visually hidden part is positioned, so the accessible name gets a space before it.
        await expect(row.getByRole('link', { name: `Grátis : assistir à aula ${lesson.title}` })).toHaveCount(lesson.free ? 1 : 0)
      }
    })

    test(`${slug}: free lesson, about, learn, audience and FAQ`, async ({ page }) => {
      await page.goto(`/cursos/${slug}`)
      const detail = onSaleDetail(slug)
      const free = getFreeLesson(detail)!

      const freeLesson = section(page, 'Aula grátis')
      await expect(freeLesson).toHaveAttribute('id', 'aula-gratis')
      await expect(freeLesson).toContainText('Assista antes de comprar.')
      await expect(freeLesson.getByRole('button', { name: `Assistir à aula: ${free.lesson.title}` })).toContainText(free.lesson.duration!)
      await expect(freeLesson).toContainText(`Aula ${free.number} · ${free.module.title}`)

      for (const paragraph of detail.why) await expect(section(page, 'Sobre o curso')).toContainText(paragraph)
      await expect(section(page, 'O que você vai aprender').getByRole('listitem')).toHaveText(detail.learn)
      await expect(section(page, 'Para quem é').getByRole('listitem')).toHaveText(detail.audience)

      const faq = section(page, 'Perguntas frequentes')
      await expect(faq.locator('summary')).toHaveText(detail.faq.map(entry => `${entry.question}+`))
      await expect(faq).toContainText(
        'Pagamento, garantia, acesso e lista de espera valem para todos os cursos e estão explicados em Como funciona.',
      )
      await expect(faq.getByRole('link', { name: 'Como funciona' })).toHaveAttribute('href', '/como-funciona')
    })
  }

  test('the free lesson player says the video is not available yet', async ({ page }) => {
    await gotoHydrated(page, '/cursos/backend-com-node-js')
    const freeLesson = section(page, 'Aula grátis')
    const notice = 'Protótipo: o vídeo da aula ainda não está disponível.'

    await expect(freeLesson.getByText(notice)).toHaveCount(0)
    await freeLesson.getByRole('button', { name: 'Assistir à aula: Como funciona uma requisição HTTP' }).click()
    await expect(freeLesson.getByRole('status')).toHaveText(notice)
  })

  test('"Assistir à aula grátis" scrolls to the free lesson', async ({ page }) => {
    await gotoHydrated(page, '/cursos/frontend-com-react')
    await page.getByRole('link', { name: 'Assistir à aula grátis' }).click()

    await expect(page).toHaveURL('/cursos/frontend-com-react#aula-gratis')
    await expect(section(page, 'Aula grátis').getByRole('heading', { level: 2 })).toBeInViewport()
  })

  test('the FAQ opens an answer', async ({ page }) => {
    await gotoHydrated(page, '/cursos/backend-com-node-js')
    const faq = section(page, 'Perguntas frequentes')
    const { question, answer } = onSaleDetail('backend-com-node-js').faq[0]!

    await expect(faq.getByText(answer)).toBeHidden()
    await faq.getByText(question).click()
    await expect(faq.getByText(answer)).toBeVisible()
  })

  test('a student who owns the course sees "Continuar" instead of the price', async ({ page }) => {
    await signIn(page)
    await page.goto('/cursos/sql-e-modelagem-de-dados')

    await expect(page.getByText('Você já tem este curso.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Continuar curso' })).toHaveAttribute('href', '/aprender/sql-e-modelagem-de-dados')
    await expect(page.getByText('Valor do curso')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Comprar curso' })).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Comprar', exact: true })).toHaveCount(0)
  })

  test('a signed-in student who doesn\'t own the course sees the price', async ({ page }) => {
    await signIn(page, 'ninguem@exemplo.com')
    await page.goto('/cursos/sql-e-modelagem-de-dados')
    await expect(page.getByText('Valor do curso')).toBeVisible()
  })

  test('the owned state goes away after signing out', async ({ page }) => {
    await signIn(page)
    await page.setViewportSize({ width: 1440, height: 900 })
    await gotoHydrated(page, '/cursos/backend-com-node-js')
    await expect(page.getByText('Você já tem este curso.')).toBeVisible()

    await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
    await page.getByRole('menuitem', { name: 'Sair' }).click()
    await expect(page).toHaveURL('/')
    await page.goBack()
    await expect(page).toHaveURL('/cursos/backend-com-node-js')
    await expect(page.getByText('Valor do curso')).toBeVisible()
  })

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/cursos/backend-com-node-js')
      await expectNoHorizontalScroll(page)
    })
  }
})

test.describe('sticky buy bar on mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } })

  const buyBarLink = (page: Page) => page.getByRole('link', { name: 'Comprar', exact: true })

  test('shows when the board\'s buy buttons scroll out of view, and hides when they come back', async ({ page }) => {
    await gotoHydrated(page, '/cursos/backend-com-node-js')
    const bar = buyBarLink(page)
    const boardBuy = page.getByRole('link', { name: 'Comprar curso' })

    await expect(bar).not.toBeInViewport()
    await expect(page.locator('[inert]').getByRole('link', { name: 'Comprar', exact: true })).toHaveCount(1)

    await page.mouse.wheel(0, 1600)
    await expect(boardBuy).not.toBeInViewport()
    await expect(bar).toBeInViewport()
    await expect(bar).toHaveAttribute('href', '/cursos/backend-com-node-js/comprar')
    await expect(page.locator('[inert]')).toHaveCount(0)
    await expect(page.getByText('R$ 497', { exact: true }).last()).toBeInViewport()

    await page.mouse.wheel(0, -1600)
    await expect(boardBuy).toBeInViewport()
    await expect(bar).not.toBeInViewport()
  })

  test('is not there for a student who owns the course', async ({ page }) => {
    await signIn(page)
    await page.goto('/cursos/backend-com-node-js')
    await expect(page.getByText('Você já tem este curso.')).toBeVisible()
    await expect(buyBarLink(page)).toHaveCount(0)
  })
})

test.describe('course page for a waitlist course', () => {
  for (const slug of waitlistSlugs) {
    test(`${slug}: board, coverage, about, audience and FAQ`, async ({ page }) => {
      await page.goto(`/cursos/${slug}`)
      const { title, summary } = course(slug)
      const detail = courseDetails[slug]!
      if (detail.kind !== 'waitlist') throw new Error(`${slug} is not a waitlist course`)

      await expect(page).toHaveTitle(`${title} | Aulaflix`)
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(title)
      await expect(page.getByText('Em breve', { exact: true })).toBeVisible()
      await expect(page.getByText(summary)).toBeVisible()

      await expect(section(page, 'Conteúdo previsto').getByRole('listitem').locator('p')).toHaveText(detail.coverage)
      for (const paragraph of detail.why) await expect(section(page, 'Sobre o curso')).toContainText(paragraph)
      await expect(section(page, 'O que você vai aprender').getByRole('listitem')).toHaveText(detail.learn)
      await expect(section(page, 'Para quem é').getByRole('listitem')).toHaveText(detail.audience)
      await expect(section(page, 'Perguntas frequentes').locator('summary')).toHaveText(
        detail.faq.map(entry => `${entry.question}+`),
      )

      await expect(section(page, 'Ementa')).toHaveCount(0)
      await expect(section(page, 'Aula grátis')).toHaveCount(0)
      await expect(page.getByText('Valor do curso')).toHaveCount(0)
    })
  }

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/cursos/devops-na-pratica')
      await expectNoHorizontalScroll(page)
    })
  }
})

// Only what both apps share: the reference app doubles the header and footer here and keeps the default
// title, a bug the port doesn't reproduce (#21).
test('an unknown course answers 404 with the 404 page', async ({ page }) => {
  const response = await page.goto('/cursos/curso-que-nao-existe')
  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
})
