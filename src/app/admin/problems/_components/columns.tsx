import {
  type ColumnDef,
  getCoreRowModel,
  getFacetedRowModel,
  getSortedRowModel,
  type PaginationState,
  type VisibilityState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import LongText from "@/components/long-text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import usePaginationParams from "@/hooks/use-pagination-params";
import { useState } from "react";
import { type ColumnFiltersState } from "@tanstack/react-table";
import { useReactTable } from "@tanstack/react-table";
import { trpc } from "@/trpc/react";
import { getPaginationRowModel } from "@tanstack/react-table";
import { getFacetedUniqueValues } from "@tanstack/react-table";
import { type Problem } from "@/server/schema/problem.schema";

export const columns: ColumnDef<Problem>[] = [
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
    accessorKey: "problemId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <span className="max-w-6">{row.getValue("problemId")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell",
      ),
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "problemName",
    accessorKey: "problemName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngôn ngữ" />
    ),
    cell: ({ row }) => {
      const { title } = row.original;
      return <LongText className="max-w-36">{title}</LongText>;
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Tiêu đề",
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export function useProblemTable() {
  const [pagination, setPagination] = usePaginationParams({});
  const { data } = trpc.problems.getProblems.useQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: pagination.search,
    orderBy: pagination.sortBy,
    order: pagination.sortOrder,
  });
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: (data?.[0] || []) as Problem[],
    columns,
    rowCount: data?.[1] || 0,
    state: {
      sorting: [
        {
          id: pagination.sortBy,
          desc: pagination.sortOrder === "desc",
        },
      ],
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: pagination.page - 1,
        pageSize: pagination.pageSize,
      },
      globalFilter: pagination.search,
    },

    onPaginationChange: (newPage) => {
      let page: PaginationState;
      if (typeof newPage === "function") {
        page = newPage({
          pageIndex: pagination.page - 1,
          pageSize: pagination.pageSize,
        });
      } else {
        page = newPage;
      }
      setPagination((prev) => ({
        ...prev,
        page: page.pageIndex + 1,
        pageSize: page.pageSize,
      }));
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: (newSorting) => {
      if (typeof newSorting === "function") {
        const newS = newSorting([
          {
            id: pagination.sortBy,
            desc: pagination.sortOrder === "desc",
          },
        ]);
        setPagination((pre) => ({
          ...pre,
          sortBy: newS[0]!.id,
          sortOrder: newS[0]!.desc ? "desc" : "asc",
        }));
      } else {
        setPagination((pre) => ({
          ...pre,
          sortBy: newSorting[0]!.id,
          sortOrder: newSorting[0]!.desc ? "desc" : "asc",
        }));
      }
    },
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onGlobalFilterChange: (value) => {
      setPagination((prev) => ({
        ...prev,
        search: value,
      }));
    },
    enableMultiSort: false,
    enableSorting: true,
  });
  return table;
}
