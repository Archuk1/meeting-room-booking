"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormValues } from "@/validations/booking.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface BookingFormProps {
  defaultValues?: Partial<BookingFormValues>;
  onSubmit: (values: BookingFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function BookingForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "Зберегти" }: BookingFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues,
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Назва" error={errors.title?.message} {...register("title")} />
      <Textarea label="Опис" error={errors.description?.message} {...register("description")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Початок"
          type="datetime-local"
          error={errors.startTime?.message}
          {...register("startTime")}
        />
        <Input
          label="Завершення"
          type="datetime-local"
          error={errors.endTime?.message}
          {...register("endTime")}
        />
      </div>
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
