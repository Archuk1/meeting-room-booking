import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2, "Назва має містити щонайменше 2 символи"),
  description: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export const addMemberSchema = z.object({
  email: z.string().email("Некоректний email"),
  role: z.enum(["ADMIN", "USER"]).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type AddMemberInput = z.infer<typeof addMemberSchema>;
