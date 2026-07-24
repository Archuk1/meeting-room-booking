import { z } from "zod";

export const createRoomSchema = z.object({
  name: z.string().min(2, "Назва має містити щонайменше 2 символи"),
  description: z.string().optional(),
});

export const updateRoomSchema = createRoomSchema.partial();

export type CreateRoomFormValues = z.infer<typeof createRoomSchema>;
export type UpdateRoomFormValues = z.infer<typeof updateRoomSchema>;
