import "server-only";

import { randomInt } from "node:crypto";

// Sin I, l, 1, O ni 0: la clave se dicta o se copia a mano.
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
const TEMPORARY_LENGTH = 14;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

export function createTemporaryPassword() {
  let password = "";

  for (let index = 0; index < TEMPORARY_LENGTH; index += 1) {
    password += ALPHABET[randomInt(ALPHABET.length)];
  }

  return password;
}

export function isValidPassword(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.length >= PASSWORD_MIN_LENGTH &&
    value.length <= PASSWORD_MAX_LENGTH
  );
}
