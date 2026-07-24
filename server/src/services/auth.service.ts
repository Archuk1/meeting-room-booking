import prisma from "../db/prisma.js";
import { comparePassword, hashPassword } from "../utils/hash.js";
import { signToken } from "../utils/jwt.js";
import { ConflictError, NotFoundError, UnauthorizedError } from "../utils/errors.js";
import type { LoginInput, RegisterInput } from "../validations/auth.validation.js";

function toSafeUser(user: { id: string; name: string; email: string }) {
  return { id: user.id, name: user.name, email: user.email };
}

export async function register(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new ConflictError("Користувач з таким email вже існує");
  }

  const password = await hashPassword(input.password);
  const user = await prisma.user.create({
    data: { name: input.name, email: input.email, password },
  });

  const token = signToken({ userId: user.id, email: user.email });
  return { user: toSafeUser(user), token };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new UnauthorizedError("Невірний email або пароль");
  }

  const isValid = await comparePassword(input.password, user.password);
  if (!isValid) {
    throw new UnauthorizedError("Невірний email або пароль");
  }

  const token = signToken({ userId: user.id, email: user.email });
  return { user: toSafeUser(user), token };
}

export async function me(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new NotFoundError("Користувача не знайдено");
  }
  return toSafeUser(user);
}
