import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3001',
    video: false,
    screenshotOnRunFailure: true,
    blockHosts: [
      'api.web3modal.org',
      'pulse.walletconnect.org',
      '*.walletconnect.com',
      '*.walletconnect.org'
    ],
    viewportWidth: 1280,
    viewportHeight: 720,
    retries: {
      runMode: 2,
      openMode: 0
    },
    defaultCommandTimeout: 30000,
    requestTimeout: 30000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    env: {
      ISOLATED: true
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  }
});
