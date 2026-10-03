import { defineConfig, devices } from '@playwright/test'

// The suite runs against this app on 3001 by default, or against an app already running elsewhere through BASE_URL.
const baseURL = process.env.BASE_URL ?? 'http://localhost:3001'

export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Without BASE_URL, serve this app's production build, or reuse a dev server already on 3001.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'node .output/server/index.mjs',
        port: 3001,
        env: { PORT: '3001' },
        reuseExistingServer: !process.env.CI,
      },
})
