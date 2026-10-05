import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import { clientEnvSchema, viteToolingEnvSchema } from './src/env.schema';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const loadedEnv = loadEnv(mode, process.cwd());
  process.env = { ...process.env, ...loadedEnv };

  clientEnvSchema.parse(loadedEnv);

  const toolingEnv = viteToolingEnvSchema.parse(loadedEnv);

  return {
    plugins: [react(), tsconfigPaths(), svgr(), tailwindcss()],
    server: {
      port: toolingEnv.PORT,
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        onwarn(warning, warn) {
          if (toolingEnv.SUPPRESS_WARNINGS) {
            if (
              warning.code === 'MODULE_LEVEL_DIRECTIVE' ||
              warning.message.includes(
                `Module level directives cause errors when bundled`
              )
            ) {
              return;
            }
          }
          warn(warning);
        },
      },
    },
  };
});
