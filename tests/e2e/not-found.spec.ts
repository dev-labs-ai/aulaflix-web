import { expect, test } from '@playwright/test'

const unknownPath = '/esta-pagina-nao-existe'

test.describe('404 page', () => {
  test('answers 404 and renders the not-found page inside the header and footer', async ({ page }) => {
    const response = await page.goto(unknownPath)
    expect(response?.status()).toBe(404)

    await expect(page).toHaveTitle('Página não encontrada | Aulaflix')
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Cursos online de backend, frontend, banco de dados, DevOps e IA para desenvolvedores de software. Aprenda no seu ritmo, com acesso vitalício.',
    )

    const main = page.getByRole('main')
    await expect(main.getByText('Erro 404')).toBeVisible()
    await expect(main.getByRole('heading', { level: 1, name: 'Página não encontrada' })).toBeVisible()
    await expect(
      main.getByText(
        'O endereço pode ter mudado ou o conteúdo não existe mais. Confira o link ou siga por um dos caminhos abaixo.',
      ),
    ).toBeVisible()
    await expect(main.getByRole('link', { name: 'Ir para a página inicial' })).toHaveAttribute('href', '/')
    await expect(main.getByRole('link', { name: 'Ver todos os cursos' })).toHaveAttribute('href', '/cursos')

    await expect(page.getByRole('banner')).toBeVisible()
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('"Ir para a página inicial" leads to the home page', async ({ page }) => {
    await page.goto(unknownPath)
    await page.getByRole('main').getByRole('link', { name: 'Ir para a página inicial' }).click()
    await expect(page).toHaveURL('/')
  })

  test('"Ver todos os cursos" leads to the catalog', async ({ page }) => {
    await page.goto(unknownPath)
    await page.getByRole('main').getByRole('link', { name: 'Ver todos os cursos' }).click()
    await expect(page).toHaveURL('/cursos')
  })
})
