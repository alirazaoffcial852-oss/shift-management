import { Shift } from "@/types/shift";
import { Timesheet } from "@/types/timeSheet";

export const validateTimeSheet = (timesheet: Timesheet) => {
  const errors: { [key: string]: string } = {};

  // Skip validation if timesheet is disabled
  if (!timesheet.isEnabled) {
    return errors;
  }

  if (!timesheet.start_time || timesheet.start_time.trim() === "") {
    errors.start_time = "Start time is required";
  }

  if (!timesheet.end_time || timesheet.end_time.trim() === "") {
    errors.end_time = "End time is required";
  }
  if (!timesheet.break_duration || timesheet.break_duration.trim() === "") {
    errors.break_duration = "Break Duration is required";
  }

  // if (timesheet.start_time && timesheet.end_time) {
  //   const startTime = new Date(`2000/01/01 ${timesheet.start_time}`);
  //   const endTime = new Date(`2000/01/01 ${timesheet.end_time}`);

  //   if (endTime <= startTime) {
  //     errors.end_time = "End time must be after start time";
  //   }
  // }

  if (timesheet.has_extra_hours) {
    if (!timesheet.extra_hours || timesheet.extra_hours <= 0) {
      errors.extra_hours = "Extra hours must be greater than 0";
    }
    if (!timesheet.extra_hours_note?.trim()) {
      errors.extra_hours_note = "Please provide a note for extra hours";
    }
  }

  if (timesheet.notes && timesheet.notes.length > 500) {
    errors.notes = "Notes cannot exceed 500 characters";
  }

  if (timesheet.notes && timesheet.notes.trim().length > 0 && timesheet.notes.trim().length < 3) {
    errors.notes = "Note must be at least 3 characters";
  }

  // Validate train_details - all fields are required for each entry
  if (timesheet.train_details && timesheet.train_details.length > 0) {
    const trainDetailsErrors: { [key: number]: { [key: string]: string } } = {};
    timesheet.train_details.forEach((detail, index) => {
      const detailErrors: { [key: string]: string } = {};
      if (!detail.train_no || detail.train_no.trim() === "") {
        detailErrors.train_no = "Train number is required";
      }
      if (!detail.departure_location || detail.departure_location.trim() === "") {
        detailErrors.departure_location = "Departure location is required";
      }
      if (!detail.departure_time || detail.departure_time.trim() === "") {
        detailErrors.departure_time = "Departure time is required";
      }
      if (!detail.arrival_location || detail.arrival_location.trim() === "") {
        detailErrors.arrival_location = "Arrival location is required";
      }
      if (!detail.arrival_time || detail.arrival_time.trim() === "") {
        detailErrors.arrival_time = "Arrival time is required";
      }
      if (!detail.notice_of_completion || detail.notice_of_completion.trim() === "") {
        detailErrors.notice_of_completion = "Notice of completion is required";
      }
      if (!detail.remarks || detail.remarks.trim() === "") {
        detailErrors.remarks = "Remarks is required";
      }
      if (Object.keys(detailErrors).length > 0) {
        trainDetailsErrors[index] = detailErrors;
      }
    });
    if (Object.keys(trainDetailsErrors).length > 0) {
      errors.train_details = trainDetailsErrors as any;
    }
  }

  // Validate work_performances - all fields are required for each entry
  if (timesheet.work_performances && timesheet.work_performances.length > 0) {
    const workPerformanceErrors: { [key: number]: { [key: string]: string } } = {};
    timesheet.work_performances.forEach((wp, index) => {
      const wpErrors: { [key: string]: string } = {};
      if (!wp.from || wp.from.trim() === "") {
        wpErrors.from = "From date/time is required";
      }
      if (!wp.to || wp.to.trim() === "") {
        wpErrors.to = "To date/time is required";
      }
      if (!wp.work_performance || wp.work_performance.trim() === "") {
        wpErrors.work_performance = "Work performance is required";
      }
      if (Object.keys(wpErrors).length > 0) {
        workPerformanceErrors[index] = wpErrors;
      }
    });
    if (Object.keys(workPerformanceErrors).length > 0) {
      errors.work_performances = workPerformanceErrors as any;
    }
  }

  // Validate changes - all fields are required for each entry
  if (timesheet.changes && timesheet.changes.length > 0) {
    const changesErrors: { [key: number]: { [key: string]: string } } = {};
    timesheet.changes.forEach((change, index) => {
      const changeErrors: { [key: string]: string } = {};
      if (!change.from || change.from.trim() === "") {
        changeErrors.from = "From date/time is required";
      }
      if (!change.to || change.to.trim() === "") {
        changeErrors.to = "To date/time is required";
      }
      if (!change.changes || change.changes.trim() === "") {
        changeErrors.changes = "Changes description is required";
      }
      if (!change.changer || change.changer.trim() === "") {
        changeErrors.changer = "Changer is required";
      }
      if (Object.keys(changeErrors).length > 0) {
        changesErrors[index] = changeErrors;
      }
    });
    if (Object.keys(changesErrors).length > 0) {
      errors.changes = changesErrors as any;
    }
  }

  return errors;
};

export const validateAllTimesheets = (shift: Shift) => {
  const errors: { [key: string]: { [key: string]: string } } = {};

  if (!shift.timesheets) return errors;

  Object.entries(shift.timesheets).forEach(([employeeId, timesheet]) => {
    // Only validate if timesheet is enabled
    if (timesheet.isEnabled) {
      const timesheetErrors = validateTimeSheet(timesheet);
      if (Object.keys(timesheetErrors).length > 0) {
        errors[employeeId] = timesheetErrors;
      }
    }
  });

  return errors;
};
