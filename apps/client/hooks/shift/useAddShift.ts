import { useBaseShift } from "./useBaseShift";
import { useEffect, useState } from "react";
import ShiftService from "@/services/shift";
import { useRouter, useSearchParams } from "next/navigation";
import { IniateShift, Shift } from "@/types/shift";
import { validateShiftForm } from "@/utils/validation/shift";
import { toast } from "sonner";
import { addDays, format } from "date-fns";
import { reorganizeErrors } from "@/utils/calendar";
import { ShiftTransformer } from "@/utils/transformers/shiftTransformer";
import { useTranslations } from "next-intl";

export const useAddShift = () => {
  const searchParams = useSearchParams();
  const t = useTranslations("pages.shift");

  const base = useBaseShift();

  const router = useRouter();

  const [iniateShift, setIniateShift] = useState<IniateShift[]>([
    {
      start_date: null,
      end_date: null,
      start_time: "",
      end_time: "",
      roundsCount: 1,
      showRounds: true,
    },
  ]);
  const [customizeProduct, setCustomizeProduct] = useState<any>([]);

  const [shifts, setShifts] = useState<Shift>({
    shiftDetail: {
      contact_person_name: "",
      contact_person_phone: "",
      has_contact_person: true,
      has_document: false,
      has_locomotive: true,
      has_note: true,
      location: "",
      note: "",
      cost_center_id: "",
      type_of_operation_id: "",
    },
    shiftRole: [],
    shiftTrain: [
      {
        train_no: "",
        departure_location: "",
        arrival_location: "",
        isEnabled: true,
        freight_transport: false,
      },
    ],
    phone_no: "",
    customer_id: "",
    project_id: "",
    bv_project_id: "",
    product_id: "",
    dispatcher_id: "",
    company_id: "",
    location: "",
    status: "OPEN",
  });

  useEffect(() => {
    const date = searchParams.get("date");
    const offer = searchParams.get("offer");
    if (date) {
      const startDate = new Date(date);
      let endDateStr = date;
      if (!isNaN(startDate.getTime())) {
        endDateStr = format(startDate, "yyyy-MM-dd");
      }

      setIniateShift((prevState) =>
        prevState.map((shift) => ({
          ...shift,
          start_date: date as string,
          end_date: endDateStr,
          showRounds: false,
        }))
      );
    }
    if (offer) {
      setShifts((prevState) => ({
        ...prevState,
        status: "OFFER",
      }));
    }
  }, [searchParams]);

  const handleContinue = () => {
    const stepErrors = validateShiftForm(iniateShift, shifts, base.currentStep);
    base.setErrors(stepErrors);

    if (Object.keys(stepErrors).length === 0) {
      if (base.currentStep < 3) {
        base.setCurrentStep((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast.error(t("pleaseCheckAllNecessaryOptions"));
    }
  };

  const processShiftData = (): {
    processedData: any[];
    diagnostics: {
      hasValidRows: boolean;
      missingFields: string[];
      invalidDates: string[];
      invalidRounds: string[];
    };
  } => {
    const processedData: any[] = [];
    const processedSignatures = new Set<string>();
    const diagnostics = {
      hasValidRows: false,
      missingFields: [] as string[],
      invalidDates: [] as string[],
      invalidRounds: [] as string[],
    };

    iniateShift.forEach((row, index) => {
      const rowIssues: string[] = [];

      if (!row.start_date) {
        rowIssues.push(`Row ${index + 1}: Missing start date`);
        diagnostics.missingFields.push(`shifts[${index}].start_date`);
      }

      if (!row.end_date) {
        rowIssues.push(`Row ${index + 1}: Missing end date`);
        diagnostics.missingFields.push(`shifts[${index}].end_date`);
      }

      if (!row.roundsCount || row.roundsCount <= 0) {
        rowIssues.push(`Row ${index + 1}: Invalid rounds count (must be > 0)`);
        diagnostics.invalidRounds.push(`shifts[${index}].roundsCount`);
      }

      if (row.start_date && row.end_date) {
        try {
          const startDate = new Date(row.start_date);
          const endDate = new Date(row.end_date);

          if (isNaN(startDate.getTime())) {
            rowIssues.push(`Row ${index + 1}: Invalid start date format`);
            diagnostics.invalidDates.push(`shifts[${index}].start_date`);
          }

          if (isNaN(endDate.getTime())) {
            rowIssues.push(`Row ${index + 1}: Invalid end date format`);
            diagnostics.invalidDates.push(`shifts[${index}].end_date`);
          }

          if (
            !isNaN(startDate.getTime()) &&
            !isNaN(endDate.getTime()) &&
            endDate < startDate
          ) {
            rowIssues.push(`Row ${index + 1}: End date is before start date`);
            diagnostics.invalidDates.push(`shifts[${index}].end_date`);
          }
        } catch (error) {
          rowIssues.push(`Row ${index + 1}: Error parsing dates`);
          diagnostics.invalidDates.push(`shifts[${index}].start_date`);
          diagnostics.invalidDates.push(`shifts[${index}].end_date`);
        }
      }

      if (row.start_date && row.end_date && row.roundsCount > 0) {
        try {
          const dates: Date[] = [];
          let currentDate = new Date(row.start_date);
          const endDate = new Date(row.end_date);

          if (isNaN(currentDate.getTime()) || isNaN(endDate.getTime())) {
            rowIssues.push(`Row ${index + 1}: Invalid date values`);
            return;
          }

          if (endDate < currentDate) {
            rowIssues.push(`Row ${index + 1}: End date is before start date`);
            return;
          }

          while (currentDate <= endDate) {
            dates.push(new Date(currentDate));
            currentDate = addDays(currentDate, 1);
          }

          const numberOfRounds = Math.max(
            1,
            parseInt(row.roundsCount.toString()) || 1
          );

          for (let round = 0; round < numberOfRounds; round++) {
            dates.forEach((date) => {
              const formattedDate = format(date, "yyyy-MM-dd");

              const shiftData: any = {
                date: formattedDate,
                start_time: row.start_time,
                end_time: row.end_time,
                customer_id: Number(shifts.customer_id)
                  ? Number(shifts.customer_id)
                  : null,
                project_id: shifts.project_id
                  ? Number(shifts.project_id)
                  : null,
                bv_project_id: shifts.bv_project_id
                  ? Number(shifts.bv_project_id)
                  : null,
                product_id: shifts.product_id
                  ? Number(shifts.product_id)
                  : null,
                company_id: Number(base.company?.id),
                location: shifts.location,
                type_of_operation_id: shifts.shiftDetail.type_of_operation_id
                  ? Number(shifts.shiftDetail.type_of_operation_id)
                  : null,
                has_locomotive: shifts.shiftDetail.has_locomotive,
                has_contact_person: shifts.shiftDetail.has_contact_person,
                has_document: shifts.shiftDetail.has_document,
                has_note: shifts.shiftDetail.has_note,
                shiftRole: ShiftTransformer.transformRolesForUpdate(
                  shifts.shiftRole || []
                ),
                shiftTrain: ShiftTransformer.transformTrainsForUpdate(
                  shifts.shiftTrain || []
                ),
              };

              if (shifts.locomotive_id) {
                shiftData.locomotive_id = shifts.locomotive_id
                  ? Number(shifts.locomotive_id)
                  : null;
              }

              if (shifts.shiftDetail.has_contact_person) {
                shiftData.contact_person_name =
                  shifts.shiftDetail.contact_person_name;
                shiftData.contact_person_phone =
                  shifts.shiftDetail.contact_person_phone;
              }

              if (shifts.shiftDetail.has_note) {
                shiftData.note = shifts.shiftDetail.note;
              }

              if (shifts.dispatcher_id) {
                shiftData.dispatcher_id = shifts.dispatcher_id
                  ? Number(shifts.dispatcher_id)
                  : null;
              }

              if (shifts.shiftDetail.cost_center_id) {
                shiftData.cost_center_id = Number(
                  shifts.shiftDetail.cost_center_id
                );
              }

              if (customizeProduct.length > 0) {
                shiftData.has_custom_pricing = true;
                shiftData.productCustomPricing = customizeProduct;
              } else {
                shiftData.has_custom_pricing = false;
              }

              const signature = `${shiftData.date}_${shiftData.start_time}_${shiftData.end_time}_${shiftData.customer_id}_${shiftData.product_id}`;

              processedSignatures.add(signature);
              processedData.push(shiftData);
            });
          }

          diagnostics.hasValidRows = true;
        } catch (error) {
          rowIssues.push(
            `Row ${index + 1}: Error processing dates - ${error instanceof Error ? error.message : "Unknown error"}`
          );
        }
      }
    });

    return { processedData, diagnostics };
  };

  const handleSubmit = async () => {
    try {
      if (base.isSubmitting) {
        return;
      }

      let finalErrors = {};
      for (let step = 0; step < 4; step++) {
        const stepErrors = validateShiftForm(iniateShift, shifts, step);
        if (Object.keys(stepErrors).length > 0) {
          finalErrors = { ...finalErrors, ...stepErrors };
        }
      }

      if (Object.keys(finalErrors).length > 0) {
        const reorganizedErrors = reorganizeErrors(finalErrors);
        base.setErrors(reorganizedErrors);
        toast.error(t("pleaseCompleteAllRequiredFields"));
        return;
      }

      base.setIsSubmitting(true);
      const { processedData, diagnostics } = processShiftData();

      if (processedData.length === 0) {
        let errorMessage = t("noValidShiftsToCreate");
        const errorDetails: string[] = [];

        if (diagnostics.missingFields.length > 0) {
          errorDetails.push(
            `Missing required fields: ${diagnostics.missingFields.join(", ")}`
          );
        }

        if (diagnostics.invalidDates.length > 0) {
          errorDetails.push(
            `Invalid dates: ${diagnostics.invalidDates.join(", ")}`
          );
        }

        if (diagnostics.invalidRounds.length > 0) {
          errorDetails.push(
            `Invalid rounds count: ${diagnostics.invalidRounds.join(", ")}`
          );
        }

        if (errorDetails.length > 0) {
          errorMessage = `${errorMessage}\n\nDetails:\n${errorDetails.join("\n")}`;
        }

        console.error("Shift creation failed - Diagnostics:", diagnostics);
        console.error("IniateShift data:", iniateShift);
        toast.error(errorMessage);
        base.setIsSubmitting(false);
        return;
      }

      const formData = new FormData();
      formData.append("shifts", JSON.stringify(processedData));

      if (base.files?.length) {
        base.files.forEach((file) => {
          formData.append("documents", file);
        });
      }

      console.log("Creating shift with data:", {
        shiftCount: processedData.length,
        status: shifts?.status,
        firstShift: processedData[0],
      });

      const response =
        shifts?.status === "OFFER"
          ? await ShiftService.createOfferShift(formData)
          : await ShiftService.createShift(formData);
      toast.success(response.message);
      router.push("/shift-management/regular-shifts/monthly");
    } catch (error) {
      console.error("Error creating shift:", error);
      console.error("Shift data context:", {
        status: shifts?.status,
        iniateShift,
        shiftsState: shifts,
      });

      let errorMessage = t("anUnexpectedErrorOccurred");
      let errorDetails = "";

      if (error && typeof error === "object") {
        // Log full error object for debugging
        console.error("Full error object:", JSON.stringify(error, null, 2));

        if ("data" in error && error.data) {
          if (typeof error.data === "object") {
            if ("message" in error.data) {
              // @ts-ignore
              errorMessage = error.data.message;
            }
            if ("errors" in error.data) {
              // @ts-ignore
              const errors = error.data.errors;
              if (typeof errors === "object" && errors !== null) {
                const errorList = Object.entries(errors)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join("\n");
                errorDetails = `\n\nValidation errors:\n${errorList}`;
              }
            }
            if ("error" in error.data) {
              // @ts-ignore
              errorDetails = `\n\nError: ${error.data.error}`;
            }
          } else if (typeof error.data === "string") {
            errorMessage = error.data;
          }
        }

        if ("message" in error && typeof error.message === "string") {
          errorMessage = error.message;
        }

        if ("response" in error && error.response) {
          // @ts-ignore
          console.error("Error response:", error.response);
          // @ts-ignore
          if (error.response.data) {
            // @ts-ignore
            console.error("Error response data:", error.response.data);
          }
        }
      }

      toast.error(`${errorMessage}${errorDetails}`);
    } finally {
      base.setIsSubmitting(false);
    }
  };

  return {
    ...base,
    shifts,
    setShifts,
    iniateShift,
    setIniateShift,
    handleContinue,
    handleSubmit,
    setCustomizeProduct,
    currentErrors: Array.isArray(base.errors)
      ? base.errors[0] || {}
      : base.errors,
  };
};
