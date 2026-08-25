import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/shared/infra/http/server.ts'],
  format: ['esm'],
  target: 'node22',
  sourcemap: true,
  clean: true,
});
