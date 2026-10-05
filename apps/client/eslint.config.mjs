import config from '@faktion-com/eslint-config/react';
import query from '@tanstack/eslint-plugin-query';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'src/api/generated.ts',
      'src/api/generated.schemas.ts',
    ],
  },
  {
    plugins: {
      '@tanstack/query': query,
    },
    rules: {
      'no-process-env': 'off',
    },
  },
];
