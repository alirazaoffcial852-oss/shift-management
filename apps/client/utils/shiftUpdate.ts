import { Shift } from "@/types/shift";
import { ShiftTransformer } from "./transformers/shiftTransformer";
import ShiftService from "@/services/shift";
import { toast } from "sonner";

export const updateShiftData = async (shifts: Shift[]): Promise<boolean> => {
  try {
    const processedData = ShiftTransformer.transformForUpdate(shifts);
    const formData = new FormData();
    formData.append("shifts", JSON.stringify(processedData));
    const response = await ShiftService.updateShifts(formData);
    toast.success(response.message);
    return true;
  } catch (error) {
    console.error("Error updating shift:", error);
    let errorMessage = "An unknown error occurred while updating shift.";
    if (error && typeof error === "object") {
      if ("data" in error && typeof (error as any).data?.message === "string") {
        errorMessage = (error as any).data.message;
      } else if ("message" in error && typeof (error as any).message === "string") {
        errorMessage = (error as any).message;
      }
    }
    toast.error(errorMessage);
    return false;
  }
};
