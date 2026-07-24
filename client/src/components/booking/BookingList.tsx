import type { Booking } from "@/api/booking";
import { BookingCard } from "./BookingCard";
import { EmptyState } from "@/components/shared/EmptyState";

interface BookingListProps {
  bookings: Booking[];
  currentUserId?: string;
  isRoomAdmin?: boolean;
  onDeleteClick: (booking: Booking) => void;
}

export function BookingList({ bookings, currentUserId, isRoomAdmin, onDeleteClick }: BookingListProps) {
  if (bookings.length === 0) {
    return <EmptyState title="Бронювань ще немає" />;
  }

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          canManage={Boolean(isRoomAdmin) || booking.userId === currentUserId}
          onDeleteClick={() => onDeleteClick(booking)}
        />
      ))}
    </div>
  );
}
