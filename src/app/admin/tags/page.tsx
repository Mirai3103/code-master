"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { TbTextPlus as IconTextPlus } from "react-icons/tb";

import { useTagTable } from "./_components/columns";

import { type DialogType, TagProvider } from "./_components/context";
import { useState } from "react";
import { TagsActionDialog } from "./_components/action-dialog";
import { TagsDeleteDialog } from "./_components/delete-dialog";
import { DataTable } from "@/components/data-table/data-table";
import type { Tag } from "@prisma/client";
export default function Tags() {
  const [selectedRow, setSelectedRow] = useState<Tag | null | undefined>(null);
  const [open, setOpen] = useState<DialogType | null>(null);
  const table = useTagTable();
  return (
    <TagProvider value={{ selectedRow, setSelectedRow, open, setOpen }}>
      <div>
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4"></div>
        </Header>
        <Main>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Quản lý thẻ</h2>
              <p className="text-muted-foreground">
                Quản lý thẻ, thêm, sửa, xóa thẻ, ...
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="space-x-1" onClick={() => setOpen("add")}>
                <span>Tạo thẻ</span> <IconTextPlus size={18} />
              </Button>
            </div>
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable table={table} />
          </div>
        </Main>
        <TagsActionDialog
          key="user-add"
          open={open === "add"}
          onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        />
        {selectedRow && (
          <>
            <TagsDeleteDialog
              key={`user-delete-${selectedRow.tagId}`}
              open={open === "delete"}
              onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
              currentRow={selectedRow}
            />
            <TagsActionDialog
              key={`user-edit-${selectedRow.tagId}`}
              open={open === "edit"}
              currentRow={selectedRow}
              onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
            />
          </>
        )}
      </div>
    </TagProvider>
  );
}
