import { databaseEnvSchema } from './env.schema';

export const env = databaseEnvSchema.parse(process.env);
