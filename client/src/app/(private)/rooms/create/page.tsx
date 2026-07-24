"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRoom } from "@/api/room";
import { PageTitle } from "@/components/layout/PageTitle";
import { RoomForm } from "@/components/forms/RoomForm";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

export default function CreateRoomPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createRoom,
    onSuccess: (room) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      router.push(`/rooms/${room.id}`);
    },
  });

  return (
    <>
      <PageTitle title="Нова кімната" />
      {mutation.isError && <ErrorMessage message={mutation.error.message} />}
      <RoomForm
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
        submitLabel="Створити"
      />
    </>
  );
}
