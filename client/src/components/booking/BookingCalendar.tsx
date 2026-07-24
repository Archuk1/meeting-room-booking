import type { Booking } from "@/api/booking";
import { BookingList } from "./BookingList";
import { EmptyState } from "@/components/shared/EmptyState";

interface BookingCalendarProps {
  bookings: Booking[];
  currentUserId?: string;
  onDeleteClick: (booking: Booking) => void;
}

const dayFormatter = new Intl.DateTimeFormat("uk-UA", { weekday: "long", day: "numeric", month: "long" });

export function BookingCalendar({ bookings, currentUserId, onDeleteClick }: BookingCalendarProps) {
  if (bookings.length === 0) {
    return <EmptyState title="Бронювань ще немає" />;
  }

  const sorted = [...bookings].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime(),
  );

  const groups = new Map<string, Booking[]>();
  for (const booking of sorted) {
    const key = new Date(booking.startTime).toDateString();
    const group = groups.get(key) ?? [];
    group.push(booking);
    groups.set(key, group);
  }

  return (
    <div className="flex flex-col gap-6">
      {Array.from(groups.entries()).map(([key, dayBookings]) => (
        <div key={key}>
          <h3 className="mb-3 text-sm font-semibold text-zinc-500 dark:text-zinc-400">
            {dayFormatter.format(new Date(key))}
          </h3>
          <BookingList bookings={dayBookings} currentUserId={currentUserId} onDeleteClick={onDeleteClick} />
        </div>
      ))}
    </div>
  );
}
