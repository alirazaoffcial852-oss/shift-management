import { useBaseShift } from "./useBaseShift";
import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ShiftService from "@/services/shift";
import { ShiftTransformer } from "@/utils/transformers/shiftTransformer";
import { validateShiftForm } from "@/utils/validation/shift";
import { Shift } from "@/types/shift";
import { reorganizeErrors } from "@/utils/calendar";
import { useTranslations } from "next-intl";

export const useEditShift = () => {
  const base = useBaseShift();
  const router = useRouter();
  const t = useTranslations("pages.shift");
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<number[]>([]);

  useEffect(() => {
    fetchShiftData();
  }, []);

  const fetchShiftData = useCallback(async () => {
    try {
      const listOfShifts = localStorage.getItem("selectedShifts");
      if (listOfShifts && !selectedShifts.length) {
        const parsedShifts = JSON.parse(listOfShifts);
        const processedShifts = ShiftTransformer.transformForEdit(parsedShifts);
        setSelectedShifts(processedShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error(t("failedToFetchShiftData"));
    }
  }, []);

  const handleDocumentRemoval = (documentId: number) => {
    setRemovedDocumentIds((prev) => [...prev, documentId]);
  };

  const handleSubmit = async () => {
    try {
      let allValid = true;
      let finalErrors: { [key: string]: string } = {};
      for (let step = 0; step < 4; step++) {
        const stepErrors = validateShiftForm([], selectedShifts, step, true);
        finalErrors = { ...finalErrors, ...stepErrors };
        if (Object.keys(stepErrors).length > 0) {
          allValid = false;
        }
      }
      if (!allValid) {
        const reorganizedErrors = reorganizeErrors(finalErrors);
        base.setErrors(reorganizedErrors);
        toast.error(t("pleaseCompleteAllRequiredFields"));
        return;
      }
      base.setIsSubmitting(true);
      const processedData = ShiftTransformer.transformForUpdate(selectedShifts);
      const formData = new FormData();
      formData.append("shifts", JSON.stringify(processedData));
      if (base.files?.length) {
        base.files.forEach((file) => formData.append("documents", file));
      }
      if (removedDocumentIds.length > 0) {
        formData.append("removedDocuments", JSON.stringify(removedDocumentIds));
      }
      const isOfferShift =
        selectedShifts.length > 0 && selectedShifts[0]?.status === "OFFER";
      const response = isOfferShift
        ? await ShiftService.updateOfferShift(formData)
        : await ShiftService.updateShifts(formData);
      toast.success(response.message);
      localStorage.removeItem("selectedShifts");

      if (isOfferShift) {
        router.push("/shift-management/regular-shifts/monthly");
        setTimeout(() => {
          window.location.href = "/shift-management/regular-shifts/monthly";
        }, 100);
      } else {
        router.push("/shift-management/regular-shifts/monthly");
      }
    } catch (error) {
      toast.error(t("failedToUpdateShifts"));
    } finally {
      base.setIsSubmitting(false);
    }
  };

  const switchSelectedShift = (index: number) => {
    setSelectedShiftIndex(index);
  };

  return {
    ...base,
    selectedShiftIndex,
    selectedShifts,
    setSelectedShifts,
    switchSelectedShift,
    handleSubmit,
    handleDocumentRemoval,
    removedDocumentIds,
    currentErrors: Array.isArray(base.errors)
      ? base.errors[selectedShiftIndex] || {}
      : base.errors,
  };
};
