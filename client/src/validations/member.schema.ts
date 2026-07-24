import { z } from "zod";

export const addMemberSchema = z.object({
  email: z.email("Некоректний email"),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export type AddMemberFormValues = z.infer<typeof addMemberSchema>;
