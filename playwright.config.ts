import { defineConfig } from '@playwright/test';

// Tests run against a production-like build (TODOs visible, a dummy Web3Forms key; the network call to
// Web3Forms is always mocked in tests).
export default defineConfig({
  testDir: 'tests',
  fullyParallel: true,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4400',
    channel: process.env.CI ? undefined : 'chrome',
  },
  webServer: {
    command:
      'BASE_PATH= PUBLIC_SHOW_TODOS=true PUBLIC_WEB3FORMS_KEY=test-key npx astro build && node scripts/serve.mjs 4400',
    url: 'http://localhost:4400/',
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
