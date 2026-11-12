import { defineConfig } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'node:path'

dotenv.config({
  path: [path.resolve(__dirname, '.env'), path.resolve(__dirname, '..', '.env')],
})

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'API tests',
    },
  ],
})
