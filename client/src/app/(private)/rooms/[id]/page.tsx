"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addMember, deleteRoom, getRoom, joinRoom } from "@/api/room";
import { createBooking, deleteBooking, type Booking } from "@/api/booking";
import type { BookingFormValues } from "@/validations/booking.schema";
import { useAuthStore } from "@/store/auth.store";
import { PageTitle } from "@/components/layout/PageTitle";
import { RoomDetails } from "@/components/room/RoomDetails";
import { RoomMembers } from "@/components/room/RoomMembers";
import { BookingList } from "@/components/booking/BookingList";
import { BookingForm } from "@/components/forms/BookingForm";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";

export default function RoomDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isBookingModalOpen, setBookingModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<Booking | null>(null);

  const {
    data: room,
    isPending,
    isError,
    error,
  } = useQuery({ queryKey: ["rooms", id], queryFn: () => getRoom(id) });

  const membership = room?.members.find((member) => member.userId === currentUser?.id);
  const isAdmin = membership?.role === "ADMIN";
  const isMember = Boolean(membership);

  function invalidateRoom() {
    queryClient.invalidateQueries({ queryKey: ["rooms", id] });
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
  }

  const deleteMutation = useMutation({
    mutationFn: () => deleteRoom(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.push("/rooms");
    },
  });

  const joinMutation = useMutation({
    mutationFn: () => joinRoom(id),
    onSuccess: invalidateRoom,
  });

  const addMemberMutation = useMutation({
    mutationFn: (values: Parameters<typeof addMember>[1]) => addMember(id, values),
    onSuccess: invalidateRoom,
  });

  const createBookingMutation = useMutation({
    mutationFn: (values: BookingFormValues) => createBooking({ ...values, roomId: id }),
    onSuccess: () => {
      invalidateRoom();
      setBookingModalOpen(false);
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: (bookingId: string) => deleteBooking(bookingId),
    onSuccess: () => {
      invalidateRoom();
      setBookingToDelete(null);
    },
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <>
      <PageTitle
        title={room.name}
        action={
          !isMember && (
            <Button onClick={() => joinMutation.mutate()} isLoading={joinMutation.isPending}>
              Приєднатись
            </Button>
          )
        }
      />

      {joinMutation.isError && <ErrorMessage message={joinMutation.error.message} />}

      <Card className="mb-6">
        <RoomDetails room={room} isAdmin={isAdmin} onDeleteClick={() => setDeleteOpen(true)} />
      </Card>

      <Card className="mb-6">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Учасники</h2>
        {addMemberMutation.isError && <ErrorMessage message={addMemberMutation.error.message} />}
        <RoomMembers
          members={room.members}
          isAdmin={isAdmin}
          onAddMember={(values) => addMemberMutation.mutate(values)}
          isAddingMember={addMemberMutation.isPending}
        />
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Бронювання</h2>
          {isMember && <Button onClick={() => setBookingModalOpen(true)}>Забронювати</Button>}
        </div>
        <BookingList
          bookings={room.bookings}
          currentUserId={currentUser?.id}
          isRoomAdmin={isAdmin}
          onDeleteClick={setBookingToDelete}
        />
      </Card>

      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        title="Нове бронювання"
      >
        {createBookingMutation.isError && <ErrorMessage message={createBookingMutation.error.message} />}
        <BookingForm
          onSubmit={(values) => createBookingMutation.mutate(values)}
          isSubmitting={createBookingMutation.isPending}
          submitLabel="Забронювати"
        />
      </Modal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Видалити кімнату?"
        description="Цю дію неможливо скасувати. Усі бронювання цієї кімнати також будуть видалені."
        confirmLabel="Видалити"
        isConfirming={deleteMutation.isPending}
        onConfirm={() => deleteMutation.mutate()}
        onClose={() => setDeleteOpen(false)}
      />

      <ConfirmDialog
        isOpen={bookingToDelete !== null}
        title="Скасувати бронювання?"
        description={bookingToDelete ? `«${bookingToDelete.title}» буде видалено.` : undefined}
        confirmLabel="Скасувати бронювання"
        isConfirming={deleteBookingMutation.isPending}
        onConfirm={() => bookingToDelete && deleteBookingMutation.mutate(bookingToDelete.id)}
        onClose={() => setBookingToDelete(null)}
      />
    </>
  );
}
