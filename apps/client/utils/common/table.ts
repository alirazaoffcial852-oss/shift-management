import { formatDate, formatTime, formatDateTime, DATE_FORMATS } from "./index";
import { format } from "date-fns";

export type ColumnRenderer<T = any> = (value: any, row?: T) => React.ReactNode;

export const dateRenderer: ColumnRenderer = (value) => formatDate(value, "DISPLAY");

export const dateDotRenderer: ColumnRenderer = (value) => formatDate(value, "DISPLAY_DOT");

export const timeRenderer: ColumnRenderer = (value) => formatTime(value);

export const dateTimeRenderer: ColumnRenderer = (value) => formatDateTime(value);

export const currencyRenderer = (currency: string = "€"): ColumnRenderer => {
  return (value) => {
    if (value === null || value === undefined) return "-";
    const num = parseFloat(value);
    if (isNaN(num)) return "-";
    return `${currency}${num.toFixed(2)}`;
  };
};

export const percentRenderer: ColumnRenderer = (value) => {
  if (value === null || value === undefined) return "-";
  const num = parseFloat(value);
  if (isNaN(num)) return "-";
  return `${num.toFixed(2)}%`;
};

export const booleanRenderer = (
  trueText: string = "Yes",
  falseText: string = "No"
): ColumnRenderer => {
  return (value) => (value ? trueText : falseText);
};

export const arrayJoinRenderer = (
  accessor: string,
  separator: string = ", "
): ColumnRenderer => {
  return (value, row) => {
    if (!Array.isArray(value)) return "-";
    const items = value.map((item) => {
      const keys = accessor.split(".");
      let result = item;
      for (const key of keys) {
        result = result?.[key];
      }
      return result;
    });
    return items.filter(Boolean).join(separator) || "-";
  };
};

export const nestedAccessor = (path: string): ColumnRenderer => {
  return (value, row) => {
    if (!row) return "-";
    const keys = path.split(".");
    let result: any = row;
    for (const key of keys) {
      result = result?.[key];
    }
    return result ?? "-";
  };
};

export const STATUS_COLORS = {
  ACTIVE: "bg-green-100 text-green-800",
  INACTIVE: "bg-gray-100 text-gray-800",
  ARCHIVED: "bg-yellow-100 text-yellow-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-purple-100 text-purple-800",
  REJECTED: "bg-red-100 text-red-800",
  DRAFT: "bg-gray-100 text-gray-800",
  SUBMITTED: "bg-blue-100 text-blue-800",
  FIXED: "bg-green-100 text-green-800",
  PLANNED: "bg-blue-100 text-blue-800",
  INVOICED: "bg-blue-100 text-blue-800",
  BILLED: "bg-red-100 text-red-800",
} as const;

export type StatusKey = keyof typeof STATUS_COLORS;

export const getStatusColor = (status: string): string => {
  return STATUS_COLORS[status as StatusKey] || "bg-gray-100 text-gray-800";
};

export interface TableColumn<T = any> {
  header: string;
  accessor: string;
  render?: ColumnRenderer<T>;
  sortable?: boolean;
  className?: string;
}

export function createColumn<T = any>(
  header: string,
  accessor: string,
  render?: ColumnRenderer<T>
): TableColumn<T> {
  return { header, accessor, render };
}

export function createDateColumn<T = any>(
  header: string,
  accessor: string
): TableColumn<T> {
  return { header, accessor, render: dateRenderer };
}

export function createTimeColumn<T = any>(
  header: string,
  accessor: string
): TableColumn<T> {
  return { header, accessor, render: timeRenderer };
}

export function createDateTimeColumn<T = any>(
  header: string,
  accessor: string
): TableColumn<T> {
  return { header, accessor, render: dateTimeRenderer };
}

export function createCurrencyColumn<T = any>(
  header: string,
  accessor: string,
  currency: string = "€"
): TableColumn<T> {
  return { header, accessor, render: currencyRenderer(currency) };
}
