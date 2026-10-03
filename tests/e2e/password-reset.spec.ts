import { expect, test, type Page } from '@playwright/test'
import { expectNoHorizontalScroll, gotoHydrated, signIn } from './helpers'

const path = '/redefinir-senha'
const email = 'maria@exemplo.com'

const card = (page: Page, name: string) => page.getByRole('region', { name })
const codeInput = (page: Page) => page.getByLabel('Código de 6 dígitos')
/** The six boxes drawn under the code input. */
const codeBoxes = (page: Page) => page.locator('#password-code + [aria-hidden="true"] > div')
const submit = (page: Page) => page.getByRole('button', { name: 'Salvar e entrar' })
const newPassword = (page: Page) => page.getByLabel('Nova senha', { exact: true })
const confirmPassword = (page: Page) => page.getByLabel('Repita a nova senha')

/** Goes through the email step to the new-password step. */
async function requestCode(page: Page) {
  await gotoHydrated(page, path)
  await page.getByLabel('E-mail').fill(email)
  await page.getByRole('button', { name: 'Receber código' }).click()
  await expect(page.getByRole('heading', { level: 1, name: 'Defina uma nova senha' })).toBeVisible()
}

test.use({ viewport: { width: 1440, height: 900 } })

test.describe('password reset, email step', () => {
  test('asks for the email, outside the site header and footer', async ({ page }) => {
    const response = await page.goto(path)
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle('Redefinir senha | Aulaflix')
    await expect(page.getByRole('banner')).toHaveCount(0)
    await expect(page.getByRole('contentinfo')).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Aulaflix, página inicial' })).toHaveAttribute('href', '/')

    await expect(page.getByRole('button', { name: 'Voltar' })).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Recuperar acesso')
    const form = card(page, 'Recuperar acesso')
    await expect(form.getByLabel('E-mail')).toHaveAttribute('type', 'email')
    await expect(form.getByLabel('E-mail')).toHaveAttribute('placeholder', 'seu@email.com')
    await expect(form.getByLabel('E-mail')).toHaveAttribute('autocomplete', 'email')
    await expect(form.getByRole('button', { name: 'Receber código' })).toBeEnabled()
  })

  test('"Voltar" goes to the sign-in page', async ({ page }) => {
    await gotoHydrated(page, path)
    await page.getByRole('button', { name: 'Voltar' }).click()
    await expect(page).toHaveURL('/entrar')
    await expect(page.getByRole('heading', { level: 1, name: 'Entre ou crie sua conta' })).toBeVisible()
  })

  test('validates the email', async ({ page }) => {
    await gotoHydrated(page, path)
    const field = page.getByLabel('E-mail')

    await page.getByRole('button', { name: 'Receber código' }).click()
    await expect(page.getByText('Digite seu e-mail.')).toBeVisible()
    await expect(field).toHaveAttribute('aria-invalid', 'true')
    await expect(field).toHaveAccessibleDescription('Digite seu e-mail.')

    // After the first submit, the error follows what is typed.
    await field.fill('maria@')
    await expect(page.getByText('Esse e-mail não parece válido.')).toBeVisible()
    await field.fill(email)
    await expect(page.getByText('Esse e-mail não parece válido.')).toHaveCount(0)
    await expect(field).not.toHaveAttribute('aria-invalid')
  })

  test('shows an email error once the field loses focus', async ({ page }) => {
    await gotoHydrated(page, path)
    const field = page.getByLabel('E-mail')

    await field.fill('maria@')
    await expect(page.getByText('Esse e-mail não parece válido.')).toHaveCount(0)
    await field.blur()
    await expect(page.getByText('Esse e-mail não parece válido.')).toBeVisible()
  })

  test('"Receber código" waits for the simulated request, then asks for the code', async ({ page }) => {
    await gotoHydrated(page, path)
    await page.getByLabel('E-mail').fill(`  ${email} `)
    await page.getByRole('button', { name: 'Receber código' }).click()
    await expect(page.getByRole('button', { name: 'Receber código' })).toBeDisabled()

    await expect(page.getByRole('heading', { level: 1, name: 'Defina uma nova senha' })).toBeVisible()
    await expect(page).toHaveURL(path)
  })
})

test.describe('password reset, new-password step', () => {
  test('asks for the code and the new password', async ({ page }) => {
    await requestCode(page)

    const body = page.getByText(`Digite o código que mandamos para ${email} e escolha a nova senha.`)
    await expect(body).toBeVisible()
    await expect(body.locator('strong')).toHaveText(email)
    await expect(page.getByRole('button', { name: 'Voltar' })).toBeVisible()

    const form = card(page, 'Defina uma nova senha')
    await expect(form.getByText('Código', { exact: true })).toBeVisible()
    await expect(codeBoxes(page)).toHaveCount(6)
    await expect(codeBoxes(page)).toHaveText(['', '', '', '', '', ''])
    await expect(newPassword(page)).toHaveAttribute('type', 'password')
    await expect(newPassword(page)).toHaveAttribute('autocomplete', 'new-password')
    await expect(newPassword(page)).toHaveAccessibleDescription('Mínimo de 8 caracteres.')
    await expect(confirmPassword(page)).toHaveAttribute('type', 'password')
    await expect(confirmPassword(page)).toHaveAttribute('autocomplete', 'new-password')
    await expect(form.getByRole('button', { name: 'Mostrar senha' })).toHaveCount(2)
    await expect(submit(page)).toBeDisabled()

    await expect(page.getByText('Não recebeu? Procure também na caixa de spam.')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Pedir outro código em 1:00' })).toBeDisabled()
  })

  test('"Voltar" returns to the email step with the email kept', async ({ page }) => {
    await requestCode(page)
    await page.getByRole('button', { name: 'Voltar' }).click()

    await expect(page.getByRole('heading', { level: 1, name: 'Recuperar acesso' })).toBeVisible()
    await expect(page.getByLabel('E-mail')).toHaveValue(email)
  })

  test('the code input takes digits only, up to six', async ({ page }) => {
    await requestCode(page)
    const input = codeInput(page)

    await expect(input).toHaveAttribute('inputmode', 'numeric')
    await expect(input).toHaveAttribute('pattern', '[0-9]*')
    await expect(input).toHaveAttribute('maxlength', '6')

    await input.pressSequentially('12ab3')
    await expect(input).toHaveValue('123')
    await expect(codeBoxes(page)).toHaveText(['1', '2', '3', '', '', ''])
    await expect(submit(page)).toBeDisabled()

    await input.pressSequentially('4567')
    await expect(input).toHaveValue('123456')
    await expect(codeBoxes(page)).toHaveText(['1', '2', '3', '4', '5', '6'])
    await expect(submit(page)).toBeEnabled()
  })

  test('pasting the code fills every box', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await requestCode(page)

    await page.evaluate(() => navigator.clipboard.writeText('482915'))
    await codeInput(page).press('ControlOrMeta+V')

    await expect(codeInput(page)).toHaveValue('482915')
    await expect(codeBoxes(page)).toHaveText(['4', '8', '2', '9', '1', '5'])
    await expect(submit(page)).toBeEnabled()
  })

  test('takes the one-time code the phone fills in', async ({ page }) => {
    await requestCode(page)
    const input = codeInput(page)

    await expect(input).toHaveAttribute('autocomplete', 'one-time-code')
    // Autofill sets the whole code at once.
    await input.fill('731806')
    await expect(input).toHaveValue('731806')
    await expect(codeBoxes(page)).toHaveText(['7', '3', '1', '8', '0', '6'])
  })

  test('the code input has the focus, marks the next box and selects the code on focus', async ({ page }) => {
    await requestCode(page)
    const input = codeInput(page)
    const box = (index: number) => codeBoxes(page).nth(index)

    await expect(input).toBeFocused()
    await expect(box(0)).toHaveClass(/\bring-2\b/)

    await input.pressSequentially('12')
    await expect(box(2)).toHaveClass(/\bring-2\b/)
    await expect(box(0)).not.toHaveClass(/\bring-2\b/)

    await newPassword(page).focus()
    for (let index = 0; index < 6; index++) await expect(box(index)).not.toHaveClass(/\bring-2\b/)

    await input.focus()
    expect(await input.evaluate((element: HTMLInputElement) => [element.selectionStart, element.selectionEnd])).toEqual([0, 2])
    await input.pressSequentially('9')
    await expect(input).toHaveValue('9')

    await input.pressSequentially('87654')
    // With every box filled, the last one stays marked.
    await expect(box(5)).toHaveClass(/\bring-2\b/)
  })

  test('validates the new password', async ({ page }) => {
    await requestCode(page)
    await codeInput(page).fill('123456')

    await submit(page).click()
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toBeVisible()
    await expect(newPassword(page)).toHaveAttribute('aria-invalid', 'true')
    // The error replaces the hint.
    await expect(newPassword(page)).toHaveAccessibleDescription('A senha precisa de no mínimo 8 caracteres.')
    await expect(page.getByText('Mínimo de 8 caracteres.')).toHaveCount(0)
    await expect(page.getByText('As senhas digitadas são diferentes.')).toHaveCount(0)

    await newPassword(page).fill('nova-senha-1')
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toHaveCount(0)
    await expect(page.getByText('As senhas digitadas são diferentes.')).toBeVisible()
    await expect(confirmPassword(page)).toHaveAttribute('aria-invalid', 'true')

    await confirmPassword(page).fill('nova-senha-1')
    await expect(page.getByText('As senhas digitadas são diferentes.')).toHaveCount(0)
  })

  test('shows a password error once the field loses focus', async ({ page }) => {
    await requestCode(page)

    await newPassword(page).fill('curta')
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toHaveCount(0)
    await newPassword(page).blur()
    await expect(page.getByText('A senha precisa de no mínimo 8 caracteres.')).toBeVisible()

    await confirmPassword(page).fill('outra')
    await confirmPassword(page).blur()
    await expect(page.getByText('As senhas digitadas são diferentes.')).toBeVisible()
  })

  test('the password toggle shows and hides the new password', async ({ page }) => {
    await requestCode(page)
    await newPassword(page).fill('nova-senha-1')
    const toggle = card(page, 'Defina uma nova senha').getByRole('button', { name: 'Mostrar senha' }).first()

    await toggle.click()
    await expect(newPassword(page)).toHaveAttribute('type', 'text')
    await expect(page.getByRole('button', { name: 'Ocultar senha' })).toHaveAttribute('aria-pressed', 'true')
    await page.getByRole('button', { name: 'Ocultar senha' }).click()
    await expect(newPassword(page)).toHaveAttribute('type', 'password')
  })

  test('saving shows the prototype notice and locks the form', async ({ page }) => {
    await requestCode(page)
    await codeInput(page).fill('123456')
    await newPassword(page).fill('nova-senha-1')
    await confirmPassword(page).fill('nova-senha-1')

    await submit(page).click()
    await expect(submit(page)).toBeDisabled()
    await expect(codeInput(page)).toBeDisabled()

    const notice = page.getByRole('status').filter({ hasText: 'Protótipo: senha redefinida.' })
    await expect(notice).toHaveText(
      'Protótipo: senha redefinida. Com o backend conectado, você já entraria na sua conta. Ir para a página inicial',
    )
    await expect(notice.getByRole('link', { name: 'Ir para a página inicial' })).toHaveAttribute('href', '/')
    await expect(codeInput(page)).toBeDisabled()
    await expect(newPassword(page)).toBeDisabled()
    await expect(confirmPassword(page)).toBeDisabled()
    await expect(submit(page)).toBeDisabled()
    await expect(page.getByText('Não recebeu?')).toHaveCount(0)
    await expect(page.getByRole('button', { name: /Pedir outro código/ })).toHaveCount(0)
  })
})

test.describe('password reset, new code', () => {
  test('counts down before another code can be asked for, then sends it', async ({ page }) => {
    await page.clock.install()
    await requestCode(page)
    const countdown = (label: string) => page.getByRole('button', { name: `Pedir outro código em ${label}` })

    await expect(countdown('1:00')).toBeDisabled()
    await page.clock.fastForward('00:01')
    await expect(countdown('0:59')).toBeDisabled()
    await page.clock.fastForward('00:50')
    await expect(countdown('0:09')).toBeDisabled()
    await page.clock.fastForward('00:09')

    const resend = page.getByRole('button', { name: 'Pedir outro código', exact: true })
    await expect(resend).toBeEnabled()
    await codeInput(page).fill('123')
    await resend.click()

    const sent = page.getByRole('status').filter({ hasText: 'Mandamos um novo código para' })
    await expect(sent).toHaveText(`Mandamos um novo código para ${email}.`)
    await expect(sent.locator('strong')).toHaveText(email)
    await expect(codeInput(page)).toHaveValue('')
    await expect(codeBoxes(page)).toHaveText(['', '', '', '', '', ''])
    await expect(countdown('1:00')).toBeDisabled()
  })
})

test('a signed-in student is sent to the home page', async ({ page }) => {
  await signIn(page)
  const response = await page.request.get(path, { maxRedirects: 0 })
  expect(response.status()).toBe(307)
  expect(new URL(response.headers().location!, 'http://localhost').pathname).toBe('/')

  await page.goto(path)
  await expect(page).toHaveURL('/')
})

for (const width of [1440, 390]) {
  test(`has no horizontal scroll at ${width}px on either step`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await gotoHydrated(page, path)
    await expectNoHorizontalScroll(page)

    // A long email overflows the heading at 390px in both apps, as on /entrar (#26).
    await page.getByLabel('E-mail').fill(email)
    await page.getByRole('button', { name: 'Receber código' }).click()
    await expect(page.getByRole('heading', { level: 1, name: 'Defina uma nova senha' })).toBeVisible()
    await expectNoHorizontalScroll(page)
  })
}
