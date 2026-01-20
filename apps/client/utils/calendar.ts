import { Shift } from "@/types/shift";
import { startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { getDateKey, formatDateApi } from "./common";
import { groupBy } from "./common/transform";

export const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const reorganizeErrors = (errors: {
  [key: string]: string;
}): Array<{ [key: string]: string }> => {
  const shiftErrors: Array<{ [key: string]: string }> = [];

  Object.entries(errors).forEach(([key, value]) => {
    const arrayFieldMatch = key.match(
      /^(shiftTrain|shiftRole)\[(\d+)\]\.(.+)$/
    );
    const shiftMatch = key.match(/^shift\[(\d+)\]\.(.+)$/);

    if (arrayFieldMatch) {
      const [_, fieldType, index, fieldName] = arrayFieldMatch;
      if (!shiftErrors[0]) {
        shiftErrors[0] = {};
      }
      shiftErrors[0][`${fieldType}.${index}.${fieldName}`] = value;
    } else if (shiftMatch) {
      const [_, shiftIndex, restOfKey] = shiftMatch;
      const index = parseInt(shiftIndex || "0");

      if (!shiftErrors[index]) {
        shiftErrors[index] = {};
      }

      const nestedArrayMatch = restOfKey?.match(
        /^(shiftTrain|shiftRole)\[(\d+)\]\.(.+)$/
      );
      if (nestedArrayMatch) {
        const [_, fieldType, arrayIndex, fieldName] = nestedArrayMatch;
        shiftErrors[index][`${fieldType}.${arrayIndex}.${fieldName}`] = value;
      } else {
        if (restOfKey) {
          shiftErrors[index][restOfKey] = value;
        }
      }
    } else {
      if (!shiftErrors[0]) {
        shiftErrors[0] = {};
      }
      shiftErrors[0][key] = value;
    }
  });

  return shiftErrors;
};

export const getWeekDays = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end });
};

export const groupShiftsByDate = (shifts: Shift[]) => {
  return groupBy(shifts, (shift) =>
    shift.date ? formatDateApi(new Date(shift.date)) || "Invalid Date" : "Invalid Date"
  );
};

export const getShiftsForDay = (
  shifts: Shift[],
  date: Date,
  groupedShifts: { [key: string]: Shift[] }
) => {
  const dateKey = getDateKey(date);
  return groupedShifts[dateKey] || [];
};
export const handlePreviousMonth = (
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
) => {
  setCurrentDate(
    (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() - 1, 1)
  );
};

export const handleNextMonth = (
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>
) => {
  setCurrentDate(
    (prevDate) => new Date(prevDate.getFullYear(), prevDate.getMonth() + 1, 1)
  );
};

// Shift selection actions
export const handleShiftSelect = (
  shiftId: string,
  setSelectedShifts: React.Dispatch<React.SetStateAction<Set<string>>>
) => {
  setSelectedShifts((prev) => {
    const newSet = new Set(prev);
    if (newSet.has(shiftId)) {
      newSet.delete(shiftId);
    } else {
      newSet.add(shiftId);
    }
    return newSet;
  });
};

// Shift management actions
export const handleShiftClick = (shift: Shift) => {
  // Implementation can be added here when needed
  console.log("Shift clicked:", shift);
};
