import argon from 'argon2';

/**
 * * hashes the plain password
 * * uses argon2, bcrypt is broken
 * * https://github.com/kelektiv/node.bcrypt.js/issues/1019#issuecomment-1876443608
 * @param plain plain password
 * @returns {string} digest of the plain password
 */
export const hash = async (plain: string) => argon.hash(plain);

/**
 * * verifies if hash & password are the same
 * * uses argon2, bcrypt is broken
 * * https://github.com/kelektiv/node.bcrypt.js/issues/1019#issuecomment-1876443608
 * @param plain plain text
 * @param digest hash
 * @returns {boolean} true if passwords match
 */
export const verify = async (plain: string, digest: string) =>
  argon.verify(digest, plain);
