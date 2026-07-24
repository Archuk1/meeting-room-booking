import type { RoomMember } from "@/api/room";
import type { AddMemberFormValues } from "@/validations/member.schema";
import { Badge } from "@/components/ui/Badge";
import { AddMemberForm } from "@/components/forms/AddMemberForm";

interface RoomMembersProps {
  members: RoomMember[];
  isAdmin: boolean;
  onAddMember: (values: AddMemberFormValues) => void;
  isAddingMember?: boolean;
}

export function RoomMembers({ members, isAdmin, onAddMember, isAddingMember }: RoomMembersProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {members.map((member) => (
          <li
            key={member.id}
            className="flex items-center justify-between rounded-md border border-zinc-200 px-3 py-2 text-sm dark:border-zinc-800"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{member.user.name}</p>
              <p className="text-zinc-500 dark:text-zinc-400">{member.user.email}</p>
            </div>
            <Badge variant={member.role === "ADMIN" ? "success" : "default"}>{member.role}</Badge>
          </li>
        ))}
      </ul>
      {isAdmin && <AddMemberForm onSubmit={onAddMember} isSubmitting={isAddingMember} />}
    </div>
  );
}
