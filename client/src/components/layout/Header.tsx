"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutRequest } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { Button } from "@/components/ui/Button";

export function Header() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const mutation = useMutation({
    mutationFn: logoutRequest,
    onSuccess: () => {
      logout();
      router.push("/login");
    },
  });

  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <span className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Meeting Room Booking</span>
      <div className="flex items-center gap-4">
        {user && <span className="text-sm text-zinc-600 dark:text-zinc-400">{user.name}</span>}
        <Button variant="secondary" onClick={() => mutation.mutate()} isLoading={mutation.isPending}>
          Вийти
        </Button>
      </div>
    </header>
  );
}
