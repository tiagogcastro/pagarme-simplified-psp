import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const resolveFromRoot = (relativePath: string) =>
  fileURLToPath(new URL(relativePath, import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      '@': resolveFromRoot('./src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/infra/repositories/**',
        'src/**/domain/repositories/**',
        'src/core/logic/**',
        'src/**/errors/**',
        'src/shared/providers/**',
        'src/shared/infra/http/server.ts',
        'src/@types/**',
      ],
    },
  },
});
