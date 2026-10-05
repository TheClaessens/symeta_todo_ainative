import { clientEnvSchema } from './env.schema';

export const env = clientEnvSchema.parse(import.meta.env);
