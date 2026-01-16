"use client";

import React, { createContext, useContext, useState } from "react";
import { Shift } from "@/types/shift";

export interface ShiftState {
  globalShifts: Shift[];
  weeklyShifts: {
    [key: string]: Shift[]; // key will be role_${roleId} or locomotive_${locId}
  };
  selectedShifts: {
    global: Shift[];
    [key: string]: Shift[]; // key will be role_${roleId} or locomotive_${locId}
  };
}

interface ShiftContextType {
  data: ShiftState;
  setGlobalShifts: (shifts: Shift[]) => void;
  setWeeklyShifts: (key: string, shifts: Shift[]) => void;
  setSelectedShifts: (key: string, shifts: Shift[]) => void;
  clearWeeklyShifts: (key: string) => void;
  clearSelectedShifts: (key: string) => void; // Add this line
}

const ShiftContext = createContext<ShiftContextType>({
  data: {
    globalShifts: [],
    weeklyShifts: {},
    selectedShifts: {
      global: [],
    },
  },
  setGlobalShifts: () => {},
  setWeeklyShifts: () => {},
  setSelectedShifts: () => {},
  clearWeeklyShifts: () => {},
  clearSelectedShifts: () => {}, // Add this line
});

export function ShiftProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ShiftState>({
    globalShifts: [],
    weeklyShifts: {},
    selectedShifts: {
      global: [],
    },
  });

  const setGlobalShifts = (shifts: Shift[]) => {
    setData((prev) => ({
      ...prev,
      globalShifts: shifts,
    }));
  };

  const setWeeklyShifts = (key: string, shifts: Shift[]) => {
    setData((prev) => ({
      ...prev,
      weeklyShifts: {
        ...prev.weeklyShifts,
        [key]: shifts,
      },
    }));
  };

  const setSelectedShifts = (key: string, shiftsToToggle: Shift[]) => {
    setData((prev) => {
      const currentSelected = prev.selectedShifts[key] || [];

      // For single shift toggle
      if (shiftsToToggle.length === 1) {
        const shiftToToggle = shiftsToToggle[0];
        if (!shiftToToggle) return prev;

        const isSelected = currentSelected.some(
          (s) => s.id?.toString() === shiftToToggle.id?.toString()
        );

        return {
          ...prev,
          selectedShifts: {
            ...prev.selectedShifts,
            [key]: isSelected
              ? currentSelected.filter(
                  (s) => s.id?.toString() !== shiftToToggle.id?.toString()
                )
              : [...currentSelected, shiftToToggle],
          },
        };
      }

      // For multiple shifts
      return {
        ...prev,
        selectedShifts: {
          ...prev.selectedShifts,
          [key]: shiftsToToggle,
        },
      };
    });
  };

  const clearWeeklyShifts = (key: string) => {
    const { [key]: _, ...rest } = data.weeklyShifts;
    setData((prev) => ({
      ...prev,
      weeklyShifts: rest,
    }));
  };

  const clearSelectedShifts = (key: string) => {
    setData((prev) => ({
      ...prev,
      selectedShifts: {
        ...prev.selectedShifts,
        [key]: [],
      },
    }));
  };

  return (
    <ShiftContext.Provider
      value={{
        data,
        setGlobalShifts,
        setWeeklyShifts,
        setSelectedShifts,
        clearWeeklyShifts,
        clearSelectedShifts, // Add this line
      }}
    >
      {children}
    </ShiftContext.Provider>
  );
}

export const useShift = () => useContext(ShiftContext);
