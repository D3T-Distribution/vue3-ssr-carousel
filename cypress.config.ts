import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3006',
    specPattern: 'cypress/e2e/**/*.{js,ts}'
  }
});
