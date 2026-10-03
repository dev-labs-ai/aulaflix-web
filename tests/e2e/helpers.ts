import { expect, type Page } from '@playwright/test'

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
