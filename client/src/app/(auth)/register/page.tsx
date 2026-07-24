import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { RegisterForm } from "@/components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <Card>
      <h1 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50">Реєстрація</h1>
      <RegisterForm />
      <p className="mt-6 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Вже маєте акаунт?{" "}
        <Link href="/login" className="font-medium text-zinc-900 underline dark:text-zinc-50">
          Увійти
        </Link>
      </p>
    </Card>
  );
}
