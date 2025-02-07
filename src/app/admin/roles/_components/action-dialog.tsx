import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Role } from "@/server/schema/role";
import { trpc } from "@/trpc/react";
import React from "react";

interface Props {
  currentRow?: Role;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RolesEditPermissionDialog({
  currentRow,
  open,
  onOpenChange,
}: Props) {
  const utils = trpc.useUtils();
  const [tab, setTab] = React.useState<"role" | "permission">("role");

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-left">
          <DialogTitle>{"Phân quyền"}</DialogTitle>

          <DialogDescription>
            Nhấn vào nút &quot;Lưu thay đổi&quot; để lưu
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="-mr-4 w-full py-1 pr-4"></ScrollArea>
        <DialogFooter>
          <Button type="submit" form="role-form">
            {/* {(isUpdatingRole || isCreatingRole) && (
              <Loader2 className="animate-spin" />
            )} */}
            Lưu thay đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
