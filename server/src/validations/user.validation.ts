import { z } from "zod";

export const searchByEmailSchema = z.object({
  email: z.string().min(1, "email обов'язковий"),
});

export type SearchByEmailInput = z.infer<typeof searchByEmailSchema>;
