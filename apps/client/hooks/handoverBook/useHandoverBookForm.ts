import { useCallback, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Shift } from "@/types/shift";
import HandoverBookService from "@/services/handoverBook";
import { useAuth } from "@/providers/appProvider";
import { format } from "date-fns";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useEmployeeTable } from "@/hooks/employee/useEmployeeTable";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import ShiftService from "@/services/shift";
import ProjectUSNShiftsService from "@/services/projectUsnShift";

export interface HandoverBookCheck {
  section: "START_OF_SHIFT" | "END_OF_SHIFT";
  workType: string;
  isOk: boolean;
  descriptionIfNotOk?: string;
  reportedTo?: string;
  status?: string;
}

export interface CoolantOilValues {
  coolantPercent: string;
  lubricantPercent: string;
  hydraulicsPercent: string;
  transmissionOilPercent: string;
  engineOilPercent: string;
}

export interface HandoverBookFormData {
  locomotiveNumber: string;
  shiftId: number | null;
  date: string;
  trainDriverName: string;
  dutyStartTime: string;
  dutyEndTime: string;
  locationStart: string;
  locationEnd: string;
  operatingStart: string;
  operatingEnd: string;
  fuelLevelStart: number | null;
  fuelLevelEnd: number | null;
  cleanSwept: boolean;
  cleanTrashEmptied: boolean;
  cleanCockpitCleaning: boolean;
  otherRemarks: string;
  signature: string;
  checks: HandoverBookCheck[];
  coolantOilValues: CoolantOilValues;
}

const initialCheck: HandoverBookCheck = {
  section: "START_OF_SHIFT",
  workType: "",
  isOk: false,
};

const defaultStartOfShiftWorkTypes = [
  "Preheating System Function",
  "Check Coolant Level / Lubricant / Hydrostatics / Gearbox and Engine Oil",
  "On-board Voltage, EBULA & GSMR, Instrument Lighting",
  "Monitoring Devices PZB/INDUSI/SIFA",
  "Visual Inspection Outside",
  "Brake Leakage Test",
  "Horn / Sand Control Function / Headlights",
  "Release Locomotive Brake / Parking Brake",
];

const defaultEndOfShiftWorkTypes = [
  "Visual Inspection for Damage / Leaks",
  "Check Sand Level / Refill if Necessary",
  "Drain Main Air Reservoir",
  "Visual Inspection Outside",
];

const getDefaultChecks = (): HandoverBookCheck[] => {
  const startChecks: HandoverBookCheck[] = defaultStartOfShiftWorkTypes.map(
    (workType) => ({
      section: "START_OF_SHIFT" as const,
      workType,
      isOk: false,
      descriptionIfNotOk: "",
      reportedTo: "",
      status: "",
    })
  );

  const endChecks: HandoverBookCheck[] = defaultEndOfShiftWorkTypes.map(
    (workType) => ({
      section: "END_OF_SHIFT" as const,
      workType,
      isOk: false,
      descriptionIfNotOk: "",
      reportedTo: "",
      status: "",
    })
  );

  return [...startChecks, ...endChecks];
};

const initialCoolantOilValues: CoolantOilValues = {
  coolantPercent: "",
  lubricantPercent: "",
  hydraulicsPercent: "",
  transmissionOilPercent: "",
  engineOilPercent: "",
};

const initialFormData: HandoverBookFormData = {
  locomotiveNumber: "",
  shiftId: null,
  date: "",
  trainDriverName: "",
  dutyStartTime: "",
  dutyEndTime: "",
  locationStart: "",
  locationEnd: "",
  operatingStart: "",
  operatingEnd: "",
  fuelLevelStart: null,
  fuelLevelEnd: null,
  cleanSwept: false,
  cleanTrashEmptied: false,
  cleanCockpitCleaning: false,
  otherRemarks: "",
  signature: "",
  checks: getDefaultChecks(),
  coolantOilValues: initialCoolantOilValues,
};

interface UseHandoverBookFormProps {
  handoverBookId?: string;
  isUSNMode?: boolean;
}

export const useHandoverBookForm = (props?: UseHandoverBookFormProps) => {
  const { handoverBookId, isUSNMode } = props || {};
  const router = useRouter();
  const { user } = useAuth();
  const [selectedShiftIndex, setSelectedShiftIndex] = useState(0);
  const [selectedShifts, setSelectedShifts] = useState<Shift[]>([]);
  const [formData, setFormData] =
    useState<HandoverBookFormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [isUSN, setIsUSN] = useState(isUSNMode || false);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!handoverBookId;

  const { locomotives } = useLocomotiveTable(1, 100);
  const { rawEmployees: employees } = useEmployeeTable(1, 100);
  const { locations } = useLocationsList();

  const getLocomotiveNameForUSN = useCallback(
    (shift: any): string => {
      const locomotiveId = shift.locomotive_id;
      if (locomotiveId) {
        const locomotive = locomotives.find((loco) => loco.id === locomotiveId);
        return locomotive?.name || `Locomotive #${locomotiveId}`;
      }
      return "";
    },
    [locomotives]
  );

  const getTrainDriverNameForUSN = useCallback(
    (shift: any): string => {
      const trainDriverRole = shift.usn_shift_roles?.find(
        (role: any) =>
          role.role?.has_train_driver === true ||
          role.role?.name?.toLowerCase().includes("train driver")
      );

      if (trainDriverRole?.usn_shift_personnels?.[0]?.employee) {
        const employee = trainDriverRole.usn_shift_personnels[0].employee;
        return employee.name || employee.email || "";
      }

      const employeeId =
        trainDriverRole?.usn_shift_personnels?.[0]?.employee_id;
      if (employeeId) {
        const employee = employees.find((emp) => emp.id === employeeId);
        return employee?.name || "";
      }

      return "";
    },
    [employees]
  );

  const getLocationNameById = useCallback(
    (locationId: number | null | undefined): string => {
      if (!locationId) return "";
      const location = locations.find((loc) => loc.id === locationId);
      return location?.name || `Location #${locationId}`;
    },
    [locations]
  );

  const getLocationDataForUSN = useCallback(
    (shift: any): { start: string; end: string } => {
      const routePlanning = shift.usn_shift_route_planning?.[0];
      if (routePlanning) {
        return {
          start: getLocationNameById(routePlanning.start_location_id),
          end: getLocationNameById(routePlanning.end_location_id),
        };
      }
      return { start: "", end: "" };
    },
    [getLocationNameById]
  );

  const formatShiftTimeToDateTimeLocal = useCallback(
    (timeValue: any, shiftDate?: string): string => {
      if (!timeValue) {
        console.log("formatShiftTimeToDateTimeLocal: No timeValue provided");
        return "";
      }

      try {
        let date: Date;

        if (typeof timeValue === "string") {
          const timeOnlyPattern = /^(\d{1,2}):(\d{2})$/;
          const timeMatch = timeValue.match(timeOnlyPattern);

          if (timeMatch && shiftDate) {
            const hours = timeMatch[1]?.padStart(2, "0") || "00";
            const minutes = timeMatch[2] || "00";
            const dateStr = shiftDate.split("T")[0];
            date = new Date(`${dateStr}T${hours}:${minutes}`);
          } else if (timeMatch && !shiftDate) {
            const today = new Date();
            const dateStr = today.toISOString().split("T")[0];
            const hours = timeMatch[1]?.padStart(2, "0") || "00";
            const minutes = timeMatch[2] || "00";
            date = new Date(`${dateStr}T${hours}:${minutes}`);
          } else {
            date = new Date(timeValue);
          }
        } else {
          console.warn(
            "formatShiftTimeToDateTimeLocal: timeValue is not a string",
            timeValue
          );
          return "";
        }

        if (isNaN(date.getTime())) {
          console.warn(
            "formatShiftTimeToDateTimeLocal: Invalid date value:",
            timeValue
          );
          return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const result = `${year}-${month}-${day}T${hours}:${minutes}`;

        return result;
      } catch (error) {
        console.error(
          "Error formatting shift time to datetime-local:",
          error,
          timeValue
        );
        return "";
      }
    },
    []
  );

  useEffect(() => {
    if (isEditMode && handoverBookId) {
      fetchHandoverBookData();
    } else {
      fetchShiftData();
    }
  }, [user, handoverBookId, isEditMode]);

  useEffect(() => {
    if (
      !isEditMode &&
      selectedShifts.length > 0 &&
      selectedShiftIndex >= 0 &&
      selectedShiftIndex < selectedShifts.length
    ) {
      const currentShift = selectedShifts[selectedShiftIndex];

      if (currentShift && (currentShift.start_time || currentShift.end_time)) {
        let shiftDate: string | undefined = undefined;
        if (currentShift.date) {
          try {
            const date = new Date(currentShift.date);
            shiftDate = date.toISOString().split("T")[0];
          } catch (e) {
            console.warn("Could not parse shift date:", currentShift.date);
          }
        }

        const dutyStartTime = formatShiftTimeToDateTimeLocal(
          currentShift.start_time,
          shiftDate
        );
        const dutyEndTime = formatShiftTimeToDateTimeLocal(
          currentShift.end_time,
          shiftDate
        );

        if (dutyStartTime || dutyEndTime) {
          setFormData((prev) => ({
            ...prev,
            dutyStartTime: dutyStartTime,
            dutyEndTime: dutyEndTime,
          }));
        }
      }
    }
  }, [
    selectedShiftIndex,
    selectedShifts,
    isEditMode,
    formatShiftTimeToDateTimeLocal,
  ]);

  const fetchHandoverBookData = useCallback(async () => {
    if (!handoverBookId) return;
    setIsLoading(true);
    try {
      const response = isUSN
        ? await HandoverBookService.getUsnHandoverBookById(handoverBookId)
        : await HandoverBookService.getHandoverBookById(handoverBookId);

      const data = response.data?.data || response.data;
      if (data) {
        const dateValue = data.date;
        let formattedDate = "";
        if (dateValue) {
          try {
            const date = new Date(dateValue);
            formattedDate = date.toISOString().split("T")[0] ?? "";
          } catch {
            formattedDate = new Date().toISOString().split("T")[0] ?? "";
          }
        }

        const formatDateTimeLocal = (timeValue: any): string => {
          if (!timeValue) return "";
          try {
            if (
              typeof timeValue === "string" &&
              timeValue.includes(":") &&
              !timeValue.includes("T") &&
              !timeValue.includes("Z")
            ) {
              const today = new Date().toISOString().split("T")[0];
              return `${today}T${timeValue}`;
            }
            const date = new Date(timeValue);
            if (isNaN(date.getTime())) {
              return timeValue?.toString() || "";
            }
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const hours = String(date.getHours()).padStart(2, "0");
            const minutes = String(date.getMinutes()).padStart(2, "0");
            return `${year}-${month}-${day}T${hours}:${minutes}`;
          } catch (error) {
            console.error("Error formatting datetime:", error, timeValue);
            return timeValue?.toString() || "";
          }
        };

        const formatTimeString = (timeValue: any): string => {
          if (!timeValue) return "";
          // If it's already a string, return it as-is
          if (typeof timeValue === "string") {
            return timeValue;
          }
          // If it's a date object, format it as HH:mm
          try {
            const date = new Date(timeValue);
            if (!isNaN(date.getTime())) {
              return format(date, "HH:mm");
            }
          } catch {
            // If parsing fails, return as string
          }
          return timeValue?.toString() || "";
        };

        const shiftId = data.shift_id || data.usn_shift_id;
        const shiftData = data.shift || data.usn_shift;

        let latestLocomotiveName = data.locomotive_number || "";
        let latestTrainDriverName = data.train_driver_name || "";
        let latestLocationStart = data.location_start || "";
        let latestLocationEnd = data.location_end || "";
        let freshShiftData: any = null;

        if (shiftId) {
          try {
            if (isUSN) {
              const usnShiftResponse =
                await ProjectUSNShiftsService.getProjectUSNShift(shiftId);
              freshShiftData = usnShiftResponse.data || usnShiftResponse;

              latestLocomotiveName = getLocomotiveNameForUSN(freshShiftData);
              latestTrainDriverName = getTrainDriverNameForUSN(freshShiftData);
              const locationData = getLocationDataForUSN(freshShiftData);
              latestLocationStart = locationData.start;
              latestLocationEnd = locationData.end;

              if (freshShiftData) {
                const mockShift: Shift = {
                  id: shiftId,
                  date: freshShiftData.date || data.date,
                  start_time: freshShiftData.start_time || data.duty_start_time,
                  end_time: freshShiftData.end_time || data.duty_end_time,
                } as Shift;
                setSelectedShifts([mockShift]);
              }
            } else {
              const shiftResponse = await ShiftService.getShiftById(shiftId);
              freshShiftData =
                shiftResponse.data?.data || shiftResponse.data || shiftResponse;

              latestLocomotiveName =
                freshShiftData.shiftLocomotive?.[0]?.locomotive?.name || "";
              const shiftTrain = freshShiftData.shiftTrain?.[0];
              latestLocationStart = shiftTrain?.departure_location || "";
              latestLocationEnd = shiftTrain?.arrival_location || "";

              const trainDriverRole = freshShiftData.shiftRole?.find(
                (role: any) => role.shiftPersonnel?.[0]?.employee
              );
              if (trainDriverRole?.shiftPersonnel?.[0]?.employee) {
                const emp = trainDriverRole.shiftPersonnel[0].employee;
                latestTrainDriverName =
                  emp.name ||
                  (emp.user?.name ? `${emp.user.name}` : emp.user?.name || "");
              }

              if (freshShiftData) {
                const mockShift: Shift = {
                  id: shiftId,
                  date: freshShiftData.date || data.date,
                  start_time: freshShiftData.start_time || data.duty_start_time,
                  end_time: freshShiftData.end_time || data.duty_end_time,
                } as Shift;
                setSelectedShifts([mockShift]);
              }
            }
          } catch (error) {
            console.error("Error fetching latest shift data:", error);
            if (shiftData) {
              const mockShift: Shift = {
                id: shiftId,
                date: shiftData.date || data.date,
                start_time: shiftData.start_time || data.duty_start_time,
                end_time: shiftData.end_time || data.duty_end_time,
              } as Shift;
              setSelectedShifts([mockShift]);
            }
          }
        } else if (shiftData) {
          const mockShift: Shift = {
            id: shiftId,
            date: shiftData.date || data.date,
            start_time: shiftData.start_time || data.duty_start_time,
            end_time: shiftData.end_time || data.duty_end_time,
          } as Shift;
          setSelectedShifts([mockShift]);
        }

        const checksData =
          data.handoverbook_checks || data.usn_handoverbook_checks;
        const defaultChecks = getDefaultChecks();

        let mappedChecks = defaultChecks;

        if (checksData && Array.isArray(checksData) && checksData.length > 0) {
          const apiStartChecks = checksData.filter(
            (check: any) => check.section === "START_OF_SHIFT"
          );
          const apiEndChecks = checksData.filter(
            (check: any) => check.section === "END_OF_SHIFT"
          );

          mappedChecks = defaultChecks.map((defaultCheck, index) => {
            let apiCheck: any = null;

            if (defaultCheck.section === "START_OF_SHIFT") {
              const startIndex = defaultChecks
                .slice(0, index)
                .filter((c) => c.section === "START_OF_SHIFT").length;
              apiCheck = apiStartChecks[startIndex];
            } else if (defaultCheck.section === "END_OF_SHIFT") {
              const endIndex = defaultChecks
                .slice(0, index)
                .filter((c) => c.section === "END_OF_SHIFT").length;
              apiCheck = apiEndChecks[endIndex];
            }

            if (apiCheck) {
              return {
                section: defaultCheck.section,
                workType: defaultCheck.workType,
                isOk: apiCheck.is_ok ?? false,
                descriptionIfNotOk: apiCheck.description_if_not_ok || "",
                reportedTo: apiCheck.reported_to || "",
                status: apiCheck.status || "",
              };
            }

            return defaultCheck;
          });
        }

        const coolantOilData =
          data.handoverbook_coolant_oil_values ||
          data.usn_handoverbook_coolant_oil_values;
        const mappedCoolantOilValues = coolantOilData
          ? {
              coolantPercent: coolantOilData.coolant_percent || "",
              lubricantPercent: coolantOilData.lubricant_percent || "",
              hydraulicsPercent: coolantOilData.hydraulics_percent || "",
              transmissionOilPercent:
                coolantOilData.transmission_oil_percent || "",
              engineOilPercent: coolantOilData.engine_oil_percent || "",
            }
          : initialCoolantOilValues;

        let dutyStartTimeValue = "";
        let dutyEndTimeValue = "";

        if (freshShiftData) {
          dutyStartTimeValue = formatDateTimeLocal(
            freshShiftData.start_time || data.duty_start_time
          );
          dutyEndTimeValue = formatDateTimeLocal(
            freshShiftData.end_time || data.duty_end_time
          );
        } else if (shiftData) {
          dutyStartTimeValue = formatDateTimeLocal(
            shiftData.start_time || data.duty_start_time
          );
          dutyEndTimeValue = formatDateTimeLocal(
            shiftData.end_time || data.duty_end_time
          );
        } else {
          dutyStartTimeValue = formatDateTimeLocal(data.duty_start_time);
          dutyEndTimeValue = formatDateTimeLocal(data.duty_end_time);
        }

        setFormData({
          locomotiveNumber: latestLocomotiveName,
          shiftId: shiftId || null,
          date: formattedDate,
          trainDriverName: latestTrainDriverName,
          dutyStartTime: dutyStartTimeValue,
          dutyEndTime: dutyEndTimeValue,
          locationStart: latestLocationStart,
          locationEnd: latestLocationEnd,
          operatingStart: formatTimeString(data.operating_start),
          operatingEnd: formatTimeString(data.operating_end),
          fuelLevelStart: data.fuel_level_start ?? null,
          fuelLevelEnd: data.fuel_level_end ?? null,
          cleanSwept: data.clean_swept ?? false,
          cleanTrashEmptied: data.clean_trash_emptied ?? false,
          cleanCockpitCleaning: data.clean_cockpit_cleaning ?? false,
          otherRemarks: data.other_remarks || "",
          signature: data.signature || "",
          checks: mappedChecks,
          coolantOilValues: mappedCoolantOilValues,
        });
      }
    } catch (error: any) {
      console.error("Error fetching handover book:", error);
      toast.error(error?.data?.message || "Failed to load handover book data");
    } finally {
      setIsLoading(false);
    }
  }, [
    handoverBookId,
    isUSN,
    getLocomotiveNameForUSN,
    getTrainDriverNameForUSN,
    getLocationDataForUSN,
    formatShiftTimeToDateTimeLocal,
  ]);

  const fetchShiftData = useCallback(async () => {
    try {
      if (!user) return;
      const listOfShifts = localStorage.getItem("selectedShifts");
      if (listOfShifts) {
        const parsedShifts: Shift[] = JSON.parse(listOfShifts);
        setSelectedShifts(parsedShifts);

        const hasUSN = parsedShifts.some(
          (s: any) => s.has_route_planning === true
        );
        setIsUSN(hasUSN);

        if (parsedShifts.length > 0) {
          const firstShift = parsedShifts[0];
          if (firstShift) {
            let shiftDate = "";
            const shiftDateValue = firstShift.date;
            if (shiftDateValue && typeof shiftDateValue === "string") {
              try {
                const date = new Date(shiftDateValue);
                const isoString = date.toISOString();
                shiftDate =
                  isoString.split("T")[0] ||
                  new Date().toISOString().split("T")[0] ||
                  "";
              } catch {
                const defaultDate = new Date().toISOString();
                shiftDate = defaultDate.split("T")[0] || "";
              }
            } else {
              const defaultDate = new Date().toISOString();
              shiftDate = defaultDate.split("T")[0] || "";
            }

            let locomotiveName = "";
            let trainDriverName = "";
            let locationStart = "";
            let locationEnd = "";

            if (hasUSN) {
              locomotiveName = getLocomotiveNameForUSN(firstShift);
              trainDriverName = getTrainDriverNameForUSN(firstShift);
              const locationData = getLocationDataForUSN(firstShift);
              locationStart = locationData.start;
              locationEnd = locationData.end;
            } else {
              locomotiveName = firstShift.locomotive?.name || "";
              const shiftTrain = firstShift.shiftTrain?.[0];
              locationStart = shiftTrain?.departure_location || "";
              locationEnd = shiftTrain?.arrival_location || "";

              const trainDriverRole = firstShift.shiftRole?.find(
                (role: any) => role.employee
              );
              if (trainDriverRole?.employee) {
                const emp = trainDriverRole.employee;
                trainDriverName =
                  emp.name ||
                  (emp.user?.name && emp.user?.name
                    ? `${emp.user.name}`
                    : emp.user?.name || "");
              }
            }

            const dutyStartTime = formatShiftTimeToDateTimeLocal(
              firstShift.start_time,
              shiftDate || firstShift.date
            );
            const dutyEndTime = formatShiftTimeToDateTimeLocal(
              firstShift.end_time,
              shiftDate || firstShift.date
            );

            setFormData((prev) => ({
              ...prev,
              shiftId: firstShift.id
                ? parseInt(firstShift.id.toString())
                : null,
              date: shiftDate,
              locomotiveNumber: locomotiveName,
              trainDriverName: trainDriverName,
              dutyStartTime: dutyStartTime || "",
              dutyEndTime: dutyEndTime || "",
              locationStart: locationStart,
              locationEnd: locationEnd,
            }));
          }
        }
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  }, [
    user,
    getLocomotiveNameForUSN,
    getTrainDriverNameForUSN,
    getLocationDataForUSN,
    formatShiftTimeToDateTimeLocal,
  ]);

  const handleInputChange = (field: keyof HandoverBookFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCheckChange = (
    index: number,
    field: keyof HandoverBookCheck,
    value: any
  ) => {
    setFormData((prev) => {
      const newChecks = [...prev.checks];
      const existingCheck = newChecks[index] || {
        section: "START_OF_SHIFT" as const,
        workType: "",
        isOk: false,
      };
      newChecks[index] = {
        ...existingCheck,
        [field]: value,
      };
      return {
        ...prev,
        checks: newChecks,
      };
    });

    const errorKey = `checks.${index}.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addCheck = () => {
    setFormData((prev) => ({
      ...prev,
      checks: [
        ...prev.checks,
        {
          section: "START_OF_SHIFT" as const,
          workType: "",
          isOk: false,
        },
      ],
    }));
  };

  const removeCheck = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      checks: prev.checks.filter((_, i) => i !== index),
    }));
  };

  const handleCoolantOilChange = (
    field: keyof CoolantOilValues,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      coolantOilValues: {
        ...prev.coolantOilValues,
        [field]: value,
      },
    }));

    const errorKey = `coolantOilValues.${field}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const handleSignature = (signatureData: string) => {
    setFormData((prev) => ({
      ...prev,
      signature: signatureData,
    }));
    setSignatureModalOpen(false);
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.locomotiveNumber || !formData.locomotiveNumber.trim()) {
      newErrors.locomotiveNumber = "Locomotive number is required";
    }

    if (!formData.shiftId || formData.shiftId === null) {
      newErrors.shiftId = "Shift is required";
    }

    if (!formData.date || !formData.date.trim()) {
      newErrors.date = "Date is required";
    } else {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(formData.date)) {
        newErrors.date = "Date must be in YYYY-MM-DD format";
      }
    }

    if (!formData.trainDriverName || !formData.trainDriverName.trim()) {
      newErrors.trainDriverName = "Train driver name is required";
    }

    if (!formData.dutyStartTime || !formData.dutyStartTime.trim()) {
      newErrors.dutyStartTime = "Duty start time is required";
    } else {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dateTimeRegex.test(formData.dutyStartTime)) {
        newErrors.dutyStartTime = "Duty start time must be in valid format";
      }
    }

    if (!formData.dutyEndTime || !formData.dutyEndTime.trim()) {
      newErrors.dutyEndTime = "Duty end time is required";
    } else {
      const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      if (!dateTimeRegex.test(formData.dutyEndTime)) {
        newErrors.dutyEndTime = "Duty end time must be in valid format";
      }
      if (formData.dutyStartTime && formData.dutyEndTime) {
        const startTime = new Date(formData.dutyStartTime);
        const endTime = new Date(formData.dutyEndTime);
        if (endTime <= startTime) {
          newErrors.dutyEndTime = "Duty end time must be after duty start time";
        }
      }
    }

    if (!formData.locationStart || !formData.locationStart.trim()) {
      newErrors.locationStart = "Start location is required";
    }

    if (!formData.locationEnd || !formData.locationEnd.trim()) {
      newErrors.locationEnd = "End location is required";
    }

    if (!formData.operatingStart || !formData.operatingStart.trim()) {
      newErrors.operatingStart = "Operating start is required";
    }

    if (!formData.operatingEnd || !formData.operatingEnd.trim()) {
      newErrors.operatingEnd = "Operating end is required";
    }

    if (
      formData.fuelLevelStart === null ||
      formData.fuelLevelStart === undefined
    ) {
      newErrors.fuelLevelStart = "Fuel level start is required";
    } else if (typeof formData.fuelLevelStart === "number") {
      if (formData.fuelLevelStart < 0) {
        newErrors.fuelLevelStart = "Fuel level start must be a positive number";
      } else if (formData.fuelLevelStart > 8) {
        newErrors.fuelLevelStart = "Fuel level start must be 8 or less";
      }
    }

    if (formData.fuelLevelEnd === null || formData.fuelLevelEnd === undefined) {
      newErrors.fuelLevelEnd = "Fuel level end is required";
    } else if (typeof formData.fuelLevelEnd === "number") {
      if (formData.fuelLevelEnd < 0) {
        newErrors.fuelLevelEnd = "Fuel level end must be a positive number";
      } else if (formData.fuelLevelEnd > 8) {
        newErrors.fuelLevelEnd = "Fuel level end must be 8 or less";
      }
    }

    if (
      !formData.coolantOilValues.coolantPercent ||
      !formData.coolantOilValues.coolantPercent.trim()
    ) {
      newErrors["coolantOilValues.coolantPercent"] =
        "Coolant percent is required";
    } else {
      const coolantValue = parseFloat(formData.coolantOilValues.coolantPercent);
      if (isNaN(coolantValue)) {
        newErrors["coolantOilValues.coolantPercent"] =
          "Coolant percent must be a valid number";
      } else if (coolantValue < 0 || coolantValue > 100) {
        newErrors["coolantOilValues.coolantPercent"] =
          "Coolant percent must be between 0 and 100";
      }
    }

    if (
      !formData.coolantOilValues.lubricantPercent ||
      !formData.coolantOilValues.lubricantPercent.trim()
    ) {
      newErrors["coolantOilValues.lubricantPercent"] =
        "Lubricant percent is required";
    } else {
      const lubricantValue = parseFloat(
        formData.coolantOilValues.lubricantPercent
      );
      if (isNaN(lubricantValue)) {
        newErrors["coolantOilValues.lubricantPercent"] =
          "Lubricant percent must be a valid number";
      } else if (lubricantValue < 0 || lubricantValue > 100) {
        newErrors["coolantOilValues.lubricantPercent"] =
          "Lubricant percent must be between 0 and 100";
      }
    }

    if (
      !formData.coolantOilValues.hydraulicsPercent ||
      !formData.coolantOilValues.hydraulicsPercent.trim()
    ) {
      newErrors["coolantOilValues.hydraulicsPercent"] =
        "Hydraulics percent is required";
    } else {
      const hydraulicsValue = parseFloat(
        formData.coolantOilValues.hydraulicsPercent
      );
      if (isNaN(hydraulicsValue)) {
        newErrors["coolantOilValues.hydraulicsPercent"] =
          "Hydraulics percent must be a valid number";
      } else if (hydraulicsValue < 0 || hydraulicsValue > 100) {
        newErrors["coolantOilValues.hydraulicsPercent"] =
          "Hydraulics percent must be between 0 and 100";
      }
    }

    if (
      !formData.coolantOilValues.transmissionOilPercent ||
      !formData.coolantOilValues.transmissionOilPercent.trim()
    ) {
      newErrors["coolantOilValues.transmissionOilPercent"] =
        "Transmission oil percent is required";
    } else {
      const transmissionValue = parseFloat(
        formData.coolantOilValues.transmissionOilPercent
      );
      if (isNaN(transmissionValue)) {
        newErrors["coolantOilValues.transmissionOilPercent"] =
          "Transmission oil percent must be a valid number";
      } else if (transmissionValue < 0 || transmissionValue > 100) {
        newErrors["coolantOilValues.transmissionOilPercent"] =
          "Transmission oil percent must be between 0 and 100";
      }
    }

    if (
      !formData.coolantOilValues.engineOilPercent ||
      !formData.coolantOilValues.engineOilPercent.trim()
    ) {
      newErrors["coolantOilValues.engineOilPercent"] =
        "Engine oil percent is required";
    } else {
      const engineOilValue = parseFloat(
        formData.coolantOilValues.engineOilPercent
      );
      if (isNaN(engineOilValue)) {
        newErrors["coolantOilValues.engineOilPercent"] =
          "Engine oil percent must be a valid number";
      } else if (engineOilValue < 0 || engineOilValue > 100) {
        newErrors["coolantOilValues.engineOilPercent"] =
          "Engine oil percent must be between 0 and 100";
      }
    }

    formData.checks.forEach((check, index) => {
      if (!check.isOk) {
        if (!check.descriptionIfNotOk || !check.descriptionIfNotOk.trim()) {
          newErrors[`checks.${index}.descriptionIfNotOk`] =
            "Description is required when check is not OK";
        }
        if (!check.reportedTo || !check.reportedTo.trim()) {
          newErrors[`checks.${index}.reportedTo`] =
            "Reported to is required when check is not OK";
        }
        if (!check.status || !check.status.trim()) {
          newErrors[`checks.${index}.status`] =
            "Status is required when check is not OK";
        }
      }
    });

    if (!formData.signature || !formData.signature.trim()) {
      newErrors.signature = "Signature is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const processedChecks = formData.checks.map((check) => {
        if (check.isOk) {
          return {
            section: check.section,
            workType: check.workType,
            isOk: check.isOk,
          };
        } else {
          return {
            section: check.section,
            workType: check.workType,
            isOk: check.isOk,
            descriptionIfNotOk: check.descriptionIfNotOk || "",
            reportedTo: check.reportedTo || "",
            status: check.status || "",
          };
        }
      });

      const handoverBookData: any = {
        locomotiveNumber: formData.locomotiveNumber,
        date: formData.date,
        trainDriverName: formData.trainDriverName,
        dutyStartTime: formData.dutyStartTime,
        dutyEndTime: formData.dutyEndTime,
        locationStart: formData.locationStart,
        locationEnd: formData.locationEnd,
        operatingStart: formData.operatingStart,
        operatingEnd: formData.operatingEnd,
        fuelLevelStart: formData.fuelLevelStart,
        fuelLevelEnd: formData.fuelLevelEnd,
        cleanSwept: formData.cleanSwept,
        cleanTrashEmptied: formData.cleanTrashEmptied,
        cleanCockpitCleaning: formData.cleanCockpitCleaning,
        otherRemarks: formData.otherRemarks,
        signature: formData.signature,
        checks: processedChecks,
        coolantOilValues: formData.coolantOilValues,
      };

      if (isUSN) {
        handoverBookData.usnShiftId = formData.shiftId;
      } else {
        handoverBookData.shiftId = formData.shiftId;
      }

      const formDataToSend = new FormData();
      formDataToSend.append(
        isUSN ? "usnHandoverbooks" : "handoverbooks",
        JSON.stringify(handoverBookData)
      );

      if (isEditMode && handoverBookId) {
        const response = isUSN
          ? await HandoverBookService.updateUsnHandoverBook(
              formDataToSend,
              handoverBookId
            )
          : await HandoverBookService.updateHandoverBook(
              formDataToSend,
              handoverBookId
            );

        toast.success(response.message || "Handover book updated successfully");
        setTimeout(() => {
          router.push("/handover-book");
        }, 1000);
      } else {
        const response = isUSN
          ? await HandoverBookService.createUsnHandoverBook(formDataToSend)
          : await HandoverBookService.createHandoverBook(formDataToSend);

        toast.success(response.message || "Handover book created successfully");
        localStorage.removeItem("selectedShifts");

        setTimeout(() => {
          if (isUSN) {
            router.push(
              "/shift-management/project-usn-shifts/usn-shifts/monthly"
            );
          } else {
            router.push("/shift-management/regular-shifts/monthly");
          }
        }, 1000);
      }
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.data?.message || "Failed to create handover book");
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchSelectedShift = (index: number) => {
    setSelectedShiftIndex(index);
    const shift = selectedShifts[index];
    if (shift) {
      let shiftDate = "";
      const shiftDateValue = shift.date;
      if (shiftDateValue && typeof shiftDateValue === "string") {
        try {
          const date = new Date(shiftDateValue);
          const isoString = date.toISOString();
          shiftDate =
            isoString.split("T")[0] ||
            new Date().toISOString().split("T")[0] ||
            "";
        } catch {
          const defaultDate = new Date().toISOString();
          shiftDate = defaultDate.split("T")[0] || "";
        }
      } else {
        const defaultDate = new Date().toISOString();
        shiftDate = defaultDate.split("T")[0] || "";
      }

      let locomotiveName = "";
      let trainDriverName = "";
      let locationStart = "";
      let locationEnd = "";

      if (isUSN) {
        locomotiveName = getLocomotiveNameForUSN(shift);
        trainDriverName = getTrainDriverNameForUSN(shift);
        const locationData = getLocationDataForUSN(shift);
        locationStart = locationData.start;
        locationEnd = locationData.end;
      } else {
        locomotiveName = shift.locomotive?.name || "";
        const shiftTrain = shift.shiftTrain?.[0];
        locationStart = shiftTrain?.departure_location || "";
        locationEnd = shiftTrain?.arrival_location || "";

        const trainDriverRole = shift.shiftRole?.find(
          (role: any) => role.employee
        );
        if (trainDriverRole?.employee) {
          const emp = trainDriverRole.employee;
          trainDriverName =
            emp.name ||
            (emp.user?.name && emp.user?.name
              ? `${emp.user.name}`
              : emp.user?.name || "");
        }
      }

      const dutyStartTime = formatShiftTimeToDateTimeLocal(
        shift.start_time,
        shiftDate
      );
      const dutyEndTime = formatShiftTimeToDateTimeLocal(
        shift.end_time,
        shiftDate
      );

      setFormData((prev) => ({
        ...prev,
        shiftId: shift.id ? parseInt(shift.id.toString()) : null,
        date: shiftDate,
        locomotiveNumber: locomotiveName,
        trainDriverName: trainDriverName,
        dutyStartTime: dutyStartTime,
        dutyEndTime: dutyEndTime,
        locationStart: locationStart,
        locationEnd: locationEnd,
      }));
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    isLoading,
    selectedShiftIndex,
    selectedShifts,
    signatureModalOpen,
    setSignatureModalOpen,
    handleInputChange,
    handleCheckChange,
    addCheck,
    removeCheck,
    handleCoolantOilChange,
    handleSignature,
    handleSubmit,
    switchSelectedShift,
    isUSN,
    isEditMode,
  };
};
