import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['backend/tests/**/*.test.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', 'SOFTWARE_TESTING_SUBMISSION/**'],
  },
});
