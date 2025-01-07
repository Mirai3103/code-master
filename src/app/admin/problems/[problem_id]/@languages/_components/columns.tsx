import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import LongText from "@/components/long-text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import React, { useState } from "react";
import { type PaginationState } from "@tanstack/react-table";
import { getPaginationRowModel } from "@tanstack/react-table";
import { getFacetedUniqueValues } from "@tanstack/react-table";
import { getFacetedRowModel } from "@tanstack/react-table";
import type { LanguageOfProblem } from "@/server/service/problem.service";

export const columns: ColumnDef<LanguageOfProblem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    meta: {
      className: cn(
        "sticky md:table-cell left-0 z-10 rounded-tl",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
      ),
    },
    cell: ({ row }) => {
      return (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "languageId",
    id: "languageId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <span className="max-w-6">{row.getValue("languageId")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell max-w-12",
      ),
      title: "Id",
    },
    enableSorting: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngôn ngữ" />
    ),
    cell: ({ row }) => {
      const { name, version } = row.original;
      return <LongText>{`${name} (${version})`}</LongText>;
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Ngôn ngữ",
    },
  },
  {
    id: "timeLimit",
    accessorKey: "timeLimit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giới hạn thời gian(Giây)" />
    ),
    cell: ({ row }) => (
      <span className="max-w-6">{row.getValue("timeLimit")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell max-w-12",
      ),
      title: "Giới hạn thời gian",
    },
  },
  {
    id: "memoryLimit",
    accessorKey: "memoryLimit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Giới hạn bộ nhớ(MB)" />
    ),
    cell: ({ row }) => (
      <span className="max-w-6">{row.getValue("memoryLimit")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell max-w-12",
      ),
      title: "Memory Limit",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export function useLanguageTable(data: LanguageOfProblem[]) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
  React.useEffect(() => {
    if (data) {
      const initialSelection: Record<string, boolean> = {};
      for (const row of data) {
        initialSelection[row.languageId!] = row.isInProblem || false;
      }
      setRowSelection(initialSelection);
    }
  }, [data]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 100,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const table = useReactTable({
    data: data ?? [],
    columns: columns ?? [],
    getRowId: (row) => row.languageId + "",
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
      globalFilter,
    },
    onPaginationChange: setPagination,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: setGlobalFilter,
  });
  return table;
}
