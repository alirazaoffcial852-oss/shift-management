import { useAddShift } from "./useAddShift";
import { useEditShift } from "./useEditShift";

export type ShiftFormMode = "ADD" | "EDIT";

export const useShiftForm = (mode: ShiftFormMode) => {
  if (!mode) {
    throw new Error("ShiftFormMode is required");
  }

  const hooks: Record<Exclude<ShiftFormMode, "SINGLE">, () => any> = {
    ADD: useAddShift,
    EDIT: useEditShift,
  };

  const selectedHook = hooks[mode];
  if (!selectedHook) {
    throw new Error(`Invalid ShiftFormMode: ${mode}`);
  }

  return selectedHook();
};
