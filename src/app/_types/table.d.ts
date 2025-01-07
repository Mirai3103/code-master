import "@tanstack/react-table";

interface ColumnMeta {
  title?: string;
}

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue = unknown> {
    className?: string;
    title?: string;
  }
}
