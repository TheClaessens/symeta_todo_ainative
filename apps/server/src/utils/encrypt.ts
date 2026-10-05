import crypto, { type BinaryLike, type CipherKey } from 'crypto';
import { z } from 'zod';

import { env } from '@/env';

const schema = z.object({
  iv: z.string(),
  encryptedData: z.string(),
});

const isValid = (encrypted: unknown): encrypted is z.infer<typeof schema> =>
  schema.safeParse(encrypted).success;

// If your ENCRYPTION_KEY is shorter than 32 bytes, you should derive a proper length key
// For AES-256, we need a 32-byte key (256 bits)
const getKey = () => Buffer.from(env.ENCRYPTION_KEY);

// IV (Initialization Vector) should be random and unique per encryption
const generateIV = () => crypto.randomBytes(16);
// Encrypt function
export const encrypt = (text: string) => {
  const iv = generateIV();
  const key = getKey();

  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    key as unknown as CipherKey,
    iv as unknown as BinaryLike
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return IV and encrypted data
  // IV needs to be stored alongside the encrypted data for decryption
  return {
    iv: iv.toString('hex'),
    encryptedData: encrypted,
  };
};

// Decrypt function
export const decrypt = (encrypted: unknown) => {
  if (!isValid(encrypted)) {
    throw new Error('Invalid encrypted data');
  }
  const key = getKey();
  const iv = Buffer.from(encrypted.iv, 'hex');

  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    key as unknown as CipherKey,
    iv as unknown as BinaryLike
  );
  let decrypted = decipher.update(encrypted.encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
};
