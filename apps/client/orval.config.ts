import { defineConfig } from 'orval';

// config/setup used:
// https://github.com/orval-labs/orval/blob/master/samples/react-query/custom-client/orval.config.ts
export default defineConfig({
  api: {
    input: {
      target: '../server/.generated/schema.json',
    },
    output: {
      client: 'react-query',
      httpClient: 'axios',
      target: './src/api/generated.ts',
      override: {
        mutator: {
          path: './src/api/instance.ts',
          name: 'useCustomAxiosInstance',
        },
      },
    },
  },
});
