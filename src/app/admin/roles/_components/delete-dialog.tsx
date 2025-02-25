import { TbAlertTriangle as IconAlertTriangle } from "react-icons/tb";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { type Role } from "@/server/schema/role";
import { trpc } from "@/trpc/react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Role;
}

export function RolesDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { mutateAsync } = trpc.roles.deleteRole.useMutation();
  const utils = trpc.useUtils();
  const handleDelete = async () => {
    onOpenChange(false);
    await mutateAsync({ roleId: currentRow.roleId });
    utils.roles.getRoles.invalidate();
    toast.success(`Vai trò ${currentRow.roleName} đã được xóa`);
  };

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className="text-destructive">
          <IconAlertTriangle
            className="mr-1 inline-block stroke-destructive"
            size={18}
          />{" "}
          Xác nhận xóa Vai trò
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Bạn có chắc chắn muốn xóa Vai trò{" "}
            <span className="font-bold">{currentRow?.roleName}</span>
            ?
            <br />
            Hành động này sẽ gỡ Vai trò khỏi tất cả người dùng liên quan. Và
            không thể hoàn tác.
          </p>
        </div>
      }
      confirmText="Xóa Vai trò"
      cancelBtnText="Hủy"
      destructive
    />
  );
}
