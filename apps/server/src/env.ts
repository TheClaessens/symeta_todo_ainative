import { serverEnvSchema } from '@/env.schema';

import 'dotenv/config';

export const env = serverEnvSchema.parse(process.env);
