import { z } from 'zod';

export const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  ENVIRONMENT: z.enum(['local', 'development', 'qa', 'production']),
  PORT: z.coerce.number().int().positive(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  ENCRYPTION_KEY: z.string().min(1),
  FRONTEND_URL: z.string().url(),
  BACKEND_URL: z.string().url().optional(),
});
export type ServerEnv = z.infer<typeof serverEnvSchema>;
