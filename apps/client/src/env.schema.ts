import { z } from 'zod';

/** Public client contract — baked into the browser bundle at build time. */
export const clientEnvSchema = z.object({
  VITE_ENVIRONMENT: z.enum(['local', 'development', 'qa', 'production']),
  VITE_BACKEND_URL: z.string().url(),
});

/**
 * Vite CLI / Node tooling only — never exposed to the browser.
 * Validated in vite.config.ts; not required for Docker image builds.
 */
export const viteToolingEnvSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  SUPPRESS_WARNINGS: z
    .enum(['true', 'false'])
    .default('false')
    .transform((value) => value === 'true'),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ViteToolingEnv = z.infer<typeof viteToolingEnvSchema>;
