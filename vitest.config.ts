import { defineConfig } from 'vitest/config';

// Tests unitaires uniquement : les specs Playwright (e2e/*.spec.ts) sont
// exécutées par `npx playwright test` et ne doivent pas être collectées
// ici (test.beforeAll de Playwright n'existe pas hors de son runner).
export default defineConfig({
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
