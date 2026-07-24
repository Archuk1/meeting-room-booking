import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Ім'я має містити щонайменше 2 символи"),
  email: z.email("Некоректний email"),
  password: z.string().min(6, "Пароль має містити щонайменше 6 символів"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
