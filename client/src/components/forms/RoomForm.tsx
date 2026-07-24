"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRoomSchema, type CreateRoomFormValues } from "@/validations/room.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface RoomFormProps {
  defaultValues?: Partial<CreateRoomFormValues>;
  onSubmit: (values: CreateRoomFormValues) => void;
  isSubmitting?: boolean;
  submitLabel?: string;
}

export function RoomForm({ defaultValues, onSubmit, isSubmitting, submitLabel = "Зберегти" }: RoomFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRoomFormValues>({
    resolver: zodResolver(createRoomSchema),
    defaultValues,
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <Input label="Назва кімнати" error={errors.name?.message} {...register("name")} />
      <Textarea label="Опис" error={errors.description?.message} {...register("description")} />
      <Button type="submit" isLoading={isSubmitting} className="self-start">
        {submitLabel}
      </Button>
    </form>
  );
}
