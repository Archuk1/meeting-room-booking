"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteBooking, getBookings, type Booking } from "@/api/booking";
import { useAuthStore } from "@/store/auth.store";
import { PageTitle } from "@/components/layout/PageTitle";
import { BookingCalendar } from "@/components/booking/BookingCalendar";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const {
    data: bookings,
    isPending,
    isError,
    error,
  } = useQuery({ queryKey: ["bookings"], queryFn: () => getBookings() });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBooking(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      setBookingToDelete(null);
    },
  });

  return (
    <>
      <PageTitle title="Бронювання" description="Усі бронювання переговорних кімнат" />
      {isPending && <Loading />}
      {isError && <ErrorMessage message={error.message} />}
      {bookings && (
        <BookingCalendar bookings={bookings} currentUserId={currentUser?.id} onDeleteClick={setBookingToDelete} />
      )}

      <ConfirmDialog
        isOpen={bookingToDelete !== null}
        title="Скасувати бронювання?"
        description={bookingToDelete ? `«${bookingToDelete.title}» буде видалено.` : undefined}
        confirmLabel="Скасувати бронювання"
        isConfirming={deleteMutation.isPending}
        onConfirm={() => bookingToDelete && deleteMutation.mutate(bookingToDelete.id)}
        onClose={() => setBookingToDelete(null)}
      />
    </>
  );
}
