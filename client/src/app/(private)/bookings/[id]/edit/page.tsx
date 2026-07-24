"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getBooking, updateBooking } from "@/api/booking";
import { PageTitle } from "@/components/layout/PageTitle";
import { BookingForm } from "@/components/forms/BookingForm";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { toDateTimeLocalValue } from "@/lib/utils";

export default function EditBookingPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: booking,
    isPending,
    isError,
    error,
  } = useQuery({ queryKey: ["bookings", id], queryFn: () => getBooking(id) });

  const mutation = useMutation({
    mutationFn: (values: Parameters<typeof updateBooking>[1]) => updateBooking(id, values),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", updated.roomId] });
      router.push("/bookings");
    },
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <>
      <PageTitle title="Редагування бронювання" />
      {mutation.isError && <ErrorMessage message={mutation.error.message} />}
      <BookingForm
        defaultValues={{
          title: booking.title,
          description: booking.description ?? undefined,
          startTime: toDateTimeLocalValue(booking.startTime),
          endTime: toDateTimeLocalValue(booking.endTime),
        }}
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
