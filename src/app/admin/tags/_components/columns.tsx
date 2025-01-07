import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import LongText from "@/components/long-text";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import usePaginationParams from "@/hooks/use-pagination-params";
import { useState } from "react";
import { type VisibilityState } from "@tanstack/react-table";
import { getFacetedRowModel } from "@tanstack/react-table";
import { getFacetedUniqueValues } from "@tanstack/react-table";
import { type Tag } from "@/server/schema/tag.schema";
import { trpc } from "@/trpc/react";
export const columns: ColumnDef<Tag>[] = [
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
    accessorKey: "tagId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <span className="max-w-36">{row.getValue("tagId")}</span>
    ),
    meta: {
      className: cn(
        "drop-shadow-[0_1px_2px_rgb(0_0_0_/_0.1)] dark:drop-shadow-[0_1px_2px_rgb(255_255_255_/_0.1)] lg:drop-shadow-none",
        "bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted",
        "sticky left-6 md:table-cell",
      ),
    },
    enableSorting: false,
  },
  {
    id: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tên thẻ" />
    ),
    cell: ({ row }) => {
      const { tagName } = row.original;
      return <span className="max-w-36">{tagName}</span>;
    },
    enableHiding: false,
    enableSorting: true,
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mô tả" />
    ),
    cell: ({ row }) => (
      <LongText className="w-fit">{row.getValue("description")}</LongText>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
export function useTagTable() {
  // State management
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = usePaginationParams({});

  // Fetch data
  const { data } = trpc.tags.getTags.useQuery({
    page: pagination.page,
    pageSize: pagination.pageSize,
    search: pagination.search,
  });

  // Handlers
  const handlePaginationChange = (
    newPage: PaginationState | ((prev: PaginationState) => PaginationState),
  ) => {
    setPagination((prev) => {
      const page =
        typeof newPage === "function"
          ? newPage({
              pageIndex: pagination.page - 1,
              pageSize: pagination.pageSize,
            })
          : newPage;
      return {
        ...prev,
        page: page.pageIndex + 1,
        pageSize: page.pageSize,
      };
    });
  };

  const handleSortingChange = (
    newSorting: SortingState | ((prev: SortingState) => SortingState),
  ) => {
    const sorting =
      typeof newSorting === "function"
        ? newSorting([
            {
              id: pagination.sortBy,
              desc: pagination.sortOrder === "desc",
            },
          ])
        : newSorting;
    setPagination((prev) => ({
      ...prev,
      sortBy: sorting?.[0]?.id,
      sortOrder: sorting?.[0]?.desc ? "desc" : "asc",
    }));
  };

  const handleGlobalFilterChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      search: value,
    }));
  };

  // React Table
  const table = useReactTable({
    data: data?.[0] || [],
    columns,
    rowCount: data?.[1] || 0,
    getRowId: (row) => row.tagId + "",
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
    onPaginationChange: handlePaginationChange,
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: handleGlobalFilterChange,
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    enableMultiSort: false,
    enableSorting: true,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return table;
}
