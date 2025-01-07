"use client";
import { DataTable } from "@/components/data-table/data-table";
import { useTestcaseTable } from "./columns";
import {
  TbAlertTriangle as IconAlertTriangle,
  TbAlertTriangleFilled as IconAlertTriangleFilled,
} from "react-icons/tb";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { LuTrash2 as Trash2 } from "react-icons/lu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import React from "react";
import { trpc } from "@/trpc/react";
import { useRouter } from "next/navigation";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { TestCase } from "@/server/schema/testcase.schema";
// TestCase[];

interface Props {
  testcases: TestCase[];
}
export default function CrudTestcase({ testcases }: Props) {
  const testcaseTable = useTestcaseTable(testcases);
  return (
    <DataTable
      table={testcaseTable}
      emptySlot={
        <p className="flex items-center justify-center gap-x-2">
          <IconAlertTriangleFilled size={18} className="text-red-500" />
          Bạn hiện không có trường hợp kiểm thử nào cho thử thách này. Hãy thêm
          ít nhất một trường hợp kiểm thử.
        </p>
      }
    >
      <DataTableToolbar
        table={testcaseTable}
        extendActionsSlot={<BulkActions table={testcaseTable} />}
      />
    </DataTable>
  );
}

function BulkActions({ table }: { table: Table<TestCase> }) {
  const [dialog, setDialog] = React.useState<
    "deleteSelected" | "deleteAll" | null | undefined
  >();

  const { mutateAsync: clearAllTestcaseAsync } =
    trpc.testcases.clearTestcases.useMutation();
  const { mutateAsync: clearSelectedTestcaseAsync } =
    trpc.testcases.bulkDeleteTestcases.useMutation();
  const { refresh } = useRouter();
  const handleSubmit = async () => {
    if (dialog === "deleteAll") {
      const problemId = table.getCoreRowModel().rows?.[0]?.original?.problemId;
      if (!problemId) return;
      await clearAllTestcaseAsync({ problemId: problemId });
    } else if (dialog === "deleteSelected") {
      const selectedIds = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original.testCaseId);
      await clearSelectedTestcaseAsync(selectedIds);
      table.resetRowSelection();
    }
    setTimeout(() => {
      refresh();
    }, 400);
    setDialog(null);
  };

  return (
    <>
      <div className="flex gap-x-2">
        {table.getIsSomeRowsSelected() && (
          <Button
            variant="destructive"
            onClick={() => setDialog("deleteSelected")}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Xóa được chọn
          </Button>
        )}
        <Button variant="destructive" onClick={() => setDialog("deleteAll")}>
          <Trash2 className="mr-2 h-4 w-4" />
          Xóa hết
        </Button>
      </div>
      <ConfirmDialog
        open={dialog != null}
        onOpenChange={(open) => !open && setDialog(null)}
        handleConfirm={handleSubmit}
        title={
          <span className="text-destructive">
            <IconAlertTriangle
              className="mr-1 inline-block stroke-destructive"
              size={18}
            />{" "}
            {dialog === "deleteAll" &&
              " Xác nhận xoá tất cả testcases của bài toán"}
            {dialog === "deleteSelected" &&
              " Xác nhận xoá các testcases đã chọn"}
          </span>
        }
        desc={
          <div className="space-y-4">
            <p className="mb-2">
              {dialog === "deleteAll" &&
                "Bạn có chắc chắn muốn xoá tất cả các testcases của bài toán?"}
              {dialog === "deleteSelected" &&
                "Bạn có chắc chắn muốn xoá các testcases đã chọn?"}
              <br />
              Hành động này sẽ không thể hoàn tác.
            </p>
          </div>
        }
        confirmText="Xóa"
        cancelBtnText="Hủy"
        destructive
      />
    </>
  );
}
