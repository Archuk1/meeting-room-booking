import { z } from "zod";

export const createBookingSchema = z
  .object({
    roomId: z.string().min(1, "roomId обов'язковий"),
    title: z.string().min(2, "Назва має містити щонайменше 2 символи"),
    description: z.string().optional(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
  })
  .refine((data) => data.startTime.getTime() < data.endTime.getTime(), {
    message: "Час початку має бути раніше часу завершення",
    path: ["endTime"],
  });

export const updateBookingSchema = z
  .object({
    title: z.string().min(2, "Назва має містити щонайменше 2 символи").optional(),
    description: z.string().optional(),
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return data.startTime.getTime() < data.endTime.getTime();
      }
      return true;
    },
    {
      message: "Час початку має бути раніше часу завершення",
      path: ["endTime"],
    },
  );

export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type UpdateBookingInput = z.infer<typeof updateBookingSchema>;
