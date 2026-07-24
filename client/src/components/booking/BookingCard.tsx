import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatDateTime } from "@/lib/utils";
import type { Booking } from "@/api/booking";

interface BookingCardProps {
  booking: Booking;
  canManage: boolean;
  onDeleteClick: () => void;
}

export function BookingCard({ booking, canManage, onDeleteClick }: BookingCardProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-medium text-zinc-900 dark:text-zinc-50">{booking.title}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{booking.room.name}</p>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {formatDateTime(booking.startTime)} — {formatDateTime(booking.endTime)}
          </p>
          {booking.description && (
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{booking.description}</p>
          )}
          <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">Організатор: {booking.user.name}</p>
        </div>
        {canManage && (
          <div className="flex gap-2">
            <Link href={`/bookings/${booking.id}/edit`}>
              <Button variant="secondary">Редагувати</Button>
            </Link>
            <Button variant="danger" onClick={onDeleteClick}>
              Скасувати
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}
