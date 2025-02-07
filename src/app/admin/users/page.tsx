"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";

import { useUserTable } from "./_components/columns";
import { type DialogType, UserProvider } from "./_components/context";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { type User } from "@/server/schema/user.schema";
import { UsersEditPermissionDialog } from "./_components/action-dialog";
export default function Users() {
  const [selectedRow, setSelectedRow] = useState<User | null | undefined>(null);
  const [open, setOpen] = useState<DialogType | null>(null);
  const { push } = useRouter();
  const table = useUserTable();
  return (
    <UserProvider value={{ selectedRow, setSelectedRow, open, setOpen }}>
      <div>
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4"></div>
        </Header>
        <Main>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý người dùng
              </h2>
              <p className="text-muted-foreground">
                Quản lý người dùng trong hệ thống
              </p>
            </div>
            {/* <div className="flex gap-2">
              <Button
                className="space-x-1"
                onClick={() => push("/admin/users/new")}
              >
                <span>Thêm bài toán</span> <IconTextPlus size={18} />
              </Button>
            </div> */}
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable table={table} />
          </div>
        </Main>
      </div>
      {open == "permission" && (
        <UsersEditPermissionDialog
          open={open == "permission"}
          onOpenChange={() => setOpen(null)}
          currentRow={selectedRow!}
        />
      )}
    </UserProvider>
  );
}
