import { RxDotsHorizontal as DotsHorizontalIcon } from "react-icons/rx";
import { type Row } from "@tanstack/react-table";
import {
  TbEdit as IconEdit,
  TbToggleLeftFilled as IconToggleLeftFilled,
  TbToggleRightFilled as IconToggleRightFilled,
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
import { useLanguageContext } from "./context";
import { cn } from "@/lib/utils";
import { trpc } from "@/trpc/react";
import { type Language } from "@/server/schema/language.schema";

interface DataTableRowActionsProps {
  row: Row<Language>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setSelectedRow } = useLanguageContext();
  const utils = trpc.useUtils();
  const { mutate } = trpc.languages.toggleDisableLanguage.useMutation({
    onSuccess: () => {
      utils.languages.getLanguages.invalidate();
    },
  });
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
              setSelectedRow(row.original);
              setOpen("edit");
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
            className="text-red-500!"
          >
            Xóa thẻ
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              mutate(row.original.languageId);
              setSelectedRow(null);
            }}
            className={cn(
              row.original.isActive ? "text-yellow-500!" : "text-green-500!",
            )}
          >
            {row.original.isActive ? "Ẩn" : "Hiện"}
            <DropdownMenuShortcut>
              {row.original.isActive ? (
                <IconToggleRightFilled size={16} />
              ) : (
                <IconToggleLeftFilled size={16} />
              )}
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
