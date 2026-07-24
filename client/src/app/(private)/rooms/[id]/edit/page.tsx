"use client";

import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRoom, updateRoom } from "@/api/room";
import { PageTitle } from "@/components/layout/PageTitle";
import { RoomForm } from "@/components/forms/RoomForm";
import { Loading } from "@/components/shared/Loading";
import { ErrorMessage } from "@/components/shared/ErrorMessage";

export default function EditRoomPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: room,
    isPending,
    isError,
    error,
  } = useQuery({ queryKey: ["rooms", id], queryFn: () => getRoom(id) });

  const mutation = useMutation({
    mutationFn: (values: { name?: string; description?: string }) => updateRoom(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({ queryKey: ["rooms", id] });
      router.push(`/rooms/${id}`);
    },
  });

  if (isPending) return <Loading />;
  if (isError) return <ErrorMessage message={error.message} />;

  return (
    <>
      <PageTitle title="Редагування кімнати" />
      {mutation.isError && <ErrorMessage message={mutation.error.message} />}
      <RoomForm
        defaultValues={{ name: room.name, description: room.description ?? undefined }}
        onSubmit={(values) => mutation.mutate(values)}
        isSubmitting={mutation.isPending}
      />
    </>
  );
}
