import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { demoAccount, expectNoHorizontalScroll, getCookie, gotoHydrated, jsonCookie, setCookie, signIn } from './helpers'

const course = 'backend-com-node-js'
const lessonPath = (lesson: string, slug = course) => `/aprender/${slug}/${lesson}`

/** An account created at sign-up, stored as the reference app stores it. It starts with no courses. */
const createdAccount = {
  name: 'Maria Souza',
  email: 'maria@exemplo.com',
  passwordHash: createHash('sha256').update('senha-da-maria').digest('hex'),
  verified: true,
}

async function signInWithCreatedAccount(page: Page) {
  await setCookie(page, 'aulaflix_account', jsonCookie.encode(createdAccount))
  await signIn(page, createdAccount.email)
}

const lessonList = (page: Page) => page.getByRole('navigation', { name: 'Aulas do curso' })
const lessonLinks = (page: Page) => lessonList(page).getByRole('link')
const lessonHeading = (page: Page) => page.getByRole('heading', { level: 1 })

/** Every POST waits a moment, so the pending state can be seen: the API route here, the Server Action there. */
async function slowDownPosts(page: Page) {
  await page.route('**/*', async (route) => {
    if (route.request().method() === 'POST') await new Promise(resolve => setTimeout(resolve, 1000))
    await route.continue()
  })
}

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('lesson page, signed out', () => {
  test('the course entry and a lesson redirect to sign in, coming back after', async ({ page }) => {
    for (const path of [`/aprender/${course}`, lessonPath('sua-primeira-rota')]) {
      const response = await page.request.get(`${path}?de=email`, { maxRedirects: 0 })
      expect(response.status()).toBe(307)
      expect(response.headers().location).toBe(`/entrar?next=${encodeURIComponent(path)}`)
    }

    await gotoHydrated(page, lessonPath('sua-primeira-rota'))
    await expect(page).toHaveURL(`/entrar?next=${encodeURIComponent(lessonPath('sua-primeira-rota'))}`)
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
  })

  // Only what both apps share: the reference app doubles the header and footer here, which the port doesn't (#21).
  test('an unknown course answers 404 before asking to sign in', async ({ page }) => {
    for (const path of ['/aprender/curso-que-nao-existe', '/aprender/curso-que-nao-existe/aula']) {
      const response = await page.goto(path)
      expect(response?.status()).toBe(404)
      await expect(page.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
    }
  })
})

test.describe('course entry', () => {
  test('opens the lesson where the student left off', async ({ page }) => {
    await signIn(page)
    const response = await page.request.get(`/aprender/${course}`, { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(response.headers().location).toBe(lessonPath('tratamento-de-erros'))

    await page.goto(`/aprender/${course}`)
    await expect(page).toHaveURL(lessonPath('tratamento-de-erros'))
    await expect(lessonHeading(page)).toHaveText('Tratamento de erros')
  })

  test('opens the last lesson visited, and the first one when every lesson is done', async ({ page }) => {
    await setCookie(page, 'aulaflix_visits', jsonCookie.encode({
      [demoAccount.email]: { course: 'frontend-com-react', lessons: { 'frontend-com-react': 'estado-com-usestate' } },
    }))
    await signIn(page)

    await page.goto('/aprender/frontend-com-react')
    await expect(page).toHaveURL(lessonPath('estado-com-usestate', 'frontend-com-react'))
    await expect(lessonHeading(page)).toHaveText('Estado com useState')

    await page.goto('/aprender/sql-e-modelagem-de-dados')
    await expect(page).toHaveURL(lessonPath('do-requisito-ao-modelo-de-dados', 'sql-e-modelagem-de-dados'))
    await expect(lessonHeading(page)).toHaveText('Do requisito ao modelo de dados')
  })

  test('"Continuar curso" on the course page opens the lesson', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, `/cursos/${course}`)

    await page.getByRole('link', { name: 'Continuar curso' }).click()
    await expect(page).toHaveURL(lessonPath('tratamento-de-erros'))
    await expect(lessonHeading(page)).toHaveText('Tratamento de erros')
  })

  test('a student who doesn\'t own the course is sent to the course page', async ({ page }) => {
    await signInWithCreatedAccount(page)
    for (const path of [`/aprender/${course}`, lessonPath('sua-primeira-rota'), lessonPath('aula-que-nao-existe')]) {
      const response = await page.request.get(path, { maxRedirects: 0 })
      expect(response.status()).toBe(307)
      expect(response.headers().location).toBe(`/cursos/${course}`)
    }

    // A course on the waitlist can't be owned.
    await signIn(page)
    await page.goto('/aprender/devops-na-pratica')
    await expect(page).toHaveURL('/cursos/devops-na-pratica')
    await expect(page.getByRole('heading', { level: 1, name: 'DevOps na Prática' })).toBeVisible()
  })
})

test.describe('lesson page', () => {
  test('shows the player, the lesson and where it sits in the course', async ({ page }) => {
    await signIn(page)
    const response = await gotoHydrated(page, lessonPath('tratamento-de-erros'))
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Tratamento de erros · Backend com Node.js | Aulaflix')

    const breadcrumb = page.getByRole('navigation', { name: 'Você está em' })
    await expect(breadcrumb.getByRole('listitem')).toHaveText(['Meus cursos', 'Backend com Node.js'])
    await expect(breadcrumb.getByRole('link', { name: 'Meus cursos' })).toHaveAttribute('href', '/meus-cursos')

    const main = page.getByRole('main')
    await expect(main.getByText('Aula 6 de 12 · Módulo 2: Construindo a API')).toBeVisible()
    await expect(lessonHeading(page)).toHaveText('Tratamento de erros')
    await expect(main.getByRole('button', { name: 'Marcar como concluída' })).toBeEnabled()
    await expect(main.getByText('Aula concluída')).toHaveCount(0)

    const previous = main.getByRole('link', { name: 'Aula anterior Validação dos dados de entrada' })
    await expect(previous).toHaveAttribute('href', lessonPath('validacao-dos-dados-de-entrada'))
    const next = main.getByRole('link', { name: 'Próxima aula Conectando ao PostgreSQL' })
    await expect(next).toHaveAttribute('href', lessonPath('conectando-ao-postgresql'))

    // There are no videos yet: the player only says so.
    const player = main.getByRole('button', { name: 'Assistir à aula: Tratamento de erros' })
    await expect(player).toHaveText('21:10')
    const notice = main.getByRole('status')
    await expect(notice).toBeEmpty()
    await player.click()
    await expect(notice).toHaveText('Protótipo: o vídeo da aula ainda não está disponível.')
  })

  test('lists the lessons by module, with the ones done and the current one marked', async ({ page }) => {
    await signIn(page)
    await page.goto(lessonPath('tratamento-de-erros'))

    const list = lessonList(page)
    await expect(list.getByText('Backend com Node.js', { exact: true })).toBeVisible()
    await expect(list.getByText('5 de 12 aulas concluídas')).toBeVisible()
    await expect(list.getByRole('progressbar', { name: 'Andamento em Backend com Node.js' })).toHaveAttribute('aria-valuenow', '42')
    await expect(list.getByRole('heading', { level: 2 })).toHaveText([
      'Módulo 1: Fundamentos de APIs',
      'Módulo 2: Construindo a API',
      'Módulo 3: Dados e autenticação',
      'Módulo 4: Qualidade e produção',
    ])
    await expect(list.getByRole('region', { name: 'Módulo 2: Construindo a API' }).getByRole('listitem')).toHaveText([
      'Rotas, parâmetros e status HTTP18:31, concluída',
      'Validação dos dados de entrada15:47, concluída',
      'Tratamento de erros21:10',
    ])

    // The lessons published so far are links; the last one comes later.
    await expect(lessonLinks(page)).toHaveCount(11)
    await expect(lessonLinks(page).first()).toHaveAttribute('href', lessonPath('como-funciona-uma-requisicao-http'))
    const current = list.locator('[aria-current="page"]')
    await expect(current).toHaveCount(1)
    await expect(current).toHaveText('Tratamento de erros21:10')
    await expect(current).toHaveAttribute('href', lessonPath('tratamento-de-erros'))
    await expect(list.getByRole('listitem').last()).toHaveText('Projeto final: publicando a APIEm breve')
    await expect(list.getByRole('listitem').last().getByRole('link')).toHaveCount(0)
  })

  test('the first lesson has no previous one, and the last published one leads back to my courses', async ({ page }) => {
    await signIn(page)
    await page.goto(lessonPath('como-funciona-uma-requisicao-http'))
    const main = page.getByRole('main')
    await expect(lessonHeading(page)).toHaveText('Como funciona uma requisição HTTP')
    await expect(main.getByRole('link', { name: /^Aula anterior/ })).toHaveCount(0)
    await expect(main.getByRole('link', { name: 'Próxima aula Preparando o projeto com Node.js e TypeScript' })).toBeVisible()

    await page.goto(lessonPath('configuracao-e-variaveis-de-ambiente'))
    await expect(main.getByText('Aula 11 de 12 · Módulo 4: Qualidade e produção')).toBeVisible()
    await expect(main.getByRole('link', { name: 'Aula anterior Testando as rotas da API' })).toBeVisible()
    await expect(main.getByRole('link', { name: /^Próxima aula/ })).toHaveCount(0)
    await expect(main.getByText('Esta é a última aula publicada.')).toHaveText('Esta é a última aula publicada. Voltar para Meus cursos')
    await expect(main.getByRole('link', { name: 'Voltar para Meus cursos' })).toHaveAttribute('href', '/meus-cursos')
  })

  test('an unknown or unpublished lesson answers 404', async ({ page }) => {
    await signIn(page)
    for (const lesson of ['aula-que-nao-existe', 'projeto-final-publicando-a-api']) {
      const response = await page.goto(lessonPath(lesson))
      expect(response?.status()).toBe(404)
      await expect(page.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
    }
  })

  test('opening a lesson records it as the last one visited', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, lessonPath('autenticacao-com-tokens'))

    await expect.poll(async () => {
      const raw = await getCookie(page, 'aulaflix_visits')
      return raw && jsonCookie.decode(raw)
    }).toEqual({ [demoAccount.email]: { course, lessons: { [course]: 'autenticacao-com-tokens' } } })
  })

  test('marking the lesson as done, and undoing it, updates the page', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, lessonPath('tratamento-de-erros'))
    const main = page.getByRole('main')
    const list = lessonList(page)
    const progress = list.getByRole('progressbar')

    await main.getByRole('button', { name: 'Marcar como concluída' }).click()
    await expect(main.getByText('Aula concluída')).toBeVisible()
    await expect(main.getByRole('button', { name: 'Desmarcar' })).toBeEnabled()
    await expect(list.getByText('6 de 12 aulas concluídas')).toBeVisible()
    await expect(progress).toHaveAttribute('aria-valuenow', '50')
    await expect(list.locator('[aria-current="page"]')).toHaveText('Tratamento de erros21:10, concluída')
    // It stays on the lesson.
    await expect(page).toHaveURL(lessonPath('tratamento-de-erros'))

    const raw = await getCookie(page, 'aulaflix_progress')
    expect(raw && jsonCookie.decode(raw)).toEqual({
      [demoAccount.email]: {
        [course]: [
          'como-funciona-uma-requisicao-http',
          'preparando-o-projeto-com-node-js-e-typescript',
          'sua-primeira-rota',
          'rotas-parametros-e-status-http',
          'validacao-dos-dados-de-entrada',
          'tratamento-de-erros',
        ],
      },
    })

    await main.getByRole('button', { name: 'Desmarcar' }).click()
    await expect(main.getByRole('button', { name: 'Marcar como concluída' })).toBeEnabled()
    await expect(main.getByText('Aula concluída')).toHaveCount(0)
    await expect(list.getByText('5 de 12 aulas concluídas')).toBeVisible()
    await expect(progress).toHaveAttribute('aria-valuenow', '42')
    await expect(list.locator('[aria-current="page"]')).toHaveText('Tratamento de erros21:10')
  })

  test('the button says it is saving until the page is updated', async ({ page }) => {
    await signIn(page)
    await slowDownPosts(page)
    await gotoHydrated(page, lessonPath('tratamento-de-erros'))
    const main = page.getByRole('main')

    await main.getByRole('button', { name: 'Marcar como concluída' }).click()
    await expect(main.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
    await expect(main.getByRole('button', { name: 'Desmarcar' })).toBeEnabled()

    await main.getByRole('button', { name: 'Desmarcar' }).click()
    await expect(main.getByRole('button', { name: 'Salvando…' })).toBeDisabled()
    await expect(main.getByRole('button', { name: 'Marcar como concluída' })).toBeEnabled()
  })

  test('the next lesson and the lesson list open other lessons', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, lessonPath('tratamento-de-erros'))
    const main = page.getByRole('main')
    await main.getByRole('button', { name: 'Assistir à aula: Tratamento de erros' }).click()

    await main.getByRole('link', { name: 'Próxima aula Conectando ao PostgreSQL' }).click()
    await expect(page).toHaveURL(lessonPath('conectando-ao-postgresql'))
    await expect(lessonHeading(page)).toHaveText('Conectando ao PostgreSQL')
    await expect(page).toHaveTitle('Conectando ao PostgreSQL · Backend com Node.js | Aulaflix')
    await expect(main.getByText('Aula 7 de 12 · Módulo 3: Dados e autenticação')).toBeVisible()
    await expect(lessonList(page).locator('[aria-current="page"]')).toHaveText('Conectando ao PostgreSQL19:22')
    // The player starts over on each lesson.
    await expect(main.getByRole('status')).toBeEmpty()

    await lessonList(page).getByRole('link', { name: 'Sua primeira rota' }).click()
    await expect(page).toHaveURL(lessonPath('sua-primeira-rota'))
    await expect(lessonHeading(page)).toHaveText('Sua primeira rota')
    await expect(main.getByText('Aula concluída')).toBeVisible()
    await expect(main.getByRole('button', { name: 'Desmarcar' })).toBeVisible()
  })

  test('on desktop, the lesson list scrolls by itself to show the current lesson', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, lessonPath('testando-as-rotas-da-api'))
    const list = lessonList(page)
    const current = list.locator('[aria-current="page"]')

    // The list scrolls inside its own box, centred on the current lesson; the page itself doesn't move.
    await expect.poll(() => current.evaluate((row) => {
      const scroller = row.closest('nav')!.children[1] as HTMLElement
      const box = scroller.getBoundingClientRect()
      const rect = row.getBoundingClientRect()
      return scroller.scrollTop > 0 && rect.top >= box.top && rect.bottom <= box.bottom
    })).toBe(true)
    expect(await page.evaluate(() => window.scrollY)).toBe(0)
  })

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await signIn(page)
      await page.setViewportSize({ width, height: 900 })
      await page.goto(lessonPath('validacao-dos-dados-de-entrada'))
      await expect(lessonHeading(page)).toBeVisible()
      await expectNoHorizontalScroll(page)
    })
  }
})

test('journey: complete a lesson, then resume from my courses at the next one', async ({ page }) => {
  await signIn(page)
  await gotoHydrated(page, '/meus-cursos')
  const resume = page.getByRole('region', { name: 'Continuar de onde parou' })
  await expect(resume).toContainText('Backend com Node.js · Aula 6 de 12')

  await resume.getByRole('link', { name: 'Continuar aula' }).click()
  await expect(page).toHaveURL(lessonPath('tratamento-de-erros'))
  await page.getByRole('button', { name: 'Marcar como concluída' }).click()
  await expect(page.getByText('Aula concluída')).toBeVisible()

  await page.getByRole('navigation', { name: 'Você está em' }).getByRole('link', { name: 'Meus cursos' }).click()
  await expect(page).toHaveURL('/meus-cursos')
  await expect(resume).toContainText('Conectando ao PostgreSQL')
  await expect(resume).toContainText('Backend com Node.js · Aula 7 de 12')

  await resume.getByRole('link', { name: 'Continuar aula' }).click()
  await expect(page).toHaveURL(lessonPath('conectando-ao-postgresql'))
  await expect(lessonHeading(page)).toHaveText('Conectando ao PostgreSQL')
})
