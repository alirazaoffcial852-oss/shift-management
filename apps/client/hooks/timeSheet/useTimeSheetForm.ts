import { useCallback, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shift } from "@/types/shift";
import TimeSheetService from "@/services/timeSheet";
import {
  validateAllTimesheets,
  validateTimeSheet,
} from "@/utils/validation/timesheet";
import { useAuth } from "@/providers/appProvider";
import { Timesheet } from "@/types/timeSheet";
import timeSheet from "@/services/timeSheet";
import { useTranslations } from "next-intl";
import {
  generateTimesheetPDF,
  generateTimesheetPDFAsFile,
} from "@/utils/pdf/timesheetPDFGenerator";

function formatTimeString(isoTimestamp: string) {
  if (!isoTimestamp) return "";

  try {
    const date = new Date(isoTimestamp);

    if (isNaN(date.getTime())) return "";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "";
  }
}

export const useTimeSheet = () => {
  const router = useRouter();
  const { user } = useAuth();
  const t = useTranslations("timesheet");
  let userRole = user?.role?.name;
  let isClient = userRole === "CLIENT";
  let userId = user?.id;
  let clientId = user?.clientId;
  const employeeId = user?.employeeId;

  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [errors, setErrors] = useState<
    | { [key: string]: { [key: string]: string } }
    | { [key: string]: string }
    | Array<{ [key: string]: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [supervisorSignatureModalOpen, setSupervisorSignatureModalOpen] =
    useState(false);
  const [signature, setSignature] = useState<string>("");
  const [supervisorSignature, setSupervisorSignature] = useState<string>("");
  const [signatureType, setSignatureType] = useState<"employee" | "supervisor">(
    "employee"
  );
  const [selectedEmployees, setSelectedEmployees] = useState<{
    [shiftIndex: number]: string[];
  }>({});

  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const isGeneratingPDFsRef = useRef(false);
  const submittedTimesheetsRef = useRef<Set<string>>(new Set());
  const generatedPDFsRef = useRef<Set<string>>(new Set());
  const submissionTokenRef = useRef<string | null>(null);

  useEffect(() => {
    fetchShiftData();
  }, [user]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...droppedFiles]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...selectedFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const viewDocument = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  };

  const initializeTimesheet = (
    shift: Shift,
    empId: string,
    break_duration: string
  ) => {
    let initialTrainDetails: any[] = [];

    if (shift?.shiftTrain && shift.shiftTrain.length > 0) {
      const firstTrain = shift.shiftTrain[0];
      initialTrainDetails = [
        {
          train_no: firstTrain?.train_no || "",
          departure_location: firstTrain?.departure_location || "",
          departure_time: "",
          arrival_location: firstTrain?.arrival_location || "",
          arrival_time: "",
          notice_of_completion: "",
          remarks: "",
        },
      ];
    } else if (
      (shift as any)?.usn_shift_route_planning &&
      (shift as any).usn_shift_route_planning.length > 0
    ) {
      const firstRoute = (shift as any).usn_shift_route_planning[0];
      const departureLocation =
        firstRoute.start_location?.name ||
        firstRoute.start_location_id?.toString() ||
        "";
      const arrivalLocation =
        firstRoute.end_location?.name ||
        firstRoute.end_location_id?.toString() ||
        "";

      initialTrainDetails = [
        {
          train_no: firstRoute.train_no || "",
          departure_location: departureLocation,
          departure_time: "",
          arrival_location: arrivalLocation,
          arrival_time: "",
          notice_of_completion: "",
          remarks: "",
        },
      ];
    } else {
      initialTrainDetails = [
        {
          train_no: "",
          departure_location: "",
          departure_time: "",
          arrival_location: "",
          arrival_time: "",
          notice_of_completion: "",
          remarks: "",
        },
      ];
    }

    return {
      shift_id: shift?.id ?? "",
      company_id: shift?.company_id ?? "",
      employee_id: empId,
      start_time: formatTimeString(shift?.start_time?.toString() ?? ""),
      end_time: formatTimeString(shift?.end_time?.toString() ?? ""),
      is_night_shift: false,
      is_holiday: false,
      has_extra_hours: false,
      extra_hours: null,
      extra_hours_note: "",
      break_duration: break_duration || "0",
      max_break_duration: break_duration || "0",
      notes: "",
      isEnabled: isClient ? true : empId?.toString() === employeeId?.toString(),
      train_details: initialTrainDetails,
      work_performances: [],
      changes: [],
    };
  };

  const handleEmployeeSelect = (values: string[]) => {
    if (!isClient) {
      const currentSelected = selectedEmployees[selectedShiftIndex] || [];
      const removedEmployees = currentSelected.filter(
        (id) => !values.includes(id)
      );
      const addedEmployees = values.filter(
        (id) => !currentSelected.includes(id)
      );

      setSelectedEmployees((prev) => {
        const newState = {
          ...prev,
          [selectedShiftIndex]: values,
        };
        return newState;
      });

      setSelectedShifts((prev) => {
        const newShifts = [...prev];
        const currentShift = newShifts[selectedShiftIndex];

        if (!currentShift) return prev;

        if (!currentShift.timesheets) {
          currentShift.timesheets = {};
        }

        removedEmployees.forEach((employeeId) => {
          if (currentShift.timesheets && currentShift.timesheets[employeeId]) {
            delete currentShift.timesheets[employeeId];
          }
        });

        addedEmployees.forEach((employeeId) => {
          if (currentShift.timesheets) {
            let breakDuration = "0";
            if (currentShift.shiftRole) {
              const employeeRole = currentShift.shiftRole.find(
                (role) => role.employee_id.toString() === employeeId.toString()
              );
              if (employeeRole) {
                breakDuration = employeeRole.break_duration || "0";
              }
            }

            const newTimesheet = initializeTimesheet(
              currentShift,
              employeeId,
              breakDuration
            );
            newTimesheet.isEnabled = true;
            currentShift.timesheets[employeeId] = newTimesheet;
          }
        });

        values.forEach((employeeId) => {
          if (currentShift.timesheets && !currentShift.timesheets[employeeId]) {
            let breakDuration = "0";
            if (currentShift.shiftRole) {
              const employeeRole = currentShift.shiftRole.find(
                (role) => role.employee_id.toString() === employeeId.toString()
              );
              if (employeeRole) {
                breakDuration = employeeRole.break_duration || "0";
              }
            }

            const newTimesheet = initializeTimesheet(
              currentShift,
              employeeId,
              breakDuration
            );
            newTimesheet.isEnabled = true;
            currentShift.timesheets[employeeId] = newTimesheet;
          } else if (
            currentShift.timesheets &&
            currentShift.timesheets[employeeId]
          ) {
            currentShift.timesheets[employeeId].isEnabled = true;
          }
        });

        return newShifts;
      });
    }
  };

  const fetchShiftData = useCallback(async () => {
    try {
      if (!user) return;
      const listOfShifts = localStorage.getItem("selectedShifts");
      if (listOfShifts && !selectedShifts.length) {
        const parsedShifts: Shift[] = JSON.parse(listOfShifts);

        const initializedShifts = parsedShifts.map((shift, index) => {
          const normalizedShift: Shift = {
            ...shift,
            shiftRole:
              Array.isArray((shift as any).shiftRole) &&
              (shift as any).shiftRole.length > 0
                ? (shift as any).shiftRole
                : ((shift as any).usn_shift_roles || []).map((role: any) => {
                    const empId =
                      role?.usn_shift_personnels?.[0]?.employee_id ||
                      role?.employee_id;
                    return {
                      role_id: role?.role_id,
                      employee_id: empId,
                      break_duration: role?.break_duration || "0",
                      employee: role?.usn_shift_personnels?.[0]?.employee || {
                        id: empId,
                        name: `Employee #${empId}`,
                      },
                      has_submitted_timesheet:
                        role?.has_submitted_timesheet || false,
                    } as any;
                  }),
          } as any;

          let timesheets: { [key: string]: Timesheet } = {};
          let shiftEmployees: string[] = [];

          if (
            Array.isArray((normalizedShift as any).shiftRole) &&
            (normalizedShift as any).shiftRole.length > 0
          ) {
            timesheets = (normalizedShift as any).shiftRole.reduce(
              (
                acc: {
                  [x: string]: {
                    shift_id: string;
                    company_id: string;
                    employee_id: string;
                    start_time: string;
                    end_time: string;
                    is_night_shift: boolean;
                    is_holiday: boolean;
                    has_extra_hours: boolean;
                    extra_hours: null;
                    extra_hours_note: string;
                    break_duration: string;
                    max_break_duration: string;
                    notes: string;
                    isEnabled: boolean;
                  };
                },
                role: {
                  has_submitted_timesheet: any;
                  employee_id: string;
                  break_duration: string;
                }
              ) => {
                if (
                  (isClient && !role?.has_submitted_timesheet) ||
                  (role.employee_id.toString() === employeeId?.toString() &&
                    !role?.has_submitted_timesheet)
                ) {
                  const breakDuration = role.break_duration || "0";

                  acc[role.employee_id] = initializeTimesheet(
                    normalizedShift as any,
                    role.employee_id,
                    breakDuration
                  );
                  shiftEmployees.push(role.employee_id);
                }
                return acc;
              },
              {} as { [key: string]: Timesheet }
            );
          }

          setSelectedEmployees((prev) => ({
            ...prev,
            [index]: shiftEmployees,
          }));

          return {
            ...(normalizedShift as any),
            timesheets: timesheets,
          } as any;
        });

        setSelectedShifts(initializedShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  }, [selectedShifts, isClient, userId]);

  const handleSubmit = async (
    submit: boolean = false,
    signatureData?: string,
    signatureTypeParam?: "employee" | "supervisor"
  ) => {
    if (signatureTypeParam) {
      setSignatureType(signatureTypeParam);
    }
    const executionToken = `exec-${Date.now()}-${Math.random()}`;

    if (!submissionTokenRef.current) {
      submissionTokenRef.current = executionToken;
    } else {
      return;
    }

    if (isSubmitting || isGeneratingPDFsRef.current) {
      submissionTokenRef.current = null;
      return;
    }

    try {
      let hasErrors = false;
      const allErrors: {
        [index: number]: { [key: string]: { [key: string]: string } };
      } = {};

      selectedShifts.forEach((shift: Shift, index: number) => {
        if (shift.timesheets) {
          Object.entries(shift.timesheets).forEach(([empId, timesheet]) => {
            if (timesheet.isEnabled) {
              const maxBreakDuration = parseInt(
                timesheet.max_break_duration || "0"
              );
              const currentBreakDuration = parseInt(
                timesheet.break_duration || "0"
              );

              if (currentBreakDuration > maxBreakDuration) {
                if (!allErrors[index]) allErrors[index] = {};
                if (!allErrors[index][empId]) allErrors[index][empId] = {};

                allErrors[index][empId].break_duration = t(
                  "breakDurationCannotExceed",
                  { maxBreakDuration }
                );
                hasErrors = true;
              }

              // Validate notes length
              if (
                timesheet.notes &&
                timesheet.notes.trim().length > 0 &&
                timesheet.notes.trim().length < 3
              ) {
                if (!allErrors[index]) allErrors[index] = {};
                if (!allErrors[index][empId]) allErrors[index][empId] = {};
                allErrors[index][empId].notes =
                  "Note must be at least 3 characters";
                hasErrors = true;
                toast.error("Note must be at least 3 characters");
              }
            }
          });
        }
      });

      selectedShifts.forEach((shift: Shift, index: number) => {
        const shiftErrors = validateAllTimesheets(shift);
        if (Object.keys(shiftErrors).length > 0) {
          hasErrors = true;
          if (!allErrors[index]) allErrors[index] = {};
          Object.assign(allErrors[index], shiftErrors);
        }
      });

      if (Object.keys(allErrors).includes(selectedShiftIndex.toString())) {
        setErrors(allErrors[selectedShiftIndex] || {});
      }

      if (hasErrors) {
        toast.error(t("pleaseFillAllRequiredFields"));
        return;
      }

      if (files.length === 0) {
        toast.error(t("pleaseUploadAtLeastOneDocument"));
        return;
      }

      // If submitting, we need both signatures - check if they exist
      if (submit) {
        // Check if we have both signatures stored in timesheet objects
        let hasEmployeeSignature = false;
        let hasSupervisorSignature = false;

        selectedShifts.forEach((shift) => {
          if (shift.timesheets) {
            Object.values(shift.timesheets).forEach((ts) => {
              if (ts.isEnabled) {
                if (ts.signature) hasEmployeeSignature = true;
                if ((ts as any).supervisor_signature)
                  hasSupervisorSignature = true;
              }
            });
          }
        });

        // Also check state variables
        if (signature) hasEmployeeSignature = true;
        if (supervisorSignature) hasSupervisorSignature = true;

        if (!hasEmployeeSignature) {
          setSignatureType("employee");
          setSignatureModalOpen(true);
          submissionTokenRef.current = null;
          return;
        }
        if (!hasSupervisorSignature) {
          setSignatureType("supervisor");
          setSupervisorSignatureModalOpen(true);
          submissionTokenRef.current = null;
          return;
        }
      }

      setIsSubmitting(true);
      isGeneratingPDFsRef.current = true;

      const isUSN = selectedShifts.some(
        (s: any) => s.has_route_planning === true
      );

      const generateReportNumber = () => {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, "0");
        return `RPT-${timestamp}-${random}`;
      };

      const timesheets = selectedShifts.flatMap((shift: Shift) => {
        return Object.values(shift.timesheets || {})
          .filter((timesheet: Timesheet) => timesheet.isEnabled)
          .map((timesheet: Timesheet) => {
            const reportNumber = generateReportNumber();

            if (
              shift.timesheets &&
              shift.timesheets[timesheet.employee_id || ""]
            ) {
              shift.timesheets[timesheet.employee_id || ""]!.report_number =
                reportNumber;
            }

            const baseTimesheet = {
              shift_id: shift.id || "",
              company_id: shift.company_id || "",
              start_time: timesheet.start_time || "",
              end_time: timesheet.end_time || "",
              is_night_shift: timesheet.is_night_shift || false,
              is_holiday: timesheet.is_holiday || false,
              has_extra_hours: timesheet.has_extra_hours || false,
              break_duration: timesheet.break_duration || "0",
              notes: timesheet.notes || "",
              employee_id: timesheet.employee_id || null,
              report_number: reportNumber,
              self_created: isClient
                ? false
                : timesheet.employee_id?.toString() === employeeId?.toString(),
              train_details:
                timesheet.train_details && timesheet.train_details.length > 0
                  ? timesheet.train_details.filter(
                      (td) =>
                        td.train_no ||
                        td.departure_location ||
                        td.arrival_location
                    )
                  : [],
              work_performances:
                timesheet.work_performances &&
                timesheet.work_performances.length > 0
                  ? timesheet.work_performances.filter(
                      (wp) => wp.work_performance
                    )
                  : [],
              changes:
                timesheet.changes && timesheet.changes.length > 0
                  ? timesheet.changes.filter((c) => c.changes || c.changer)
                  : [],
            };

            if (timesheet.has_extra_hours) {
              return {
                ...baseTimesheet,
                extra_hours: timesheet.extra_hours || 0,
                extra_hours_note: timesheet.extra_hours_note || "",
              };
            }
            return baseTimesheet;
          });
      });

      if (timesheets.length === 0) {
        toast.error(t("pleaseSelectEmployeeToAddTimesheet"));
        setIsSubmitting(false);
        isGeneratingPDFsRef.current = false;
        return;
      }

      const submissionKey = timesheets
        .map((t) => `${t.shift_id}-${t.employee_id}`)
        .sort()
        .join("|");

      if (submittedTimesheetsRef.current.has(submissionKey)) {
        setIsSubmitting(false);
        isGeneratingPDFsRef.current = false;
        return;
      }

      submittedTimesheetsRef.current.add(submissionKey);

      const formData = new FormData();
      formData.append("timesheets", JSON.stringify(timesheets));
      formData.append(
        "check_timesheet",
        isUSN ? "usn_shift_timesheet" : "regular_shift_timesheet"
      );
      // Collect signatures from all enabled timesheets
      // For now, we'll use the first enabled timesheet's signatures
      // In the future, this could be per-timesheet
      let employeeSig = "";
      let supervisorSig = "";

      for (const shift of selectedShifts) {
        if (shift.timesheets) {
          for (const ts of Object.values(shift.timesheets)) {
            if (ts.isEnabled) {
              if (ts.signature && !employeeSig) {
                employeeSig = ts.signature;
              }
              if ((ts as any).supervisor_signature && !supervisorSig) {
                supervisorSig = (ts as any).supervisor_signature;
              }
            }
          }
        }
      }

      // Use signatureData if provided (from immediate signature submission)
      if (signatureData) {
        if (signatureType === "employee" || signatureTypeParam === "employee") {
          employeeSig = signatureData;
        } else if (
          signatureType === "supervisor" ||
          signatureTypeParam === "supervisor"
        ) {
          supervisorSig = signatureData;
        }
      }

      if (employeeSig) {
        formData.append("signature", employeeSig);
      }

      if (supervisorSig) {
        formData.append("supervisor_signature", supervisorSig);
      }

      if (files && files.length > 0) {
        files.forEach((file) => {
          formData.append("documents", file);
        });
      }

      try {
        for (const timesheetData of timesheets) {
          const shift = selectedShifts.find(
            (s) => s.id?.toString() === timesheetData.shift_id?.toString()
          );

          if (!shift || !shift.timesheets) continue;

          const employeeIdKey = timesheetData.employee_id?.toString() || "";
          const timesheet = shift.timesheets[employeeIdKey];
          if (!timesheet) continue;

          const shiftRole = shift.shiftRole?.find(
            (role) =>
              role.employee_id?.toString() ===
              timesheetData.employee_id?.toString()
          );
          const employee = shiftRole?.employee;
          const employeeRole = (shiftRole as any)?.role;

          const empSig = timesheet.signature || signature || "";
          const supSig =
            (timesheet as any).supervisor_signature ||
            supervisorSignature ||
            "";

          const timesheetWithData = {
            ...timesheet,
            report_number: timesheetData.report_number,
            signature: empSig,
            supervisor_signature: supSig,
          };

          const pdfFile = await generateTimesheetPDFAsFile({
            shift,
            timesheet: timesheetWithData,
            employeeName: employee?.name,
            employeeRoleName: employeeRole?.short_name || employeeRole?.name,
          });

          if (pdfFile) {
            formData.append("documents", pdfFile);
          }
        }
      } catch (pdfError) {
        console.error("❌ Error generating PDFs for upload:", pdfError);
      }

      const response = await TimeSheetService.createTimeSheet(formData);
      toast.success(response.message);

      try {
        const batchId = `batch-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`;

        const pdfsToGenerate: Array<{
          shift: Shift;
          timesheet: Timesheet;
          employeeName?: string;
          employeeRoleName?: string;
        }> = [];

        const thisSessionPDFs = new Set<string>();

        for (const timesheetData of timesheets) {
          const shift = selectedShifts.find(
            (s) => s.id?.toString() === timesheetData.shift_id?.toString()
          );

          if (!shift || !shift.timesheets) continue;

          const employeeIdKey = timesheetData.employee_id?.toString() || "";
          const timesheet = shift.timesheets[employeeIdKey];
          if (!timesheet) continue;

          const pdfIdentifier = `${timesheetData.shift_id}-${timesheetData.employee_id}`;

          if (thisSessionPDFs.has(pdfIdentifier)) {
            continue;
          }

          if (generatedPDFsRef.current.has(pdfIdentifier)) {
            continue;
          }

          thisSessionPDFs.add(pdfIdentifier);
          generatedPDFsRef.current.add(pdfIdentifier);

          const shiftRole = shift.shiftRole?.find(
            (role) =>
              role.employee_id?.toString() ===
              timesheetData.employee_id?.toString()
          );
          const employee = shiftRole?.employee;
          const employeeRole = (shiftRole as any)?.role;

          // Ensure report_number and signatures are in the timesheet object for PDF
          // Use report_number from timesheetData (the payload we sent) or from timesheet object
          const reportNumber =
            timesheetData.report_number ||
            timesheet.report_number ||
            (timesheet as any).report_number;

          // Get signatures from timesheet object, payload, or state
          const empSig =
            timesheet.signature ||
            (timesheetData as any).signature ||
            signature ||
            "";
          const supSig =
            (timesheet as any).supervisor_signature ||
            (timesheetData as any).supervisor_signature ||
            supervisorSignature ||
            "";

          const timesheetWithData = {
            ...timesheet,
            report_number: reportNumber,
            signature: empSig,
            supervisor_signature: supSig,
          };

          pdfsToGenerate.push({
            shift,
            timesheet: timesheetWithData,
            employeeName: employee?.name,
            employeeRoleName: employeeRole?.short_name || employeeRole?.name,
          });
        }

        if (pdfsToGenerate.length > 0) {
          const generateSequentially = async () => {
            for (let i = 0; i < pdfsToGenerate.length; i++) {
              const pdfData = pdfsToGenerate[i];
              if (!pdfData) continue;

              const pdfId = `${pdfData.shift.id}-${pdfData.timesheet.employee_id}`;

              try {
                await generateTimesheetPDF(pdfData);

                if (i < pdfsToGenerate.length - 1) {
                  await new Promise((resolve) => setTimeout(resolve, 1200));
                }
              } catch (pdfError) {
                console.error(`❌ [${batchId}] PDF ${i + 1} failed:`, pdfError);
                generatedPDFsRef.current.delete(pdfId);
              }
            }
          };
          generateSequentially();
        }
      } catch (pdfError) {
        console.error("❌ PDF generation error:", pdfError);
      }

      localStorage.removeItem("selectedShifts");
      setFiles([]);

      setTimeout(() => {
        if (isUSN) {
          router.push(
            "/shift-management/project-usn-shifts/usn-shifts/monthly"
          );
        } else {
          router.push("/shift-management/regular-shifts/monthly");
        }
      }, 1000);
    } catch (error: any) {
      console.error("❌ Submission error:", error);
      toast.error(error.data?.message || t("failedToAddTimesheet"));
      isGeneratingPDFsRef.current = false;
      submittedTimesheetsRef.current.clear();
    } finally {
      setSignature("");
      setSupervisorSignature("");
      setIsSubmitting(false);
      submissionTokenRef.current = null;

      setTimeout(() => {
        isGeneratingPDFsRef.current = false;
        submittedTimesheetsRef.current.clear();
        setTimeout(() => {
          generatedPDFsRef.current.clear();
        }, 60000);
      }, 5000);
    }
  };

  const validateField = (employeeId: string, field: string, value: any) => {
    const currentTimesheet =
      selectedShifts[selectedShiftIndex]?.timesheets?.[employeeId];
    if (!currentTimesheet) return;

    const tempTimesheet = {
      ...currentTimesheet,
      [field]: value,
    };

    if (field === "break_duration") {
      const maxBreakDuration = parseInt(
        currentTimesheet.max_break_duration || "0"
      );
      const inputBreakDuration = parseInt(value || "0");

      if (inputBreakDuration > maxBreakDuration) {
        setErrors((prev) => ({
          ...(prev as { [key: string]: { [key: string]: string } }),
          [employeeId]: {
            ...((prev as { [key: string]: { [key: string]: string } })[
              employeeId
            ] || {}),
            break_duration: t("breakDurationCannotExceed", {
              maxBreakDuration,
            }),
          },
        }));
        return;
      }
    }

    // Validate notes length
    if (
      field === "notes" &&
      value &&
      value.trim().length > 0 &&
      value.trim().length < 3
    ) {
      toast.error("Note must be at least 3 characters");
    }

    const validationErrors = validateTimeSheet(tempTimesheet);
    setErrors((prev) => ({
      ...(prev as { [key: string]: { [key: string]: string } }),
      [employeeId]: validationErrors,
    }));
  };

  const handleInputChange = (employeeId: string, field: string, value: any) => {
    if (field === "break_duration") {
      const currentTimesheet =
        selectedShifts[selectedShiftIndex]?.timesheets?.[employeeId];
      if (currentTimesheet) {
        const maxBreakDuration = parseInt(
          currentTimesheet.max_break_duration || "0"
        );
        const inputBreakDuration = parseInt(value || "0");

        if (inputBreakDuration > maxBreakDuration) {
          toast.error(t("breakDurationCannotExceed", { maxBreakDuration }));
          value = maxBreakDuration.toString();
        }

        if (inputBreakDuration < 0) {
          value = "0";
        }
      }
    }

    setSelectedShifts((prev: Shift[]) => {
      const newShifts = [...prev];
      const currentShift = newShifts[selectedShiftIndex];

      if (!currentShift || !currentShift.timesheets) {
        if (!currentShift) return prev;
        currentShift.timesheets = {};
      }

      currentShift.timesheets[employeeId] = {
        ...currentShift.timesheets[employeeId],
        [field]:
          field === "start_time" || field === "end_time" ? value || "" : value,
      } as Timesheet;

      return newShifts;
    });

    validateField(employeeId, field, value);
  };

  const switchSelectedShift = (index: number) => {
    setSelectedShiftIndex(index);
  };

  const copyToAllShifts = (checked: boolean) => {
    if (checked) {
      const currentTimesheet = selectedShifts[selectedShiftIndex]?.timesheets;
      setSelectedShifts((prev: Shift[]) => {
        return prev.map((shift: Shift) => ({
          ...shift,
          timesheets: { ...currentTimesheet },
        }));
      });
    }
  };

  const handleSignature = async (
    signatureData: string,
    type: "employee" | "supervisor" = "employee"
  ) => {
    if (!signatureData) return toast.error(t("addSignature"));

    // Store signature in all enabled timesheet objects for the current shift
    setSelectedShifts((prev: Shift[]) => {
      const newShifts = [...prev];
      const currentShift = newShifts[selectedShiftIndex];

      if (currentShift && currentShift.timesheets) {
        Object.keys(currentShift.timesheets).forEach((empId) => {
          if (
            currentShift.timesheets &&
            currentShift.timesheets[empId] &&
            currentShift.timesheets[empId].isEnabled
          ) {
            if (type === "employee") {
              currentShift.timesheets[empId].signature = signatureData;
            } else {
              (currentShift.timesheets[empId] as any).supervisor_signature =
                signatureData;
            }
          }
        });
      }

      return newShifts;
    });

    if (type === "employee") {
      setSignature(signatureData);
      setSignatureModalOpen(false);
      toast.success("Employee signature added successfully");
    } else {
      setSupervisorSignature(signatureData);
      setSupervisorSignatureModalOpen(false);
      toast.success("Supervisor signature added successfully");
    }
  };

  const toggleTimesheetEnabled = (employeeId: string, enabled: boolean) => {
    if (!isClient) return;

    setSelectedShifts((prev: Shift[]) => {
      const newShifts = [...prev];
      const currentShift = newShifts[selectedShiftIndex];

      if (!currentShift) return prev;

      if (!currentShift.timesheets) {
        currentShift.timesheets = {};
      }

      let breakDuration = "0";
      if (currentShift.shiftRole) {
        const employeeRole = currentShift.shiftRole.find(
          (role) => role.employee_id.toString() === employeeId.toString()
        );
        if (employeeRole) {
          breakDuration = employeeRole.break_duration || "0";
        }
      }

      if (enabled && !currentShift.timesheets[employeeId]) {
        currentShift.timesheets[employeeId] = initializeTimesheet(
          currentShift,
          employeeId,
          breakDuration
        );
      }

      currentShift.timesheets[employeeId] = {
        ...currentShift.timesheets[employeeId],
        isEnabled: enabled,
        start_time: currentShift.timesheets[employeeId]?.start_time || "",
        end_time: currentShift.timesheets[employeeId]?.end_time || "",
        break_duration:
          currentShift.timesheets[employeeId]?.break_duration || breakDuration,
        max_break_duration: breakDuration,
        notes: currentShift.timesheets[employeeId]?.notes || "",
      };

      return newShifts;
    });
  };

  return {
    isSubmitting,
    errors,
    selectedShiftIndex,
    selectedShifts,
    setSelectedShifts,
    switchSelectedShift,
    handleSubmit,
    currentErrors: errors as { [key: string]: string },
    validateField,
    handleInputChange,
    copyToAllShifts,
    signatureModalOpen,
    setSignatureModalOpen,
    supervisorSignatureModalOpen,
    setSupervisorSignatureModalOpen,
    handleSignature,
    toggleTimesheetEnabled,
    handleEmployeeSelect,
    selectedEmployees: selectedEmployees[selectedShiftIndex] || [],
    userId,
    clientId,
    isClient,
    files,
    dragActive,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    viewDocument,
  };
};
