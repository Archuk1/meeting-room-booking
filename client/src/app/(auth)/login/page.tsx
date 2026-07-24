import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/forms/LoginForm";

export default function LoginPage() {
  return (
    <Card>
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Вхід у систему</h1>
      <LoginForm />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Немає акаунту?{" "}
        <Link href="/register" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          Зареєструватись
        </Link>
      </p>
    </Card>
  );
}
