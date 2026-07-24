import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  email: z.string().email("Некоректний email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

export const loginSchema = z.object({
  email: z.string().email("Некоректний email"),
  password: z.string().min(1, "Пароль обов'язковий"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
