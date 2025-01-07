import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getSortedRowModel,
  type PaginationState,
} from "@tanstack/react-table";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import LongText from "@/components/long-text";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import usePaginationParams from "@/hooks/use-pagination-params";
import { trpc } from "@/trpc/react";
import { useState } from "react";
import { useReactTable } from "@tanstack/react-table";
import { type VisibilityState } from "@tanstack/react-table";
import { getPaginationRowModel } from "@tanstack/react-table";
import { type Language } from "@/server/schema/language.schema";

export const columns: ColumnDef<Language>[] = [
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
    accessorKey: "languageId",
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
        "sticky left-6 md:table-cell",
      ),
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: "languageName",
    accessorKey: "languageName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Ngôn ngữ" />
    ),
    cell: ({ row }) => {
      const { languageName, version } = row.original;
      return (
        <LongText className="max-w-36">
          {`${languageName} (${version})`}
        </LongText>
      );
    },
    enableHiding: false,
    enableSorting: true,
    meta: {
      title: "Ngôn ngữ",
    },
  },
  {
    accessorKey: "sourceFileExt",
    id: "sourceFileExt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File mã nguồn" />
    ),
    cell: ({ row }) => (
      <span className="w-fit">{row.getValue("sourceFileExt")}</span>
    ),
    enableSorting: false,
    meta: {
      title: "File mã nguồn",
    },
  },
  {
    accessorKey: "binaryFileExt",
    id: "binaryFileExt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File thực thi" />
    ),
    cell: ({ row }) => (
      <span className="w-fit">{row.getValue("binaryFileExt")}</span>
    ),
    enableSorting: false,
    meta: {
      title: "File thực thi",
    },
  },
  {
    accessorKey: "compileCommand",
    id: "compileCommand",
    meta: {
      title: "Lệnh biên dịch",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lệnh biên dịch" />
    ),
    cell: ({ row }) => (
      <code className="w-fit">{row.getValue("compileCommand")}</code>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "runCommand",
    id: "runCommand",
    meta: {
      title: "Lệnh chạy",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lệnh chạy" />
    ),
    cell: ({ row }) => (
      <code className="w-fit">{row.getValue("runCommand")}</code>
    ),
    enableSorting: false,
  },
  {
    accessorKey: "isActive",
    id: "isActive",
    meta: {
      title: "Trạng thái",
    },
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Trạng thái" />
    ),
    cell: ({ row }) => (
      <span className="w-fit">
        {row.getValue("isActive") ? "Active" : "Inactive"}
      </span>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];

export function useLanguageTable() {
  const [pagination, setPagination] = usePaginationParams({});

  const { data } = trpc.languages.getLanguages.useQuery({
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
    data: data?.[0] || [],
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
