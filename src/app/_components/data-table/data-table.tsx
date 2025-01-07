"use client";
import { type Table as TableType, flexRender } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { cn } from "@/lib/utils";

interface DataTableProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  table: TableType<T>;
  emptySlot?: React.ReactNode;
}

export function DataTable<T>({
  table,
  children,
  className,
  emptySlot,
  ...rest
}: DataTableProps<T>) {
  children = children || <DataTableToolbar table={table} />;
  return (
    <div className={cn("space-y-4", className)} {...rest}>
      {children}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="group/row">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      className={header.column.columnDef.meta?.className ?? ""}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group/row"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.className ?? ""}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleFlatColumns().length}
                  className="h-24 text-center"
                >
                  {emptySlot || "Không có dữ liệu"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

// export function ClientDataTable<T>({
// 	columns,
// 	data,
// 	withToggleColumns,
// 	emptySlot,
// 	total,
// 	extendActionsSlot,
// }: DataTableProps<T>) {
// 	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>(
// 		{}
// 	);
// 	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
// 		{}
// 	);
// 	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
// 	const [pagination, setPagination] = useState<PaginationState>({
// 		pageIndex: 0,
// 		pageSize: 10,
// 	});
// 	const [sorting, setSorting] = useState<SortingState>([]);
// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	const [globalFilter, setGlobalFilter] = useState<any>([]);
// 	const table = useReactTable({
// 		data: data ?? [],
// 		columns: columns ?? [],
// 		state: {
// 			sorting,
// 			columnVisibility,
// 			rowSelection,
// 			columnFilters,
// 			pagination,
// 			globalFilter,
// 		},
// 		onPaginationChange: setPagination,
// 		enableRowSelection: true,
// 		onRowSelectionChange: setRowSelection,
// 		onSortingChange: setSorting,
// 		onColumnFiltersChange: setColumnFilters,
// 		onColumnVisibilityChange: setColumnVisibility,
// 		getCoreRowModel: getCoreRowModel(),
// 		getPaginationRowModel: getPaginationRowModel(),
// 		getSortedRowModel: getSortedRowModel(),
// 		getFacetedRowModel: getFacetedRowModel(),
// 		getFacetedUniqueValues: getFacetedUniqueValues(),
// 		onGlobalFilterChange: setGlobalFilter,
// 	});

// 	return (
// 		<DataTable
// 			columns={columns}
// 			data={data}
// 			table={table}
// 			total={total}
// 			withToggleColumns={withToggleColumns}
// 			emptySlot={emptySlot}
// 			extendActionsSlot={extendActionsSlot}
// 		/>
// 	);
// }
