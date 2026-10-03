import { expect, test, type Page } from '@playwright/test'

/** The demo account, as the reference app's simulated backend knows it. */
export const demoAccount = { name: 'Aluno Aulaflix', email: 'aulaflix@email.com', initials: 'AA' }

/** An email too long for one line at 390px, to check that it wraps instead of scrolling the page sideways. */
export const longEmail = 'uma.pessoa.com.um.endereco.de.email.bem.comprido@exemplo-de-dominio.com.br'

type NuxtRoot = Element & { __vue_app__?: { $nuxt?: { isHydrating?: boolean } } }

/**
 * Opens a page and waits until it can handle a click. Nuxt hydrates after the load event, and Vue drops a
 * click that lands before hydration. The reference app has no #__nuxt root, so there the wait ends at once.
 */
export async function gotoHydrated(page: Page, path: string) {
  const response = await page.goto(path)
  await page.waitForFunction(() => {
    const root = document.querySelector<NuxtRoot>('#__nuxt')
    return !root || root.__vue_app__?.$nuxt?.isHydrating === false
  })
  return response
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

/** Sets a cookie for the app under test; `value` is the raw value, as it travels in the Cookie header. */
export async function setCookie(page: Page, name: string, value: string) {
  await page.context().addCookies([{ name, value, url: test.info().project.use.baseURL }])
}

/** Reads a cookie of the app under test, or `undefined` when it isn't set. */
export async function getCookie(page: Page, name: string) {
  const cookies = await page.context().cookies(test.info().project.use.baseURL)
  return cookies.find(cookie => cookie.name === name)?.value
}

/** Signs in by setting the session cookie, which holds only the account email (ADR 0001). */
export function signIn(page: Page, email = demoAccount.email) {
  return setCookie(page, 'aulaflix_session', email)
}

/** The format of the reference app's data cookies: JSON in base64url. */
export const jsonCookie = {
  encode: (value: unknown) => Buffer.from(JSON.stringify(value), 'utf8').toString('base64url'),
  decode: (raw: string): unknown => JSON.parse(Buffer.from(raw, 'base64url').toString('utf8')),
}
