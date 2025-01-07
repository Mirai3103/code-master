"use client";
import { DataTable } from "@/components/data-table/data-table";
import {
  TbAlertTriangleFilled as IconAlertTriangleFilled,
  TbCancel as IconCancel,
} from "react-icons/tb";
import { DataTableToolbar } from "@/components/data-table/data-table-toolbar";
import { useLanguageTable } from "./columns";
import type { LanguageOfProblem } from "@/server/service/problem.service";
import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { LuSaveAll as SaveAll } from "react-icons/lu";
import { ConfirmDialog } from "@/components/confirm-dialog";
import _ from "lodash";
import { trpc } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { type Problem } from "@/server/schema/problem.schema";
// Language[];

interface Props {
  languages: LanguageOfProblem[];
  problem: Partial<Problem>;
}
export default function CrudLanguage({ languages, problem }: Props) {
  const languageTable = useLanguageTable(languages);
  return (
    <DataTable
      table={languageTable}
      emptySlot={
        <p className="flex items-center justify-center gap-x-2">
          <IconAlertTriangleFilled size={18} className="text-red-500" />
          Bạn hiện không có trường hợp kiểm thử nào cho thử thách này. Hãy thêm
          ít nhất một trường hợp kiểm thử.
        </p>
      }
    >
      <DataTableToolbar
        table={languageTable}
        extendActionsSlot={
          <Actions table={languageTable} data={languages} problem={problem} />
        }
      />
    </DataTable>
  );
}

function Actions({
  table,
  data,
  problem,
}: {
  table: Table<LanguageOfProblem>;
  data: LanguageOfProblem[];
  problem: Partial<Problem>;
}) {
  const [open, setOpen] = useState(false);

  const { refresh } = useRouter();
  const { mutateAsync } = trpc.problems.updateLanguagesForProblem.useMutation();
  const memoizedRecordsRef = useRef(
    _.memoize((inputData: LanguageOfProblem[]) => {
      return _.keyBy(inputData, "languageId");
    }),
  );
  const handleSubmit = async () => {
    // Transform data into efficient lookup objects
    const oldRecords = memoizedRecordsRef.current(data);
    const newRecords = _.chain(table.getRowModel().flatRows)
      .keyBy((row) => row.original.languageId!)
      .mapValues((row) => row.getIsSelected())
      .value();
    // Find differences between old and new selections
    const changesKeys = _.keys(oldRecords).filter(
      (key) => oldRecords[key]!.isInProblem !== newRecords[key],
    );
    console.log(changesKeys);

    // Categorize changes
    const needRemove = _.filter(changesKeys, (key) => !newRecords[key]);
    const needAdd = _.filter(changesKeys, (key) => newRecords[key]);
    console.log(needAdd, needRemove);

    // Skip if no changes
    if (_.isEmpty(needAdd) && _.isEmpty(needRemove)) {
      setOpen(false);
      table.resetRowSelection();
      return;
    }
    // todo: update database
    const payload = {
      problemId: problem.problemId!,
      removeLanguage: needRemove.map((id) => ({
        languageId: parseInt(id),
      })),
      addLanguage: needAdd.map((id) => ({
        languageId: parseInt(id + ""),
        timeLimit: problem.timeLimit?.toNumber(),
        memoryLimit: problem.memoryLimit?.toNumber(),
      })),
    };
    await mutateAsync(payload);
    setOpen(false);
    table.resetRowSelection();
    toast({
      title: "Thành công",
      description: "Cập nhật danh sách ngôn ngữ lập trình thành công",
    });
    setTimeout(() => {
      refresh();
    }, 500);
  };

  return (
    <>
      <div className="flex gap-x-2">
        <Button variant="outline" onClick={() => refresh()}>
          <IconCancel className="mr-2 h-4 w-4" />
          Huỷ thay đổi
        </Button>
        <Button variant="default" onClick={() => setOpen(true)}>
          <SaveAll className="mr-2 h-4 w-4" />
          Lưu tất cả
        </Button>
      </div>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        handleConfirm={handleSubmit}
        title={<span>Bạn có chắc chắn muốn lưu tất cả thay đổi?</span>}
        desc={
          <p className="text-muted-foreground">
            Hành động này sẽ thay đổi danh sách ngôn ngữ lập trình được sử dụng
            của bài toán.
          </p>
        }
        confirmText="Lưu"
        cancelBtnText="Hủy"
      />
    </>
  );
}
