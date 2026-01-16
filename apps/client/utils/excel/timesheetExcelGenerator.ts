import * as XLSX from "xlsx";
import { Shift } from "@/types/shift";
import { Timesheet } from "@/types/timeSheet";

interface TimesheetExcelData {
  shift: Shift;
  timesheet: Timesheet;
  employeeName?: string;
}

export const generateTimesheetExcel = (data: TimesheetExcelData): void => {
  const { shift, timesheet, employeeName } = data;

  const wb = XLSX.utils.book_new();

  const calculateTotalHours = (
    start: string,
    end: string,
    breakDur: string
  ): string => {
    if (!start || !end) return "";
    try {
      const [startH, startM] = start.split(":").map(Number);
      const [endH, endM] = end.split(":").map(Number);
      const breakMinutes = parseInt(breakDur || "0");

      if (
        typeof startH !== "number" ||
        isNaN(startH) ||
        typeof startM !== "number" ||
        isNaN(startM) ||
        typeof endH !== "number" ||
        isNaN(endH) ||
        typeof endM !== "number" ||
        isNaN(endM)
      ) {
        return "";
      }

      const startMinutes = startH * 60 + startM;
      const endMinutes = endH * 60 + endM;
      const totalMinutes = endMinutes - startMinutes - breakMinutes;

      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      return `${hours}:${minutes.toString().padStart(2, "0")}`;
    } catch {
      return "";
    }
  };

  const formatDate = (dateStr?: string): string => {
    if (!dateStr) return new Date().toLocaleDateString("de-DE");
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("de-DE");
    } catch {
      return new Date().toLocaleDateString("de-DE");
    }
  };

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

  const getValue = (value: any, defaultValue: string = "x"): string => {
    if (value === null || value === undefined || value === "")
      return defaultValue;
    return String(value);
  };

  const excelData: any[][] = [];

  excelData.push([]);
  excelData.push(["Bautagesbericht", "", "", "", "", "", ""]);
  excelData.push([]);

  excelData.push(["Neo Lox", "", "Train Driver", "", "", "", ""]);
  excelData.push([
    "costcenter construction project (by)",
    getValue(shift.bv_project?.name || shift.project?.name, "x"),
    getValue(employeeName, "NamcXY"),
    "",
    "",
    "",
    "",
  ]);
  excelData.push(["", "", "Shanting Attendant", "", "", "", ""]);
  excelData.push([
    "",
    "",
    getValue(
      shift.shiftRole?.find((r) => r.employee?.name !== employeeName)?.employee
        ?.name,
      "NamaXY"
    ),
    "",
    "",
    "",
    "",
  ]);
  excelData.push(["", "", "Data", "", "", "", ""]);
  excelData.push([
    "",
    "",
    getValue(formatDate(shift.date), "todays date"),
    "",
    "",
    "",
    "",
  ]);
  excelData.push(["", "", "", "", "", "reportnumber", ""]);
  excelData.push([]);

  excelData.push([
    "Bezeichnung (BV)",
    getValue(shift.bv_project?.name, "x"),
    "",
    "",
    "",
    "",
    "",
  ]);
  excelData.push([
    "customer",
    getValue(shift.customer?.name, "X"),
    "",
    "",
    "",
    "",
    "",
  ]);
  excelData.push([
    "Logistician",
    getValue(shift.dispatcher?.name, ""),
    "",
    "",
    "",
    "",
    "",
  ]);
  excelData.push([
    "contact person X",
    getValue(shift.shiftDetail?.contact_person_name, ""),
    "",
    "",
    "",
    "",
    "",
  ]);
  excelData.push([]);

  excelData.push([
    "from",
    "to",
    "Break duration",
    "Total hours",
    "-",
    "Locomotive-Number",
    "comments/remark",
  ]);

  const totalHours = calculateTotalHours(
    timesheet.start_time,
    timesheet.end_time,
    timesheet.break_duration
  );

  excelData.push([
    getValue(timesheet.start_time, "x"),
    getValue(timesheet.end_time, "x"),
    getValue(timesheet.break_duration, "x"),
    getValue(totalHours, "x"),
    "",
    getValue(
      shift.locomotive && "number" in shift.locomotive
        ? shift.locomotive.number
        : shift.locomotive_id,
      "x"
    ),
    getValue(timesheet.notes, ""),
  ]);

  for (let i = 0; i < 5; i++) {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  excelData.push([]);

  excelData.push([
    "Train number",
    "Departure (train) station",
    "notice of completion",
    "Departure time",
    "Arrival (train) station",
    "Arrival time",
    "comments/remarks",
  ]);

  if (shift.shiftTrain && shift.shiftTrain.length > 0) {
    shift.shiftTrain.forEach((train) => {
      excelData.push([
        getValue(train.train_no, "x"),
        getValue(train.departure_location, "x"),
        "",
        "",
        getValue(train.arrival_location, "x"),
        "",
        "",
      ]);
    });
  } else {
    excelData.push(["x", "x", "", "", "x", "", ""]);
  }

  for (let i = 0; i < 5; i++) {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  excelData.push([]);

  excelData.push(["works performed/work carried out", "", "", "", "", "", ""]);
  excelData.push(["from", "to", "", "", "", "", ""]);

  const worksNotes = timesheet.notes || "";
  if (worksNotes) {
    const noteLines = worksNotes.split("\n").filter((line) => line.trim());
    if (noteLines.length > 0) {
      noteLines.forEach((line) => {
        excelData.push(["", "", line.trim(), "", "", "", ""]);
      });
    } else {
      excelData.push(["", "", "", "", "", "", ""]);
    }
  } else {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  for (let i = 0; i < 10; i++) {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  excelData.push([]);

  excelData.push([
    "Obstructions / Difficulties / Changes / Special events and instructions made by whom",
    "",
    "",
    "",
    "",
    "",
    "Changer",
  ]);
  excelData.push(["from", "to", "", "", "", "", ""]);

  if (timesheet.extra_hours_note) {
    const obstructionLines = timesheet.extra_hours_note
      .split("\n")
      .filter((line) => line.trim());
    if (obstructionLines.length > 0) {
      obstructionLines.forEach((line) => {
        excelData.push(["", "", line.trim(), "", "", "", ""]);
      });
    } else {
      excelData.push(["", "", "", "", "", "", ""]);
    }
  } else {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  for (let i = 0; i < 10; i++) {
    excelData.push(["", "", "", "", "", "", ""]);
  }

  excelData.push([]);
  excelData.push([]);

  excelData.push([
    "Name Employee in Block Letters",
    getValue(employeeName, "x"),
    "",
    "",
    "Name Supervisor in Block Letters",
    "",
    "",
  ]);
  excelData.push([
    "Date X",
    formatDate(shift.date),
    "",
    "",
    "Location Date",
    "",
    "",
  ]);
  excelData.push([
    "Location Date",
    getValue(shift.location, ""),
    "",
    "",
    "Location Date",
    getValue(shift.location, ""),
    "",
  ]);
  excelData.push(["Signature", "", "", "", "Signature costumer", "", ""]);

  const ws = XLSX.utils.aoa_to_sheet(excelData);

  const colWidths = [
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 15 },
    { wch: 20 },
    { wch: 25 },
  ];
  ws["!cols"] = colWidths;

  const range = XLSX.utils.decode_range(ws["!ref"] || "A1");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws[cellAddress]) continue;

      if (R < 15) {
        ws[cellAddress].t = "s";
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws, "Bautagesbericht");

  const sanitizeFilename = (name: string): string => {
    return name.replace(/[^a-zA-Z0-9_-]/g, "_").substring(0, 100);
  };

  // Use report_number for filename, fallback to date and employee name if not available
  const reportNumber = timesheet.report_number;
  const fileName = reportNumber
    ? `Bautagesbericht_${sanitizeFilename(reportNumber)}.xlsx`
    : (() => {
        const dateStr = formatDateForFilename(shift.date);
        const safeEmployeeName = employeeName
          ? sanitizeFilename(employeeName)
          : "Employee";
        return `Bautagesbericht_${dateStr}_${safeEmployeeName}.xlsx`;
      })();

  XLSX.writeFile(wb, fileName);
};

export const generateMultipleTimesheetExcels = (
  shifts: Shift[],
  timesheets: { shiftId: string; employeeId: string; timesheet: Timesheet }[]
): void => {
  shifts.forEach((shift) => {
    const shiftTimesheets = timesheets.filter(
      (t) => t.shiftId === shift.id?.toString()
    );

    shiftTimesheets.forEach(({ employeeId, timesheet }) => {
      const employee = shift.shiftRole?.find(
        (r) => r.employee_id?.toString() === employeeId
      )?.employee;

      generateTimesheetExcel({
        shift,
        timesheet,
        employeeName: employee?.name,
      });
    });
  });
};
