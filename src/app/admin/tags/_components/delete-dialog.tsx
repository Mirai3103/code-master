import { TbAlertTriangle as IconAlertTriangle } from "react-icons/tb";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { type Tag } from "@/server/schema/tag.schema";
import { trpc } from "@/trpc/react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Tag;
}

export function TagsDeleteDialog({ open, onOpenChange, currentRow }: Props) {
  const { mutateAsync } = trpc.tags.deleteTag.useMutation();
  const utils = trpc.useUtils();
  const handleDelete = async () => {
    onOpenChange(false);
    await mutateAsync(currentRow.tagId);
    utils.tags.getTags.invalidate();
    toast.success(`Thẻ ${currentRow.tagName} đã được xóa`);
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
          Xác nhận xóa thẻ
        </span>
      }
      desc={
        <div className="space-y-4">
          <p className="mb-2">
            Bạn có chắc chắn muốn xóa thẻ{" "}
            <span className="font-bold">{currentRow?.tagName}</span>
            ?
            <br />
            Hành động này sẽ gỡ thẻ khỏi tất cả bài toán liên quan. Và không thể
            hoàn tác.
          </p>
        </div>
      }
      confirmText="Xóa thẻ"
      cancelBtnText="Hủy"
      destructive
    />
  );
}
