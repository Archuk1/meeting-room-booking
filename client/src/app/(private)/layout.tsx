"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { me } from "@/api/auth";
import { useAuthStore } from "@/store/auth.store";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Container } from "@/components/layout/Container";
import { Loading } from "@/components/shared/Loading";

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const { data, isPending, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: me,
    retry: false,
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser]);

  useEffect(() => {
    if (isError) {
      setUser(null);
      router.replace("/login");
    }
  }, [isError, router, setUser]);

  if (isPending || isError) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loading label="Перевірка авторизації..." />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">
          <Container>{children}</Container>
        </main>
      </div>
    </div>
  );
}
