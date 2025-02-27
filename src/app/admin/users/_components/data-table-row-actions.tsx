import { RxDotsHorizontal as DotsHorizontalIcon } from "react-icons/rx";
import { type Row } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LuPencil, LuShield, LuEye, LuEyeOff } from "react-icons/lu";
import { useUserContext } from "./context";
import { trpc } from "@/trpc/react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { type User } from "@/server/schema/user.schema";
interface DataTableRowActionsProps {
  row: Row<User>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setSelectedRow } = useUserContext();
  const utils = trpc.useUtils();
  // const { mutate } = trpc.users.togglePublicUser.useMutation({
  //   onSuccess: () => {
  //     utils.users.getUsers.invalidate();
  //   },
  // });
  const { push } = useRouter();
  return (
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
            push(`/admin/users/${row.original.id}`);
          }}
        >
          Sửa thông tin
          <DropdownMenuShortcut>
            <LuPencil size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setSelectedRow(row.original);
            setOpen("permission");
          }}
          className="text-blue-500!"
        >
          Phân quyền
          <DropdownMenuShortcut>
            <LuShield size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setSelectedRow(null);
            // mutate(row.original.id);
          }}
          className={cn(
            row.original.emailVerified ? "text-yellow-500!" : "text-green-500!",
          )}
        >
          {row.original.emailVerified
            ? "Hạn chế tài khoản"
            : "Kích hoạt tài khoản"}
          <DropdownMenuShortcut>
            {row.original.emailVerified ? (
              <LuEyeOff size={16} />
            ) : (
              <LuEye size={16} />
            )}
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
