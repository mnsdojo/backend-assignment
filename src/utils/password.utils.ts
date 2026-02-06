import { compare, hash } from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashPassword(password: string) {
  return await hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string) {
  return await compare(password, hash);
}
