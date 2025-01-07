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
import { useState } from "react";
import { type PaginationState } from "@tanstack/react-table";
import { getPaginationRowModel } from "@tanstack/react-table";
import { getFacetedUniqueValues } from "@tanstack/react-table";
import { getFacetedRowModel } from "@tanstack/react-table";
import { TestCase } from "@/server/schema/testcase.schema";

export const columns: ColumnDef<TestCase>[] = [
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
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "testCaseId",
    id: "testCaseId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <span className="max-w-6">{row.getValue("testCaseId")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell max-w-12",
      ),
      title: "Id",
    },
    enableSorting: false,
    enableHiding: true,
  },
  {
    id: "label",
    accessorKey: "label",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nhãn" />
    ),
    cell: ({ row }) => {
      const { label } = row.original;
      return <LongText>{label}</LongText>;
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Nhãn",
    },
  },
  {
    id: "points",
    accessorKey: "points",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Số điểm" />
    ),
    cell: ({ row }) => {
      const { points } = row.original;
      return <span>{points}</span>;
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Số điểm",
    },
  },
  {
    id: "isSample",
    accessorKey: "isSample",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mẫu" />
    ),
    cell: ({ row }) => {
      const { isSample } = row.original;
      return (
        <Checkbox
          checked={isSample}
          aria-label="Sample"
          className="translate-y-[2px]"
        />
      );
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Mẫu",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export function useTestcaseTable(data: TestCase[]) {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
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
