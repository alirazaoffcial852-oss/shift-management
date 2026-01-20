import { format, parseISO } from "date-fns";

export const DATE_FORMATS = {
  API: "yyyy-MM-dd",
  DISPLAY: "dd/MM/yyyy",
  DISPLAY_DOT: "dd.MM.yyyy",
  DISPLAY_LONG: "PPP",
  DISPLAY_SHORT: "MMM d",
  TIME: "HH:mm",
  DATETIME: "dd/MM/yyyy HH:mm",
  DATETIME_LOCAL: "yyyy-MM-dd'T'HH:mm",
} as const;

export type DateFormatKey = keyof typeof DATE_FORMATS;

export function formatDate(
  date: Date | string | null | undefined,
  formatKey: DateFormatKey = "DISPLAY"
): string {
  if (!date) return "-";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "-";
    return format(dateObj, DATE_FORMATS[formatKey]);
  } catch {
    return "-";
  }
}

export function formatDateApi(date: Date | string | null | undefined): string {
  return formatDate(date, "API");
}

export function formatDateDisplay(date: Date | string | null | undefined): string {
  return formatDate(date, "DISPLAY");
}

export function formatTime(time: Date | string | null | undefined): string {
  if (!time) return "-";
  try {
    const timeStr = typeof time === "string" ? time : "";
    if (timeStr.match(/^\d{2}:\d{2}$/)) {
      return timeStr;
    }
    const dateObj = typeof time === "string" ? new Date(time.replace("Z", "")) : time;
    if (isNaN(dateObj.getTime())) return "-";
    return format(dateObj, DATE_FORMATS.TIME);
  } catch {
    return "-";
  }
}

export function formatDateTime(date: Date | string | null | undefined): string {
  return formatDate(date, "DATETIME");
}

export function toDatetimeLocal(date: Date | string | null | undefined): string {
  if (!date) return "";
  try {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch {
    return "";
  }
}

export function isToday(date: Date): boolean {
  const today = new Date();
  return format(date, DATE_FORMATS.API) === format(today, DATE_FORMATS.API);
}

export function getDateKey(date: Date): string {
  return format(date, DATE_FORMATS.API);
}

export function parseApiDate(dateString: string): Date | null {
  try {
    const date = parseISO(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}
