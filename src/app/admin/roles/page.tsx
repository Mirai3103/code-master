"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { TbTextPlus as IconTextPlus } from "react-icons/tb";
import { useRoleTable } from "./_components/columns";
import { type DialogType, RoleProvider } from "./_components/context";
import { useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { type Role } from "@/server/schema/role";
import { Button } from "@/app/_components/ui/button";
import { RolesActionDialog } from "./_components/CU-dialog";
import { useRouter } from "next/navigation";
import { RolesDeleteDialog } from "./_components/delete-dialog";
export default function Roles() {
  const [selectedRow, setSelectedRow] = useState<Role | null | undefined>(null);
  const [open, setOpen] = useState<DialogType | null>(null);
  const table = useRoleTable();
  const { push } = useRouter();
  return (
    <RoleProvider value={{ selectedRow, setSelectedRow, open, setOpen }}>
      <div>
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4"></div>
        </Header>
        <Main>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý vai trò
              </h2>
              <p className="text-muted-foreground">
                Quản lý vai trò và quyền hạn của người dùng
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="space-x-1"
                onClick={() => push("/admin/roles/new")}
              >
                <span>Tạo mới</span> <IconTextPlus size={18} />
              </Button>
            </div>
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable table={table} />
          </div>
        </Main>
      </div>

      {open == "delete" && (
        <RolesDeleteDialog
          open={open == "delete"}
          onOpenChange={() => setOpen(null)}
          currentRow={selectedRow as any}
        />
      )}
    </RoleProvider>
  );
}
