import React, { Suspense, useMemo, useState } from "react";
import { Shift } from "@/types/shift";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import ShiftsList from "../Shift/ShiftList";
import { Product } from "@/types/product";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import ShiftService from "@/services/shift";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

const LazyPersonalDetail = React.lazy(() =>
  import("../Forms/shift/PersonalDetail").then((module) => ({
    default: module.PersonalDetail,
  }))
);

const handlerValidation = (shifts: Shift[]) => {
  const errors: { [key: string]: string } = {};
  shifts.forEach((shift, shiftIndex) => {
    const prefix = `shifts[${shiftIndex}].`;

    if (shift.shiftRole && shift.shiftRole.length > 0) {
      const hasActiveRole = shift.shiftRole.some(
        (role) => role.isDisabled !== true
      );

      // Note: This function is called outside React context, so translations need to be passed
      // For now, keeping English strings - these should be passed as parameters
      if (!hasActiveRole) {
        errors[`${prefix}shiftRole`] = "At least one role must be enabled";
      }

      shift.shiftRole.forEach((role, roleIndex) => {
        if (!role.employee_id && role.isDisabled !== true) {
          errors[`${prefix}shiftRole[${role?.role_id}].employee_id`] =
            "Employee is required";
        }
        if (!role.role_id && role.isDisabled !== true) {
          errors[`${prefix}shiftRole[${role?.role_id}].role_id`] =
            "Role is required";
        }
        if (!role.proximity && role.isDisabled !== true) {
          errors[`${prefix}shiftRole[${role?.role_id}].proximity`] =
            "Proximity is required";
        }
        if (!role.break_duration && role.isDisabled !== true) {
          errors[`${prefix}shiftRole[${role?.role_id}].break_duration`] =
            "Break duration is required";
        }
        if (!role.start_day && role.isDisabled !== true) {
          errors[`${prefix}shiftRole[${role?.role_id}].start_day`] =
            "Start day is required";
        }
      });
    }
  });

  return errors;
};

const filterErrorsForCurrentShift = (
  errors: { [key: string]: string },
  currentIndex: number
) => {
  const currentShiftErrors: { [key: string]: string } = {};

  Object.entries(errors).forEach(([key, value]) => {
    if (key.startsWith(`shifts[${currentIndex}]`)) {
      const newKey = key.replace(`shifts[${currentIndex}].`, "");
      currentShiftErrors[newKey] = value;
    }
  });

  return currentShiftErrors;
};

interface AddSubcategoryDialogProps {
  open: boolean;
  onClose: () => void;
  shifts: Shift[];
  products: Product[];
  selectedAssignShifts: Shift[];
  setSelectedAssignShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  onShiftsChange: (allShifts: Shift[]) => void;
}

export const AssignShift = React.memo(
  ({
    open,
    onClose,
    shifts,
    products,
    selectedAssignShifts,
    setSelectedAssignShifts,
    onShiftsChange,
  }: AddSubcategoryDialogProps) => {
    const t = useTranslations("pages.shift");
    const tcommon = useTranslations("common");
    const tactions = useTranslations("actions");

    const [currentIndex, setCurrentIndex] = useState(0);

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const currentShiftErrors = useMemo(
      () => filterErrorsForCurrentShift(errors, currentIndex),
      [errors, currentIndex]
    );

    const selectedProduct = useMemo(() => {
      const productId = selectedAssignShifts[currentIndex]?.product_id;
      if (!productId) return null;

      return (
        products?.find(
          (product: Product) => product?.id?.toString() === productId.toString()
        ) || null
      );
    }, [products, selectedAssignShifts, currentIndex]);

    const handleSwitchShift = (index: number) => {
      setCurrentIndex(index);
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedProduct) {
        toast.error(
          t("selectProduct") ||
            "Please select a product before assigning the shift"
        );
        return;
      }

      let validationErrors = handlerValidation(selectedAssignShifts);
      setErrors(validationErrors);
      if (Object.keys(validationErrors).length === 0) {
        const assignShiftsPayload = {
          assign_shifts: selectedAssignShifts.map((shift) => {
            const shiftRole =
              shift.shiftRole
                ?.filter((role) => !role.isDisabled)
                .map((role) => ({
                  employee_id: role.employee_id
                    ? Number(role.employee_id)
                    : null,
                  proximity: role.proximity,
                  break_duration: role.break_duration?.toString(),
                  start_day: role.start_day,
                })) || [];

            return {
              shift_id: parseInt(shift.id as string),
              shiftRole: shiftRole || [],
            };
          }),
        };
        try {
          const formData = new FormData();
          formData.append(
            "assign_shifts",
            JSON.stringify(assignShiftsPayload.assign_shifts)
          );

          let response = await ShiftService.assignShifts(formData);

          const updatedShiftsByIdMap = new Map();
          response?.data.forEach((updatedShift: Shift) => {
            if (updatedShift.id) {
              updatedShiftsByIdMap.set(
                updatedShift.id.toString(),
                updatedShift
              );
            }
          });

          const allUpdatedShifts = shifts.map((shift) => {
            if (shift.id && updatedShiftsByIdMap.has(shift.id.toString())) {
              const updatedShift = updatedShiftsByIdMap.get(
                shift.id.toString()
              );
              return { ...shift, ...updatedShift };
            }
            return shift;
          });
          onShiftsChange(allUpdatedShifts);

          toast.success(response?.message || tcommon("operation_successful"));
          setSelectedAssignShifts([]);
          setErrors({});
          onClose();
        } catch (error) {
          console.error("Error assigning shifts:", error);
          toast.error(tcommon("an_error_occurred"));
        }
      }
    };

    const handleUpdateShift = (updatedShift: Shift) => {
      const newShifts = [...selectedAssignShifts];
      newShifts[currentIndex] = updatedShift;
      setSelectedAssignShifts(newShifts);
    };

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[985px] max-h-[90vh] bg-white rounded-[32px] p-8 overflow-y-auto">
          <DialogTitle className="text-[36px] font-semibold text-center">
            {t("assign_shifts_title")}
          </DialogTitle>

          <form onSubmit={handleSubmit}>
            <Suspense
              fallback={<div>{tcommon("loading") || "Loading..."}</div>}
            >
              {selectedAssignShifts.length > 1 && (
                <ShiftsList
                  selectedShifts={selectedAssignShifts}
                  selectedShiftIndex={currentIndex}
                  switchSelectedShift={handleSwitchShift}
                />
              )}

              {!selectedProduct && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    {t("selectProduct") ||
                      "Please select a product for this shift before assigning personnel."}
                  </p>
                </div>
              )}

              {selectedProduct?.productPersonnelPricings &&
                selectedAssignShifts[currentIndex] && (
                  <LazyPersonalDetail
                    shifts={{
                      ...selectedAssignShifts[currentIndex],
                      documents:
                        selectedAssignShifts[currentIndex].documents ?? [],
                    }}
                    onUpdate={handleUpdateShift}
                    errors={currentShiftErrors}
                    product={selectedProduct}
                  />
                )}
              <div className="flex justify-end gap-6 mt-10">
                <SMSButton
                  type="button"
                  className="rounded-full px-8"
                  variant={"outline"}
                  onClick={onClose}
                >
                  {tactions("cancel")}
                </SMSButton>
                <SMSButton
                  type="submit"
                  className="bg-[#2D2D2D] rounded-full px-8"
                  disabled={!selectedProduct}
                >
                  {tactions("save")}
                </SMSButton>
              </div>
            </Suspense>
          </form>
        </DialogContent>
      </Dialog>
    );
  }
);
