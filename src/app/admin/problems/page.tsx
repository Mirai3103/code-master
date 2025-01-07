"use client";
import { Header } from "@/components/layout/header";
import { Main } from "@/components/layout/main";
import { Search } from "@/components/search";
import { Button } from "@/components/ui/button";
import { TbTextPlus as IconTextPlus } from "react-icons/tb";

import { useProblemTable } from "./_components/columns";
import { type DialogType, ProblemProvider } from "./_components/context";
import { useState } from "react";
import { ProblemsDeleteDialog } from "./_components/delete-dialog";
import { useRouter } from "next/navigation";
import { DataTable } from "@/components/data-table/data-table";
import { type Problem } from "@/server/schema/problem.schema";
export default function Problems() {
  const [selectedRow, setSelectedRow] = useState<Problem | null | undefined>(
    null,
  );
  const [open, setOpen] = useState<DialogType | null>(null);
  const { push } = useRouter();
  const table = useProblemTable();
  return (
    <ProblemProvider value={{ selectedRow, setSelectedRow, open, setOpen }}>
      <div>
        <Header sticky>
          <Search />
          <div className="ml-auto flex items-center space-x-4"></div>
        </Header>
        <Main>
          <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Quản lý bài toán
              </h2>
              <p className="text-muted-foreground">
                Quản lý , thêm, sửa, xóa bài toán, ...
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                className="space-x-1"
                onClick={() => push("/admin/problems/new")}
              >
                <span>Thêm bài toán</span> <IconTextPlus size={18} />
              </Button>
            </div>
          </div>
          <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
            <DataTable table={table} />
          </div>
        </Main>

        {selectedRow && (
          <>
            <ProblemsDeleteDialog
              key={`user-delete-${selectedRow.problemId}`}
              open={open === "delete"}
              onOpenChange={(isOpen) => setOpen(isOpen ? "delete" : null)}
              currentRow={selectedRow}
            />
          </>
        )}
      </div>
    </ProblemProvider>
  );
}
