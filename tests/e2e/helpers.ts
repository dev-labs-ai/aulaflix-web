import { expect, type Page } from '@playwright/test'

/**
 * Opens a page and waits for the network to settle, so the app has hydrated before the test uses
 * something that needs JavaScript. A click before hydration does nothing, which the Nuxt dev server makes likely.
 */
export function gotoHydrated(page: Page, path: string) {
  return page.goto(path, { waitUntil: 'networkidle' })
}

export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}
