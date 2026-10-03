import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, getCookie, gotoHydrated, jsonCookie, setCookie, signIn } from './helpers'

const course = 'backend-com-node-js'
const path = `/cursos/${course}/comprar`
const firstLesson = `/aprender/${course}/como-funciona-uma-requisicao-http`

/** An account created at sign-up, stored as the reference app stores it, with 'senha-da-maria'. It starts with no courses. */
const createdAccount = { name: 'Maria Souza', email: 'maria@exemplo.com' }
const createdAccountCookie = jsonCookie.encode({
  ...createdAccount,
  passwordHash: createHash('sha256').update('senha-da-maria').digest('hex'),
  verified: true,
})

async function signInWithCreatedAccount(page: Page) {
  await setCookie(page, 'aulaflix_account', createdAccountCookie)
  await signIn(page, createdAccount.email)
}

/** Card details that would stand out in any request body. */
const card = { number: '4111 1111 1111 1111', name: 'TITULAR DE TESTE', expiry: '12/30', cvc: '987' }

async function fillCard(page: Page) {
  await page.getByLabel('Número do cartão').fill(card.number)
  await page.getByLabel('Nome impresso no cartão').fill(card.name)
  await page.getByLabel('Validade').fill(card.expiry)
  await page.getByLabel('CVV').fill(card.cvc)
}

type Order = { id: string, method: string, amount: number, installments?: number, courses: string[] }

/** The orders this browser recorded for an account. */
async function savedOrders(page: Page, email: string): Promise<Order[]> {
  const raw = await getCookie(page, 'aulaflix_purchases')
  return raw ? (jsonCookie.decode(raw) as Record<string, Order[]>)[email] ?? [] : []
}

/** On the confirmation step, at `?pedido=<id>`. Returns the order id. */
async function expectConfirmation(page: Page) {
  await expect(page.getByRole('heading', { level: 2, name: 'Pronto, o curso é seu' })).toBeVisible()
  await expect(page).toHaveURL(url => url.pathname === path && /^[A-Z0-9]{8}$/.test(url.searchParams.get('pedido') ?? ''))
  return new URL(page.url()).searchParams.get('pedido')!
}

const steps = (page: Page) => page.getByRole('main').getByRole('list').first().getByRole('listitem')
const summary = (page: Page) => page.getByRole('complementary', { name: 'Resumo do pedido' })
const payButton = (page: Page) => page.getByRole('button', { name: /^(Pagar|Processando)/ })

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('checkout of a course that isn\'t on sale', () => {
  // Only what both apps share: the reference app doubles the header and footer here, which the port doesn't (#21).
  test('an unknown course answers 404', async ({ page }) => {
    const response = await page.goto('/cursos/curso-que-nao-existe/comprar')
    expect(response?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
  })

  test('a course on the waitlist sends to its course page', async ({ page }) => {
    const response = await page.request.get('/cursos/devops-na-pratica/comprar', { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(response.headers().location).toBe('/cursos/devops-na-pratica')

    await page.goto('/cursos/devops-na-pratica/comprar')
    await expect(page).toHaveURL('/cursos/devops-na-pratica')
    await expect(page.getByRole('heading', { level: 1, name: 'DevOps na Prática' })).toBeVisible()
  })
})

test.describe('identification', () => {
  test('signed out, it starts by asking for the email, next to the order summary', async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)
    await expect(page).toHaveTitle('Comprar Backend com Node.js | Aulaflix')

    await expect(page.getByRole('main').getByRole('link', { name: 'Backend com Node.js' })).toHaveAttribute('href', `/cursos/${course}`)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Comprar curso')
    await expect(steps(page)).toHaveText(['1Identificação', '2Pagamento', '3Pronto'])
    await expect(steps(page).nth(0)).toHaveAttribute('aria-current', 'step')
    await expect(page.getByRole('heading', { level: 2, name: 'Entre ou crie sua conta' })).toBeVisible()
    await expect(page.getByLabel('E-mail')).toBeVisible()

    const aside = summary(page)
    await expect(aside).toContainText('Backend')
    await expect(aside.getByText('Backend com Node.js')).toBeVisible()
    await expect(aside.locator('dt')).toHaveText(['No cartão', 'Parcelado', 'No Pix (10% de desconto)'])
    await expect(aside.locator('dd')).toHaveText(['R$ 497', '10x de R$ 49,70', 'R$ 447,30'])
    await expect(aside.getByRole('listitem')).toHaveText(['Acesso vitalício', 'Materiais de apoio', 'Garantia de 7 dias'])
  })

  test('the course page\'s buy button opens it', async ({ page }) => {
    await gotoHydrated(page, `/cursos/${course}`)
    await page.getByRole('link', { name: 'Comprar curso' }).first().click()
    await expect(page).toHaveURL(path)
    await expect(page.getByRole('heading', { level: 1, name: 'Comprar curso' })).toBeVisible()
  })

  // A sign-in test, so it goes through the sign-in flow, here inline.
  test('signing in right there moves on to payment', async ({ page }) => {
    await setCookie(page, 'aulaflix_account', createdAccountCookie)
    await gotoHydrated(page, path)

    await page.getByLabel('E-mail').fill(createdAccount.email)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await expect(page.getByRole('heading', { level: 2, name: 'Que bom ver você de novo' })).toBeVisible()
    await page.getByLabel('Senha', { exact: true }).fill('senha-da-maria')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()

    await expect(page.getByRole('heading', { level: 2, name: 'Pagamento' })).toBeVisible()
    await expect(page).toHaveURL(path)
    await expect(page.getByText('Comprando como')).toHaveText(`Comprando como ${createdAccount.name}(${createdAccount.email})`)
    await expect(steps(page)).toHaveText(['Identificação(concluída)', '2Pagamento', '3Pronto'])
    await expect(steps(page).nth(1)).toHaveAttribute('aria-current', 'step')
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('MS')
  })

  // A sign-up test, so it goes through the sign-up flow, here inline.
  test('creating the account right there moves on to payment', async ({ page }) => {
    await gotoHydrated(page, path)

    await page.getByLabel('E-mail').fill('nova.pessoa@exemplo.com')
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await page.getByLabel('Nome').fill('Nova Pessoa')
    await page.getByLabel('Senha', { exact: true }).fill('senha-nova-123')
    await page.getByRole('button', { name: 'Criar conta' }).click()

    await expect(page.getByRole('heading', { level: 2, name: 'Pagamento' })).toBeVisible()
    await expect(page).toHaveURL(path)
    await expect(page.getByText('Comprando como')).toHaveText('Comprando como Nova Pessoa(nova.pessoa@exemplo.com)')
    await expect(page.getByRole('button', { name: 'Abrir menu do usuário' })).toHaveText('NP')
  })
})

test.describe('payment', () => {
  test('Pix comes first, with its discount', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await page.goto(path)

    const methods = page.getByRole('group', { name: 'Forma de pagamento' })
    await expect(methods.getByRole('radio')).toHaveCount(2)
    await expect(methods.getByRole('radio', { name: /^Pix/ })).toBeChecked()
    await expect(methods.getByText('R$ 447,30, com 10% de desconto')).toBeVisible()
    await expect(methods.getByText('R$ 497 em até 10x sem juros')).toBeVisible()
    await expect(page.getByText('No Pix, o pagamento é aprovado na hora e o acesso ao curso é liberado em seguida.')).toBeVisible()
    await expect(page.getByLabel('Número do cartão')).toHaveCount(0)
    await expect(payButton(page)).toHaveText('Pagar R$ 447,30 com Pix')
    await expect(page.getByText('Protótipo: nenhum pagamento é cobrado, o pedido é aprovado na hora e os dados do cartão não saem do navegador.')).toBeVisible()
  })

  test('the card asks for its details and the installments', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)

    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()
    await expect(page.getByText('No Pix, o pagamento é aprovado na hora')).toHaveCount(0)
    await expect(page.getByLabel('Número do cartão')).toHaveAttribute('placeholder', '0000 0000 0000 0000')
    await expect(page.getByLabel('Validade')).toHaveAttribute('placeholder', 'MM/AA')
    await expect(page.getByLabel('CVV')).toHaveAttribute('maxlength', '4')
    const installments = page.getByLabel('Parcelas')
    await expect(installments).toHaveValue('10')
    await expect(installments.getByRole('option')).toHaveText([
      '1x de R$ 497 (à vista)',
      '2x de R$ 248,50 sem juros',
      '3x de R$ 165,67 sem juros',
      '4x de R$ 124,25 sem juros',
      '5x de R$ 99,40 sem juros',
      '6x de R$ 82,83 sem juros',
      '7x de R$ 71 sem juros',
      '8x de R$ 62,13 sem juros',
      '9x de R$ 55,22 sem juros',
      '10x de R$ 49,70 sem juros',
    ])
    await expect(payButton(page)).toHaveText('Pagar R$ 497')

    // Back to Pix, the button follows.
    await page.getByRole('radio', { name: /^Pix/ }).check()
    await expect(payButton(page)).toHaveText('Pagar R$ 447,30 com Pix')
    await expect(page.getByLabel('Parcelas')).toHaveCount(0)
  })

  test('card details are checked in the browser, and nothing is sent until they are valid', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)
    const posts: string[] = []
    page.on('request', (request) => {
      if (request.method() === 'POST') posts.push(request.url())
    })

    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()
    await payButton(page).click()
    await expect(page.getByText('Confira o número do cartão.')).toBeVisible()
    await expect(page.getByText('Digite o nome como está no cartão.')).toBeVisible()
    await expect(page.getByText('Use a validade no formato MM/AA.')).toBeVisible()
    await expect(page.getByText('Confira o código de segurança.')).toBeVisible()
    await expect(page.getByLabel('Número do cartão')).toHaveAttribute('aria-invalid', 'true')

    // Each error follows what is typed.
    await page.getByLabel('Número do cartão').fill('1234 5678')
    await expect(page.getByText('Confira o número do cartão.')).toBeVisible()
    await page.getByLabel('Número do cartão').fill(card.number)
    await expect(page.getByText('Confira o número do cartão.')).toHaveCount(0)
    await page.getByLabel('Validade').fill('13/30')
    await expect(page.getByText('Use a validade no formato MM/AA.')).toBeVisible()
    await page.getByLabel('Validade').fill('01/20')
    await expect(page.getByText('Use a validade no formato MM/AA.')).toBeVisible()
    await page.getByLabel('CVV').fill('12')
    await expect(page.getByText('Confira o código de segurança.')).toBeVisible()

    await payButton(page).click()
    await expect(page.getByText('Digite o nome como está no cartão.')).toBeVisible()
    expect(posts).toEqual([])
    expect(await savedOrders(page, createdAccount.email)).toEqual([])
  })

  test('a field shows its error once it loses focus filled in', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)
    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()

    // Leaving an empty field says nothing yet.
    await page.getByLabel('Número do cartão').focus()
    await page.getByLabel('Nome impresso no cartão').focus()
    await expect(page.getByText('Confira o número do cartão.')).toHaveCount(0)

    await page.getByLabel('Número do cartão').fill('123')
    await expect(page.getByText('Confira o número do cartão.')).toHaveCount(0)
    await page.getByLabel('Número do cartão').blur()
    await expect(page.getByText('Confira o número do cartão.')).toBeVisible()
    await expect(page.getByText('Digite o nome como está no cartão.')).toHaveCount(0)
  })

  test('the button says it is processing while the order goes through', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await page.route('**/*', async (route) => {
      if (route.request().method() === 'POST') await new Promise(resolve => setTimeout(resolve, 1000))
      await route.continue()
    })
    await gotoHydrated(page, path)

    await payButton(page).click()
    await expect(page.getByRole('button', { name: 'Processando…' })).toBeDisabled()
    await expectConfirmation(page)
  })
})

test.describe('confirmation', () => {
  test('Pix: the order is approved at once, and the first lesson is a click away', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)

    await payButton(page).click()
    const id = await expectConfirmation(page)
    await expect(page).toHaveTitle('Comprar Backend com Node.js | Aulaflix')
    await expect(steps(page)).toHaveText(['Identificação(concluída)', 'Pagamento(concluída)', '3Pronto'])
    await expect(steps(page).nth(2)).toHaveAttribute('aria-current', 'step')
    await expect(page.getByText(`Pedido nº ${id}`)).toHaveText(`Pedido nº ${id} · Pix · R$ 447,30`)
    await expect(page.getByText('O acesso é vitalício: as aulas ficam em Meus cursos, e o pedido, em Conta.')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Assistir à primeira aula' })).toHaveAttribute('href', firstLesson)

    const orders = await savedOrders(page, createdAccount.email)
    expect(orders).toEqual([expect.objectContaining({ id, method: 'pix', status: 'paid', amount: 447.3, courses: [course] })])
    expect(orders[0]).not.toHaveProperty('installments')

    // The confirmation stays at its address.
    await page.reload()
    await expect(page.getByRole('heading', { level: 2, name: 'Pronto, o curso é seu' })).toBeVisible()
  })

  test('card: the installments go with the order, and the card details never reach the server', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)
    const bodies: string[] = []
    page.on('request', request => bodies.push(`${request.url()} ${request.postData() ?? ''}`))

    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()
    await fillCard(page)
    await page.getByLabel('Parcelas').selectOption('3')
    await payButton(page).click()

    const id = await expectConfirmation(page)
    await expect(page.getByText(`Pedido nº ${id}`)).toHaveText(`Pedido nº ${id} · Cartão em 3x · R$ 497`)
    expect(await savedOrders(page, createdAccount.email)).toEqual([
      expect.objectContaining({ id, method: 'card', amount: 497, installments: 3, courses: [course] }),
    ])
    for (const secret of ['4111', card.name, card.cvc, card.expiry, encodeURIComponent(card.expiry)]) {
      expect(bodies.filter(body => body.includes(secret))).toEqual([])
    }
  })

  test('paying in one installment shows only the card', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)
    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()
    await fillCard(page)
    await page.getByLabel('Parcelas').selectOption('1')
    await payButton(page).click()

    const id = await expectConfirmation(page)
    await expect(page.getByText(`Pedido nº ${id}`)).toHaveText(`Pedido nº ${id} · Cartão · R$ 497`)
  })

  test('an order of this course can be reopened by its number', async ({ page }) => {
    await signIn(page)
    await page.goto('/cursos/frontend-com-react/comprar?pedido=K7M2Q9XA')
    await expect(page.getByRole('heading', { level: 2, name: 'Pronto, o curso é seu' })).toBeVisible()
    await expect(page.getByText('Pedido nº K7M2Q9XA')).toHaveText('Pedido nº K7M2Q9XA · Cartão · R$ 597')
    await expect(page.getByRole('link', { name: 'Assistir à primeira aula' })).toHaveAttribute(
      'href',
      '/aprender/frontend-com-react/pensando-em-componentes',
    )
  })
})

test.describe('a student who owns the course', () => {
  test('is told so, with the way to continue, even with another course\'s order number', async ({ page }) => {
    await signIn(page)
    for (const url of [path, `${path}?pedido=K7M2Q9XA`, `${path}?pedido=NAOEXISTE`]) {
      await page.goto(url)
      await expect(page.getByRole('heading', { level: 2, name: 'Você já tem este curso' })).toBeVisible()
      await expect(page.getByText('Não precisa comprar de novo: é só continuar.')).toBeVisible()
      await expect(page.getByRole('main').getByRole('link', { name: 'Continuar curso' })).toHaveAttribute('href', `/aprender/${course}`)
      await expect(steps(page)).toHaveText(['Identificação(concluída)', '2Pagamento', '3Pronto'])
      await expect(payButton(page)).toHaveCount(0)
    }
  })

  test('who bought it in the meantime is sent to the course instead of paying twice', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)

    await setCookie(page, 'aulaflix_purchases', jsonCookie.encode({
      [createdAccount.email]: [{ id: 'OUTRAABA', createdAt: '2026-10-01T12:00:00.000Z', method: 'pix', status: 'paid', amount: 447.3, courses: [course] }],
    }))
    await payButton(page).click()

    await expect(page).toHaveURL(firstLesson)
    await expect(page.getByRole('heading', { level: 1, name: 'Como funciona uma requisição HTTP' })).toBeVisible()
    expect(await savedOrders(page, createdAccount.email)).toHaveLength(1)
  })
})

test('journey: a new account buys a course, reaches the first lesson and sees the order', async ({ page }) => {
  await gotoHydrated(page, `/cursos/${course}`)
  await page.getByRole('link', { name: 'Comprar curso' }).first().click()
  await expect(page).toHaveURL(path)

  await page.getByLabel('E-mail').fill('compradora@exemplo.com')
  await page.getByRole('button', { name: 'Continuar', exact: true }).click()
  await page.getByLabel('Nome').fill('Clara Compradora')
  await page.getByLabel('Senha', { exact: true }).fill('senha-da-clara')
  await page.getByRole('button', { name: 'Criar conta' }).click()

  await expect(page.getByRole('heading', { level: 2, name: 'Pagamento' })).toBeVisible()
  await payButton(page).click()
  const id = await expectConfirmation(page)

  await page.getByRole('link', { name: 'Assistir à primeira aula' }).click()
  await expect(page).toHaveURL(firstLesson)
  await expect(page.getByRole('heading', { level: 1, name: 'Como funciona uma requisição HTTP' })).toBeVisible()

  await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
  await page.getByRole('menuitem', { name: 'Meus cursos' }).click()
  await expect(page).toHaveURL('/meus-cursos')
  await expect(page.getByRole('main').getByRole('heading', { level: 2, name: 'Backend com Node.js' })).toBeVisible()
  await expect(page.getByRole('main').getByRole('listitem')).toHaveCount(1)

  await page.getByRole('button', { name: 'Abrir menu do usuário' }).click()
  await page.getByRole('menuitem', { name: 'Conta' }).click()
  await page.getByRole('navigation', { name: 'Seções da conta' }).getByRole('link', { name: 'Compras' }).click()
  await expect(page).toHaveURL('/conta/compras')
  const purchase = page.getByRole('main').locator('ul.mt-8 > li').filter({ hasText: `Pedido nº ${id}` })
  await expect(purchase.getByRole('heading', { level: 2 })).toHaveText('Backend com Node.js')
  await expect(purchase).toContainText('Pix')
  await expect(purchase).toContainText('R$ 447,30')
})

for (const width of [1440, 390]) {
  test(`the checkout has no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(path)
    await expect(page.getByLabel('E-mail')).toBeVisible()
    await expectNoHorizontalScroll(page)

    await signInWithCreatedAccount(page)
    await gotoHydrated(page, path)
    await page.getByRole('radio', { name: /^Cartão de crédito/ }).check()
    await payButton(page).click()
    await expect(page.getByText('Confira o número do cartão.')).toBeVisible()
    await expectNoHorizontalScroll(page)

    await fillCard(page)
    await payButton(page).click()
    await expectConfirmation(page)
    await expectNoHorizontalScroll(page)
  })
}
