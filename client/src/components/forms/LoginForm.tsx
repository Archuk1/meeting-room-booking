"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { loginSchema, type LoginFormValues } from "@/validations/login.schema";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

export function LoginForm() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.login);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (user) => {
      setUser(user);
      router.push("/dashboard");
    },
  });

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit((values) => mutation.mutate(values))}>
      {mutation.isError && <ErrorMessage message={mutation.error.message} />}

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...registerField("email")}
      />
      <Input
        label="Пароль"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...registerField("password")}
      />

      <Button type="submit" isLoading={mutation.isPending} className="mt-2">
        Увійти
      </Button>
    </form>
  );
}
