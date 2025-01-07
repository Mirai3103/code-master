import { RxCross2 as Cross2Icon } from "react-icons/rx";

import { type Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export type StringKeyOf<TData> = Extract<keyof TData, string>;
export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}
interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  extendActionsSlot?: React.ReactNode;
  filterFields?: DataTableFilterField<TData>[];
}

export function DataTableToolbar<TData>({
  table,
  extendActionsSlot,
}: DataTableToolbarProps<TData>) {
  const isFiltered =
    table.getState().columnFilters.length > 0 ||
    table.getState().globalFilter != "";
  const [search, setSearch] = useState("");
  const setGlobalValue = useDebouncedCallback((value: string) => {
    table.setGlobalFilter(value);
  }, 1000);
  React.useEffect(() => {
    setSearch(table.getState().globalFilter);
  }, [table]);
  const hasHiddenColumns = table
    .getAllColumns()
    .some((column) => !column.getIsVisible());

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Tìm kiếm"
          value={search || ""}
          onChange={(event) => {
            setSearch(event.target.value);
            setGlobalValue.cancel();
            setGlobalValue(event.target.value);
          }}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {/* <div className="flex gap-x-2">
          {table.getColumn("status") && (
            <DataTableFacetedFilter
              column={table.getColumn("status")}
              title="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
                { label: "Invited", value: "invited" },
                { label: "Suspended", value: "suspended" },
              ]}
            />
          )}
          {table.getColumn("role") && (
            <DataTableFacetedFilter
              column={table.getColumn("role")}
              title="Role"
              options={userTypes.map((t) => ({ ...t }))}
            />
          )}
        </div> */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.setGlobalFilter("");
              table.resetColumnFilters();
              setSearch("");
            }}
            className="h-8 px-2 lg:px-3"
          >
            Bỏ lọc
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex justify-end gap-x-2">
        {extendActionsSlot}
        {hasHiddenColumns && <DataTableViewOptions table={table} />}
      </div>
    </div>
  );
}
