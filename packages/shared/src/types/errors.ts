import { ZodError } from 'zod';

export const isError = (error: unknown): error is Error =>
  error instanceof Error;

export const isZodError = (error: unknown): error is ZodError =>
  error instanceof ZodError;
