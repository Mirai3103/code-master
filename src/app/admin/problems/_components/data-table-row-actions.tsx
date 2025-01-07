import { RxDotsHorizontal as DotsHorizontalIcon } from "react-icons/rx";
import { type Row } from "@tanstack/react-table";
import {
  TbEdit as IconEdit,
  TbEyeCheck as IconEyeCheck,
  TbEyeX as IconEyeX,
  TbTrash as IconTrash,
} from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProblemContext } from "./context";
import { trpc } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { type Problem } from "@/server/schema/problem.schema";
interface DataTableRowActionsProps {
  row: Row<Problem>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setSelectedRow } = useProblemContext();
  const utils = trpc.useUtils();
  const { mutate } = trpc.problems.togglePublicProblem.useMutation({
    onSuccess: () => {
      utils.problems.getProblems.invalidate();
    },
  });
  const { push } = useRouter();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setSelectedRow(null);
              push(`/admin/problems/${row.original.problemId}`);
            }}
          >
            Sửa thông tin
            <DropdownMenuShortcut>
              <IconEdit size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              setSelectedRow(row.original);
              setOpen("delete");
            }}
            className="!text-red-500"
          >
            Xóa bài toán
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedRow(null);
              mutate(row.original.problemId);
            }}
            className={cn(
              row.original.isPublic ? "!text-yellow-500" : "!text-green-500",
            )}
          >
            {row.original.isPublic
              ? "Chuyển sang riêng tư"
              : "Chuyển sang công khai"}
            <DropdownMenuShortcut>
              {row.original.isPublic ? (
                <IconEyeX size={16} />
              ) : (
                <IconEyeCheck size={16} />
              )}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
