import { Spinner } from "@/components/ui/Spinner";

export function Loading({ label = "Завантаження..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-zinc-500 dark:text-zinc-400">
      <Spinner size="lg" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
