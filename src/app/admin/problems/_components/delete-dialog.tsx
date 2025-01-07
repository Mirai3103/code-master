import { TbAlertTriangle as IconAlertTriangle } from "react-icons/tb";
import { toast } from "@/hooks/use-toast";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { trpc } from "@/trpc/react";
import { type Problem } from "@/server/schema/problem.schema";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentRow: Problem;
}

export function ProblemsDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: Props) {
  const { mutateAsync } = trpc.problems.deleteProblem.useMutation();
  const utils = trpc.useUtils();
  const handleDelete = async () => {
    onOpenChange(false);
    await mutateAsync(currentRow.problemId);
    utils.problems.getProblems.invalidate();
    toast({
      title: `Thẻ ${currentRow.title} đã được xóa`,
    });
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
            <span className="font-bold">{currentRow?.title}</span>
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
