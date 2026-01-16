import { pdf } from "@react-pdf/renderer";
import { Shift } from "@/types/shift";
import { Timesheet } from "@/types/timeSheet";
import TimesheetPDF from "@/components/PDF/TimesheetPDF";

interface TimesheetPDFData {
  shift: Shift;
  timesheet: Timesheet;
  employeeName?: string;
  employeeRoleName?: string;
}

const globalDownloadLock = new Map<string, boolean>();
const ABSOLUTE_LOCK_TIME = 5000;

const getPDFFileName = (data: TimesheetPDFData): string => {
  const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 100);
  };

  const reportNumber = data.timesheet.report_number;
  if (reportNumber) {
    return `Bautagesbericht_${sanitizeFilename(reportNumber)}.pdf`;
  }

  const formatDateForFilename = (dateStr?: string): string => {
    if (!dateStr) {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
    try {
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    } catch {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    }
  };
  const dateStr = formatDateForFilename(data.shift.date);
  const safeEmployeeName = data.employeeName
    ? sanitizeFilename(data.employeeName)
    : "Employee";
  return `Bautagesbericht_${dateStr}_${safeEmployeeName}.pdf`;
};

export const generateTimesheetPDFAsFile = async (
  data?: TimesheetPDFData
): Promise<File | null> => {
  try {
    if (!data?.shift || !data?.timesheet) {
      return null;
    }

    const blob = await pdf(
      <TimesheetPDF
        shift={data.shift}
        timesheet={data.timesheet}
        employeeName={data.employeeName}
        employeeRoleName={data.employeeRoleName}
      />
    ).toBlob();

    const fileName = getPDFFileName(data);
    const file = new File([blob], fileName, { type: "application/pdf" });
    
    return file;
  } catch (error) {
    console.error("❌ Error generating PDF as File:", error);
    return null;
  }
};

export const generateTimesheetPDF = async (
  data?: TimesheetPDFData
): Promise<void> => {
  try {
    if (!data?.shift || !data?.timesheet) {
      return;
    }

    const reportNumber = data.timesheet.report_number;
    const uniqueKey = reportNumber
      ? `${data.shift.id}-${data.timesheet.employee_id}-${reportNumber}`
      : `${data.shift.id}-${data.timesheet.employee_id}-${data.shift.date}-${data.employeeName || "Employee"}`;

    if (globalDownloadLock.get(uniqueKey) === true) {
      return;
    }

    globalDownloadLock.set(uniqueKey, true);

    const fileName = getPDFFileName(data);
    const blob = await pdf(
      <TimesheetPDF
        shift={data.shift}
        timesheet={data.timesheet}
        employeeName={data.employeeName}
        employeeRoleName={data.employeeRoleName}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.style.display = "none";
    document.body.appendChild(link);

    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 100);

    setTimeout(() => {
      globalDownloadLock.delete(uniqueKey);
    }, ABSOLUTE_LOCK_TIME);
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    const uniqueKey = `${data?.shift?.id}-${data?.timesheet?.employee_id}`;
    globalDownloadLock.delete(uniqueKey);
    throw error;
  }
};

export const generateMultipleTimesheetPDFs = async (
  shifts: Shift[],
  timesheets: { shiftId: string; employeeId: string; timesheet: Timesheet }[]
): Promise<void> => {
  let delayIndex = 0;

  for (const shift of shifts) {
    const shiftTimesheets = timesheets.filter(
      (t) => t.shiftId === shift.id?.toString()
    );

    for (const { employeeId, timesheet } of shiftTimesheets) {
      const employee = shift.shiftRole?.find(
        (r) => r.employee_id?.toString() === employeeId
      )?.employee;

      setTimeout(async () => {
        const role = shift.shiftRole?.find(
          (r) => r.employee_id?.toString() === employeeId
        ) as any;
        const employeeRole = (role as any)?.role;
        await generateTimesheetPDF({
          shift,
          timesheet,
          employeeName: employee?.name,
          employeeRoleName: role?.short_name || role?.name,
        });
      }, delayIndex * 1000);

      delayIndex++;
    }
  }
};
