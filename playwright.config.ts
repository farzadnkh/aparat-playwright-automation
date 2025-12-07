import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120 * 1000, // Increase test timeout to 2 minutes
  expect: {
    timeout: 15 * 1000,
  },
  use: {
    baseURL: 'https://www.aparat.com',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15 * 1000,
    navigationTimeout: 60 * 1000, // Increase navigation timeout
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        channel: 'chrome',
        headless: true,
      },
    },
  ],
});
