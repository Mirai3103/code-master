"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { TbTextPlus as IconTextPlus } from "react-icons/tb";
import { useLanguageTable } from "./_components/columns";
import { type DialogType, LanguageProvider } from "./_components/context";
import { useState } from "react";
import { LanguagesActionDialog } from "./_components/action-dialog";
import { LanguagesDeleteDialog } from "./_components/delete-dialog";
import { DataTable } from "@/components/data-table/data-table";
import { type Language } from "@/server/schema/language.schema";
export default function Languages() {
  const [selectedRow, setSelectedRow] = useState<Language | null | undefined>(
    null,
  );
  const [open, setOpen] = useState<DialogType | null>(null);
  const table = useLanguageTable();
  return (
    <LanguageProvider value={{ selectedRow, setSelectedRow, open, setOpen }}>
      <div>
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4"></div>
        </Header>
        <Main>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý ngôn ngữ lập trình
              </h2>
              <p className="text-muted-foreground">
                Quản lý , thêm, sửa, xóa ngôn ngữ lập trình, ...
              </p>
            </div>
            <div className="flex gap-2">
              <Button className="space-x-1" onClick={() => setOpen("add")}>
                <span>Thêm ngôn ngữ</span> <IconTextPlus size={18} />
              </Button>
            </div>
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable<Language> table={table} />
          </div>
        </Main>
        <LanguagesActionDialog
          key="user-add"
          open={open === "add"}
          onOpenChange={(isOpen) => setOpen(isOpen ? "add" : null)}
        />
        {selectedRow && (
          <>
            <LanguagesDeleteDialog
              key={`user-delete-${selectedRow.languageId}`}
              open={open === "delete"}
              onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
              currentRow={selectedRow}
            />
            <LanguagesActionDialog
              key={`user-edit-${selectedRow.languageId}`}
              open={open === "edit"}
              currentRow={selectedRow}
              onOpenChange={(isOpen) => setOpen(isOpen ? "edit" : null)}
            />
          </>
        )}
      </div>
    </LanguageProvider>
  );
}
