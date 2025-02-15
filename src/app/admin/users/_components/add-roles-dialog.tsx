import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import { trpc } from "@/trpc/react";
import ChooseRoles from "../../_components/ChooseRoles";
import { User } from "@prisma/client";

interface IAddRoleToUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: Partial<User>;
}
export default function AddRoleToUserModal({
  isOpen,
  onOpenChange,
  user,
}: IAddRoleToUserModalProps) {
  const { data } = trpc.users.getUserRoleIds.useQuery(
    { userId: user.id! },
    { enabled: isOpen && !!user.id },
  );
  const { mutateAsync } = trpc.users.addRoleToUser.useMutation();
  const onSubmit = async (roleIds: string[]) => {
    await mutateAsync({ userId: user.id!, roleIds });
    onOpenChange(false);
  };
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Đăng nhập</DialogTitle>
        </DialogHeader>
        <ChooseRoles onSubmit={onSubmit} onCancel={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
