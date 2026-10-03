import { createHash } from 'node:crypto'
import { expect, test, type Page } from '@playwright/test'
import { demoAccount, expectNoHorizontalScroll, getCookie, gotoHydrated, jsonCookie, longEmail, setCookie, signIn } from './helpers'

/** An account created at sign-up, stored as the reference app stores it. It starts with no orders. */
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

const tabs = (page: Page) => page.getByRole('navigation', { name: 'Seções da conta' })
const accountMenu = (page: Page) => page.getByRole('button', { name: 'Abrir menu do usuário' })
const nameInput = (page: Page) => page.getByRole('textbox', { name: 'Nome' })
const orders = (page: Page) => page.getByRole('main').locator('ul.mt-8 > li')
const order = (page: Page, id: string) => orders(page).filter({ hasText: `Pedido nº ${id}` })

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('account, signed out', () => {
  test('both tabs redirect to sign in, coming back after', async ({ page }) => {
    for (const path of ['/conta', '/conta/compras']) {
      const response = await page.request.get(`${path}?de=email`, { maxRedirects: 0 })
      expect(response.status()).toBe(307)
      expect(response.headers().location).toBe(`/entrar?next=${encodeURIComponent(path)}`)
    }

    await gotoHydrated(page, '/conta/compras')
    await expect(page).toHaveURL('/entrar?next=%2Fconta%2Fcompras')
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
  })
})

test('the old addresses redirect to the account tabs, keeping the query', async ({ page }) => {
  for (const [from, to] of [['/compras', '/conta/compras'], ['/configuracoes', '/conta']]) {
    const response = await page.request.get(from, { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(response.headers().location).toBe(to)

    const withQuery = await page.request.get(`${from}?origem=email`, { maxRedirects: 0 })
    expect(withQuery.status()).toBe(307)
    expect(withQuery.headers().location).toBe(`${to}?origem=email`)
  }

  await signIn(page)
  await page.goto('/compras')
  await expect(page).toHaveURL('/conta/compras')
  await expect(page).toHaveTitle('Compras | Aulaflix')
  await page.goto('/configuracoes')
  await expect(page).toHaveURL('/conta')
  await expect(page).toHaveTitle('Dados da conta | Aulaflix')
})

test.describe('account tabs', () => {
  test('mark the current tab, and switch between the two', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/conta')

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Conta')
    const details = tabs(page).getByRole('link', { name: 'Dados da conta' })
    const purchases = tabs(page).getByRole('link', { name: 'Compras' })
    await expect(tabs(page).getByRole('link')).toHaveText(['Dados da conta', 'Compras'])
    await expect(details).toHaveAttribute('href', '/conta')
    await expect(details).toHaveAttribute('aria-current', 'page')
    await expect(purchases).toHaveAttribute('href', '/conta/compras')
    await expect(purchases).not.toHaveAttribute('aria-current')

    await purchases.click()
    await expect(page).toHaveURL('/conta/compras')
    await expect(page).toHaveTitle('Compras | Aulaflix')
    await expect(purchases).toHaveAttribute('aria-current', 'page')
    await expect(details).not.toHaveAttribute('aria-current')
    await expect(order(page, 'K7M2Q9XA')).toBeVisible()

    await details.click()
    await expect(page).toHaveURL('/conta')
    await expect(page).toHaveTitle('Dados da conta | Aulaflix')
    await expect(details).toHaveAttribute('aria-current', 'page')
    await expect(page.getByText(demoAccount.email)).toBeVisible()
  })

  test('the account menu opens the account page', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/')

    await accountMenu(page).click()
    await page.getByRole('menuitem', { name: 'Conta' }).click()
    await expect(page).toHaveURL('/conta')
    await expect(page.getByRole('heading', { level: 1, name: 'Conta' })).toBeVisible()
  })
})

test.describe('account details', () => {
  test('shows the name, the email and the password row', async ({ page }) => {
    await signIn(page)
    await page.goto('/conta')

    await expect(page).toHaveTitle('Dados da conta | Aulaflix')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', 'Seu nome, e-mail e senha no Aulaflix.')
    await expect(page.getByRole('main')).toHaveText(
      'ContaDados da contaComprasNomeAluno AulaflixEditarE-mailaulaflix@email.comSenhaTrocar senha',
    )
  })

  test('editing the name saves it and shows it in the header', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/conta')

    await page.getByRole('button', { name: 'Editar' }).click()
    await expect(nameInput(page)).toBeFocused()
    await expect(nameInput(page)).toHaveValue(demoAccount.name)
    await nameInput(page).fill('  Maria   da  Silva ')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(nameInput(page)).toHaveCount(0)
    await expect(page.getByRole('main').getByText('Maria da Silva', { exact: true })).toBeVisible()
    await expect(accountMenu(page)).toHaveText('MS')
    expect(await getCookie(page, 'aulaflix_name')).toBe('Maria%20da%20Silva')

    // It stays after a reload.
    await page.reload()
    await expect(page.getByRole('main').getByText('Maria da Silva', { exact: true })).toBeVisible()
  })

  test('an empty or too long name is refused, and cancelling keeps the old one', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/conta')
    await page.getByRole('button', { name: 'Editar' }).click()

    await nameInput(page).fill('   ')
    await page.getByRole('button', { name: 'Salvar' }).click()
    await expect(page.getByText('Digite seu nome.')).toBeVisible()
    await expect(nameInput(page)).toHaveAttribute('aria-invalid', 'true')
    await expect(nameInput(page)).toHaveAccessibleDescription('Digite seu nome.')
    // After the attempt, the field goes back to the saved name, as the reference app's form resets.
    await expect(nameInput(page)).toHaveValue(demoAccount.name)

    await nameInput(page).fill('x'.repeat(81))
    await nameInput(page).press('Enter')
    await expect(page.getByText('Use no máximo 80 caracteres.')).toBeVisible()
    await expect(page.getByText('Digite seu nome.')).toHaveCount(0)

    await page.getByRole('button', { name: 'Cancelar' }).click()
    await expect(nameInput(page)).toHaveCount(0)
    await expect(page.getByText('Use no máximo 80 caracteres.')).toHaveCount(0)
    await expect(page.getByRole('main').getByText(demoAccount.name, { exact: true })).toBeVisible()
    await expect(accountMenu(page)).toHaveText(demoAccount.initials)
    expect(await getCookie(page, 'aulaflix_name')).toBeUndefined()

    // Opening the editor again starts without the old error.
    await page.getByRole('button', { name: 'Editar' }).click()
    await expect(nameInput(page)).not.toHaveAttribute('aria-invalid')
  })

  test('a created account saves its new name too', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await gotoHydrated(page, '/conta')
    await expect(page.getByRole('main').getByText(createdAccount.email)).toBeVisible()

    await page.getByRole('button', { name: 'Editar' }).click()
    await nameInput(page).fill('Ana Lima')
    await page.getByRole('button', { name: 'Salvar' }).click()

    await expect(page.getByRole('main').getByText('Ana Lima', { exact: true })).toBeVisible()
    await expect(accountMenu(page)).toHaveText('AL')
    const raw = await getCookie(page, 'aulaflix_account')
    expect(raw && jsonCookie.decode(raw)).toEqual({ ...createdAccount, name: 'Ana Lima' })
  })

  test('changing the password is simulated, with the same messages', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/conta')

    await page.getByRole('button', { name: 'Trocar senha' }).click()
    const main = page.getByRole('main')
    await expect(main.getByText('Digite o código que mandamos para')).toHaveText(
      'Digite o código que mandamos para aulaflix@email.com e escolha a nova senha.',
    )
    await expect(main.getByRole('textbox', { name: 'Código de 6 dígitos' })).toBeFocused()
    await expect(main.getByText('Pedir outro código em 1:00')).toBeVisible()
    const save = main.getByRole('button', { name: 'Salvar nova senha' })
    await expect(save).toBeDisabled()

    await page.keyboard.type('123456')
    await main.getByLabel('Nova senha', { exact: true }).fill('nova-senha-123')
    await main.getByLabel('Repita a nova senha').fill('outra-senha')
    await save.click()
    await expect(main.getByText('As senhas digitadas são diferentes.')).toBeVisible()

    await main.getByLabel('Repita a nova senha').fill('nova-senha-123')
    await save.click()
    await expect(main.getByText('Protótipo: a senha não foi trocada de verdade. Continue entrando com a senha atual.')).toBeVisible()

    // "Cancelar" closes the form.
    await main.getByRole('button', { name: 'Cancelar' }).click()
    await expect(main.getByRole('button', { name: 'Trocar senha' })).toBeVisible()
    await expect(main.getByText('Protótipo: a senha não foi trocada')).toHaveCount(0)
  })

  // A sign-in test, so it goes through /entrar: the old password must still work.
  test('the password stays the same after changing it', async ({ page }) => {
    await signIn(page)
    await gotoHydrated(page, '/conta')
    await page.getByRole('button', { name: 'Trocar senha' }).click()
    await page.keyboard.type('123456')
    await page.getByLabel('Nova senha', { exact: true }).fill('nova-senha-123')
    await page.getByLabel('Repita a nova senha').fill('nova-senha-123')
    await page.getByRole('button', { name: 'Salvar nova senha' }).click()
    await expect(page.getByText('Protótipo: a senha não foi trocada de verdade.')).toBeVisible()

    await accountMenu(page).click()
    await page.getByRole('menuitem', { name: 'Sair' }).click()
    await expect(page).toHaveURL('/')
    await gotoHydrated(page, '/entrar?next=/conta')
    await page.getByLabel('E-mail').fill(demoAccount.email)
    await page.getByRole('button', { name: 'Continuar', exact: true }).click()
    await page.getByLabel('Senha', { exact: true }).fill('aulaflix')
    await page.getByRole('button', { name: 'Entrar', exact: true }).click()
    await expect(page).toHaveURL('/conta')
    await expect(page.getByRole('heading', { level: 1, name: 'Conta' })).toBeVisible()
  })
})

test.describe('purchases', () => {
  test('the demo account lists its orders, newest first', async ({ page }) => {
    await signIn(page)
    await page.goto('/conta/compras')

    await expect(page).toHaveTitle('Compras | Aulaflix')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Seus pedidos no Aulaflix: pagamentos, valores e cursos incluídos.',
    )
    await expect(orders(page)).toHaveCount(3)
    await expect(orders(page).getByRole('heading', { level: 2 })).toHaveText([
      'Frontend com React',
      'Backend com Node.js',
      'SQL e Modelagem de Dados',
    ])

    const frontend = order(page, 'K7M2Q9XA')
    await expect(frontend.getByText('Pago', { exact: true })).toBeVisible()
    await expect(frontend.getByRole('listitem')).toHaveText(['Cartão', '28 set 2026, 19:42', 'Pedido nº K7M2Q9XA'])
    await expect(frontend).toContainText('R$ 597,00')
    await expect(frontend.getByText('Cursos do pedido')).toHaveCount(0)

    const backend = order(page, 'B4T8N1RE')
    await expect(backend.getByRole('listitem')).toHaveText(['Pix', '15 set 2026, 10:05', 'Pedido nº B4T8N1RE'])
    await expect(backend).toContainText('R$ 447,30')

    const sql = order(page, 'H2V6C3PW')
    await expect(sql.getByRole('listitem')).toHaveText(['Cartão', '22 ago 2026, 21:17', 'Pedido nº H2V6C3PW'])
    await expect(sql).toContainText('R$ 397,00')
  })

  test('an order with several courses lists them, with the installments and the date in Brasília time', async ({ page }) => {
    await setCookie(page, 'aulaflix_purchases', jsonCookie.encode({
      [demoAccount.email]: [{
        id: 'MULTI001',
        createdAt: '2026-10-02T03:10:00.000Z',
        method: 'card',
        status: 'paid',
        amount: 1234.5,
        installments: 3,
        courses: ['devops-na-pratica', 'ia-para-desenvolvedores', 'testes-automatizados'],
      }],
    }))
    await signIn(page)
    await page.goto('/conta/compras')

    await expect(orders(page)).toHaveCount(4)
    const multi = orders(page).first()
    await expect(multi.getByRole('heading', { level: 2 })).toHaveText('3 cursos')
    await expect(multi.getByRole('listitem')).toHaveText(['Cartão em 3x', '2 out 2026, 00:10', 'Pedido nº MULTI001'])
    await expect(multi).toContainText('R$ 1.234,50')
    await expect(multi.getByText('Cursos do pedido')).toBeVisible()
    await expect(multi.getByText('DevOps na Prática, IA para Desenvolvedores e Testes Automatizados.')).toBeVisible()
  })

  test('an account with no orders sees the empty state', async ({ page }) => {
    await signInWithCreatedAccount(page)
    await page.goto('/conta/compras')

    await expect(orders(page)).toHaveCount(0)
    await expect(page.getByText('Nenhuma compra ainda')).toBeVisible()
    await expect(page.getByText('Seus pedidos aparecem aqui depois da primeira compra.')).toBeVisible()
    await expect(page.getByRole('main').getByRole('link', { name: 'Ver todos os cursos' })).toHaveAttribute('href', '/cursos')
  })
})

for (const width of [1440, 390]) {
  test(`the account pages have no horizontal scroll at ${width}px`, async ({ page }) => {
    await signIn(page)
    await page.setViewportSize({ width, height: 900 })

    await page.goto('/conta/compras')
    await expect(orders(page)).toHaveCount(3)
    await expectNoHorizontalScroll(page)

    await gotoHydrated(page, '/conta')
    await page.getByRole('button', { name: 'Trocar senha' }).click()
    await expect(page.getByRole('button', { name: 'Salvar nova senha' })).toBeVisible()
    await expectNoHorizontalScroll(page)
    await page.getByRole('button', { name: 'Editar' }).click()
    await expect(nameInput(page)).toBeVisible()
    await expectNoHorizontalScroll(page)
  })
}

test('a long email wraps without horizontal scroll on mobile when changing the password', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await setCookie(page, 'aulaflix_account', jsonCookie.encode({ ...createdAccount, email: longEmail }))
  await signIn(page, longEmail)
  await gotoHydrated(page, '/conta')
  await page.getByRole('button', { name: 'Trocar senha' }).click()

  await expect(page.getByText(`Digite o código que mandamos para ${longEmail} e escolha a nova senha.`)).toBeVisible()
  await expectNoHorizontalScroll(page)
})
