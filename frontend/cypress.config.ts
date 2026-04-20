import { defineConfig } from 'cypress';

export default defineConfig({
  video: true,
  screenshotOnRunFailure: true,
  e2e: {
    baseUrl: 'http://localhost:4280',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.cy.ts'
  }
});
