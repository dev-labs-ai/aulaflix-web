import { expect, test } from '@playwright/test'
import { expectNoHorizontalScroll, gotoHydrated } from './helpers'

const siteDescription
  = 'Cursos online de backend, frontend, banco de dados, DevOps e IA para desenvolvedores de software. Aprenda no seu ritmo, com acesso vitalício.'

const areas = [
  ['backend', 'Backend'],
  ['frontend', 'Frontend'],
  ['banco-de-dados', 'Banco de dados'],
  ['devops', 'DevOps'],
  ['ia', 'IA'],
  ['qualidade', 'Qualidade'],
  ['arquitetura', 'Arquitetura'],
] as const

const steps = [
  {
    title: 'Escolha o que aprender',
    summary: 'Cada curso é independente. Escolha pela área, leia a ementa e assista à aula grátis antes de decidir.',
    details:
      'Cada curso é independente: não há pacote nem trilha obrigatória. No catálogo, você filtra por área e vê o que já está à venda e o que está chegando. Nos cursos à venda, a página mostra a ementa completa, com a duração de cada aula, e uma aula grátis para assistir ali mesmo, sem precisar de conta.',
  },
  {
    title: 'Compre uma vez',
    summary: 'Sem assinatura: você paga o curso uma vez, no Pix ou em até 10x no cartão, e ele fica seu para sempre.',
    details:
      'Não há assinatura: você paga o curso uma vez, no Pix com desconto ou no cartão em até 10x sem juros, e o acesso é vitalício. Se ainda não tem conta, ela é criada na própria compra. Com o pagamento aprovado, a primeira aula já fica liberada, e você tem 7 dias de garantia para pedir o reembolso se o curso não for para você.',
  },
  {
    title: 'Estude no seu ritmo',
    summary: 'Assista quando quiser, marque as aulas concluídas e volte de onde parou, no computador ou no celular.',
    details:
      'Assista quando quiser e quantas vezes quiser, no computador ou no celular. Marque as aulas concluídas para acompanhar o andamento, e em Meus cursos o destaque “Continuar de onde parou” leva direto à última aula que você abriu.',
  },
]

const upcoming = [
  ['devops-na-pratica', 'DevOps na Prática'],
  ['ia-para-desenvolvedores', 'IA para Desenvolvedores'],
  ['testes-automatizados', 'Testes Automatizados'],
  ['arquitetura-de-software', 'Arquitetura de Software'],
] as const

const faq = [
  ['Por quanto tempo tenho acesso ao curso?', 'O acesso é vitalício. Depois da compra, você pode assistir às aulas quantas vezes quiser, no seu ritmo.'],
  ['Quais são as formas de pagamento?', 'Pix, com desconto, ou cartão de crédito em até 10x sem juros. O valor em cada forma aparece na página do curso.'],
  ['E se o curso não for para mim?', 'Você tem 7 dias de garantia. Se não gostar, é só pedir o reembolso dentro desse prazo.'],
  ['Preciso criar uma conta para comprar?', 'Sim, mas ela é criada durante a própria compra: você informa o e-mail e, se ainda não tiver conta, nome e senha.'],
  ['Quando os cursos em breve serão lançados?', 'Ainda não há data definida. Quem entra na lista de espera recebe um aviso por e-mail assim que as inscrições abrirem.'],
  ['Entrar na lista de espera tem algum custo?', 'Não. A lista de espera é gratuita e não obriga você a comprar o curso quando ele for lançado.'],
] as const

test.describe('home page', () => {
  test('has the default title and description', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Aulaflix — Cursos online para desenvolvedores de software')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', siteDescription)
  })

  test('shows the board with a button per area and the catalog button', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Evolua como dev com cursos feitos para a prática.')
    await expect(
      page.getByText(
        'Cursos online para desenvolvedores de software. Escolha o que quer aprender, assista quando quiser e volte às aulas sempre que precisar.',
      ),
    ).toBeVisible()

    const areaNav = page.getByRole('navigation', { name: 'Escolha uma área' })
    const areaLinks = areaNav.getByRole('listitem').getByRole('link')
    await expect(areaLinks).toHaveText(areas.map(([, label]) => label))
    for (const [index, [area]] of areas.entries()) {
      await expect(areaLinks.nth(index)).toHaveAttribute('href', `/cursos?area=${area}`)
    }
    await expect(areaNav.getByRole('link', { name: 'Ver todos os cursos' })).toHaveAttribute('href', '/cursos')
  })

  test('an area button opens the catalog filtered by that area', async ({ page }) => {
    await gotoHydrated(page, '/')
    await page.getByRole('navigation', { name: 'Escolha uma área' }).getByRole('link', { name: 'Banco de dados' }).click()

    await expect(page).toHaveURL('/cursos?area=banco-de-dados')
    await expect(page.getByRole('list', { name: 'Cursos' }).getByRole('heading', { level: 3 })).toHaveText([
      'SQL e Modelagem de Dados',
    ])
  })

  test('shows the three steps with the link to Como funciona', async ({ page }) => {
    await page.goto('/')
    const section = page.getByRole('region', { name: 'Como funciona' })

    await expect(section.getByRole('link', { name: 'Ver detalhes e dúvidas' })).toHaveAttribute('href', '/como-funciona')
    const items = section.getByRole('listitem')
    await expect(items.getByRole('heading', { level: 3 })).toHaveText(steps.map((step, i) => `${i + 1}. ${step.title}`))
    for (const [index, step] of steps.entries()) {
      await expect(items.nth(index)).toContainText(step.summary)
    }
  })

  test('"Ver detalhes e dúvidas" leads to Como funciona', async ({ page }) => {
    await gotoHydrated(page, '/')
    await page.getByRole('link', { name: 'Ver detalhes e dúvidas' }).click()
    await expect(page).toHaveURL('/como-funciona')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como funciona')
  })

  test('shows the upcoming courses strip', async ({ page }) => {
    await page.goto('/')
    const section = page.getByRole('region', { name: 'Chegando em breve' })

    await expect(section.getByRole('link', { name: 'Ver os cursos em breve' })).toHaveAttribute(
      'href',
      '/cursos?situacao=em-breve',
    )
    const courses = section.getByRole('listitem').getByRole('link')
    await expect(courses).toHaveText(upcoming.map(([, title]) => title))
    for (const [index, [slug]] of upcoming.entries()) {
      await expect(courses.nth(index)).toHaveAttribute('href', `/cursos/${slug}`)
    }
  })

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`the board's chalk animations with reduced motion set to ${reducedMotion}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion })
      await page.goto('/')

      const board = page.getByRole('region', { name: 'Evolua como dev com cursos feitos para a prática.' })
      const title = board.getByRole('heading', { level: 1 })
      const areaNav = board.getByRole('navigation', { name: 'Escolha uma área' })
      if (reducedMotion === 'reduce') {
        await expect(title).toHaveCSS('animation-name', 'none')
        await expect(areaNav).toHaveCSS('animation-name', 'none')
        await expect(areaNav).toHaveCSS('opacity', '1')
      }
      else {
        await expect(title).toHaveCSS('animation-name', 'giz-escrita')
        await expect(areaNav).toHaveCSS('animation-name', 'giz-surge')
        await expect(areaNav).toHaveCSS('animation-delay', '0.85s')
      }
    })
  }

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/')
      await expectNoHorizontalScroll(page)
    })
  }
})

test.describe('Como funciona page', () => {
  test('has its own title and description', async ({ page }) => {
    await page.goto('/como-funciona')
    await expect(page).toHaveTitle('Como funciona | Aulaflix')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Como escolher, comprar e estudar nos cursos do Aulaflix, e as dúvidas que valem para todos eles.',
    )
  })

  test('shows the detailed steps', async ({ page }) => {
    await page.goto('/como-funciona')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Como funciona')
    await expect(
      page.getByText(
        'Cursos avulsos, comprados uma vez e assistidos no seu ritmo. Veja o caminho da escolha do curso até as aulas, e as dúvidas que valem para todos os cursos.',
      ),
    ).toBeVisible()

    const items = page.getByRole('main').getByRole('list').first().getByRole('listitem')
    await expect(items.getByRole('heading', { level: 2 })).toHaveText(steps.map((step, i) => `${i + 1}. ${step.title}`))
    for (const [index, step] of steps.entries()) {
      await expect(items.nth(index)).toContainText(step.details)
    }
  })

  test('explains the waitlist', async ({ page }) => {
    await page.goto('/como-funciona')
    const box = page.getByRole('region', { name: 'E os cursos em breve?' })

    await expect(box).toContainText(
      'Os cursos marcados como “Em breve” ainda estão em produção. Na página de cada um, você vê o conteúdo previsto e entra na lista de espera: com a conta, basta um clique em “Avise-me”; sem ela, só o e-mail. Quando as inscrições abrirem, você recebe um aviso.',
    )
    await expect(box.getByRole('link', { name: 'Ver os cursos em breve' })).toHaveAttribute('href', '/cursos?situacao=em-breve')
  })

  test('lists the questions that hold for every course, each opening its answer', async ({ page }) => {
    await gotoHydrated(page, '/como-funciona')
    const section = page.getByRole('region', { name: 'Dúvidas frequentes' })

    await expect(section.locator('summary')).toHaveText(faq.map(([question]) => `${question}+`))
    const [question, answer] = faq[2]
    await expect(section.getByText(answer)).toBeHidden()
    await section.getByText(question).click()
    await expect(section.getByText(answer)).toBeVisible()
    await section.getByText(question).click()
    await expect(section.getByText(answer)).toBeHidden()
  })

  test('"Ver todos os cursos" leads to the catalog', async ({ page }) => {
    await gotoHydrated(page, '/como-funciona')
    await page.getByRole('main').getByRole('link', { name: 'Ver todos os cursos' }).click()
    await expect(page).toHaveURL('/cursos')
  })

  for (const width of [1440, 390]) {
    test(`has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })
      await page.goto('/como-funciona')
      await expectNoHorizontalScroll(page)
    })
  }
})
