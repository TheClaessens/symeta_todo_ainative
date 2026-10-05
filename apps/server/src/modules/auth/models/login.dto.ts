import { z } from 'zod';

export const loginRequestSchema = z
  .object({
    username: z.string().meta({ description: 'The users email' }),
    password: z.string().meta({ description: 'The users password' }),
  })
  .meta({ id: 'LoginRequest' });

export type LoginRequest = z.infer<typeof loginRequestSchema>;

export const loginResponseSchema = z
  .object({
    access_token: z.string().meta({ description: 'The users access token' }),
    username: z.string().meta({ description: 'The users email' }),
  })
  .meta({ id: 'LoginResponse' });

export type LoginResponse = z.infer<typeof loginResponseSchema>;

const isoDateTimeFromDate = z.preprocess((val) => {
  if (val instanceof Date) {
    return val.toISOString();
  }
  return val;
}, z.iso.datetime());

export const profileResponseSchema = z
  .object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    role: z.string(),
    createdAt: isoDateTimeFromDate,
    updatedAt: isoDateTimeFromDate,
  })
  .meta({ id: 'ProfileResponse' });

export type ProfileResponse = z.infer<typeof profileResponseSchema>;
