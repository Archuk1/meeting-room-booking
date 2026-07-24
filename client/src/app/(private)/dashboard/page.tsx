"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";
import { PageTitle } from "@/components/layout/PageTitle";
import { Card } from "@/components/ui/Card";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <>
      <PageTitle
        title={`Вітаємо${user ? `, ${user.name}` : ""}!`}
        description="Керуйте переговорними кімнатами та бронюваннями"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/rooms">
          <Card className="transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
            <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">Переговорні кімнати</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Перегляд, створення та приєднання до кімнат
            </p>
          </Card>
        </Link>
        <Link href="/bookings">
          <Card className="transition-colors hover:border-zinc-400 dark:hover:border-zinc-600">
            <h2 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50">Бронювання</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Перегляд і редагування ваших бронювань</p>
          </Card>
        </Link>
      </div>
    </>
  );
}
