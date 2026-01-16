import { ProjectUSNShift } from "@/types/projectUsn";
import { format, startOfWeek, addDays } from "date-fns";

export const groupShiftsByDate = (
  shifts: ProjectUSNShift[]
): Record<string, ProjectUSNShift[]> => {
  return shifts.reduce(
    (acc, shift) => {
      const date = shift.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(shift);
      return acc;
    },
    {} as Record<string, ProjectUSNShift[]>
  );
};

export const getWeekDays = (currentDate: Date): Date[] => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
