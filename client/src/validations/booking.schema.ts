import { z } from "zod";

export const bookingSchema = z
  .object({
    title: z.string().min(2, "Назва має містити щонайменше 2 символи"),
    description: z.string().optional(),
    startTime: z.string().min(1, "Вкажіть час початку"),
    endTime: z.string().min(1, "Вкажіть час завершення"),
  })
  .refine((data) => new Date(data.startTime).getTime() < new Date(data.endTime).getTime(), {
    message: "Час початку має бути раніше часу завершення",
    path: ["endTime"],
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
