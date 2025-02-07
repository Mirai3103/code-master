import { RxDotsHorizontal as DotsHorizontalIcon } from "react-icons/rx";
import { type Row } from "@tanstack/react-table";
import { TbEdit as IconEdit, TbTrash as IconTrash } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRoleContext } from "./context";
import { trpc } from "@/trpc/react";
import { type Role } from "@/server/schema/role";
import { useRouter } from "next/navigation";
interface DataTableRowActionsProps {
  row: Row<Role>;
  disabled: boolean;
}

export function DataTableRowActions({
  row,
  disabled = false,
}: DataTableRowActionsProps) {
  const { setOpen, setSelectedRow } = useRoleContext();
  const utils = trpc.useUtils();
  // const { mutate } = trpc.roles.togglePublicRole.useMutation({
  //   onSuccess: () => {
  //     utils.roles.getRoles.invalidate();
  //   },
  // });
  const { push } = useRouter();
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={disabled}
            className="flex h-8 w-8 p-0 disabled:cursor-not-allowed data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem
            onClick={() => {
              setSelectedRow(null);
              push(`/admin/roles/${row.original.roleId}`);
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
              setOpen("permission");
            }}
            className="!text-red-500"
          >
            Phân quyền
            <DropdownMenuShortcut>
              <IconTrash size={16} />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
