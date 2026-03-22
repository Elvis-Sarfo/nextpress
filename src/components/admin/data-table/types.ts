import type { ColumnDef, RowData } from '@tanstack/react-table';

export interface AdminColumnMeta {
  filterable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
  getFilterValues?: (row: Record<string, unknown>) => string[];
}

export type AdminTableColumn<Row extends object> = ColumnDef<Row> & {
  meta?: AdminColumnMeta;
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> extends AdminColumnMeta {}
}
