"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, type AddMemberFormValues } from "@/validations/member.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface AddMemberFormProps {
  onSubmit: (values: AddMemberFormValues) => void;
  isSubmitting?: boolean;
}

export function AddMemberForm({ onSubmit, isSubmitting }: AddMemberFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddMemberFormValues>({ resolver: zodResolver(addMemberSchema) });

  return (
    <form
      className="flex flex-wrap items-start gap-3"
      onSubmit={handleSubmit((values) => {
        onSubmit(values);
        reset();
      })}
    >
      <div className="min-w-48 flex-1">
        <Input placeholder="email@example.com" error={errors.email?.message} {...register("email")} />
      </div>
      <select
        className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        defaultValue="USER"
        {...register("role")}
      >
        <option value="USER">User</option>
        <option value="ADMIN">Admin</option>
      </select>
      <Button type="submit" isLoading={isSubmitting}>
        Додати
      </Button>
    </form>
  );
}
