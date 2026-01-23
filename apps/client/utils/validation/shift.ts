import { IniateShift, Shift } from "@/types/shift";

export const validateShiftForm = (
  iniateShift: IniateShift[],
  shifts: Shift | Shift[],
  currentStep: number,
  isEdit: boolean = false
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  const offer = Array.isArray(shifts)
    ? shifts[0]?.status === "OFFER"
    : shifts?.status === "OFFER";
  const shiftsToValidate = isEdit ? (shifts as Shift[]) : [shifts as Shift];

  if (currentStep === 0 && !isEdit) {
    iniateShift.forEach((shift, index) => {
      if (!shift.start_date) {
        errors[`shifts[${index}].start_date`] = "Start date is required";
      }
      if (!shift.end_date) {
        errors[`shifts[${index}].end_date`] = "End date is required";
      }
      if (!shift.start_time) {
        errors[`shifts[${index}].start_time`] = "Start time is required";
      }
      if (!shift.end_time) {
        errors[`shifts[${index}].end_time`] = "End time is required";
      }
      if (shift.roundsCount <= 0) {
        errors[`shifts[${index}].roundsCount`] =
          "roundsCount should be greater than 0";
      }

      if (
        shift.start_date &&
        shift.end_date &&
        shift.start_time &&
        shift.end_time
      ) {
        const startDateTime = new Date(
          `${shift.start_date}T${shift.start_time}`
        );
        const endDateTime = new Date(`${shift.end_date}T${shift.end_time}`);

        // if (startDateTime >= endDateTime) {
        //   errors[`shifts[${index}].end_time`] =
        //     "End date/time must be after start date/time";
        // }
      }
    });
  }

  shiftsToValidate.forEach((shift, shiftIndex) => {
    const prefix = isEdit ? `shift[${shiftIndex}].` : "";

    if (currentStep === 1) {
      // if (!shift.customer_id) {
      //   errors[`${prefix}customer_id`] = "Customer is required";
      // }
      // if (!shift.bv_project_id && !offer) {
      //   errors[`${prefix}bv_project_id`] = "Bv Project is required";
      // }
      // if (!shift.project_id && !offer) {
      //   errors[`${prefix}project_id`] = "Project is required";
      // }
      // if (!shift.product_id && !offer) {
      //   errors[`${prefix}product_id`] = "Product is required";
      // }

      if (!shift.location && !offer) {
        errors[`${prefix}location`] = "Location is required";
      }
      // if (!shift.shiftDetail.type_of_operation_id && !offer) {
      //   errors[`${prefix}type_of_operation`] = "Type of Operation is required";
      // }
      // if (shift.shiftDetail.has_locomotive && !shift.locomotive_id && !offer) {
      //   errors[`${prefix}locomotive_id`] = "locomotive is required";
      // }

      if (shift.shiftRole && shift.shiftRole.length > 0) {
        const activeRoles = shift.shiftRole.filter(
          (role) => role.isDisabled !== true
        );
        // if (activeRoles.length === 0) {
        //   errors[`${prefix}shiftRole`] = "At least one role must be active";
        // }

        shift.shiftRole.forEach((role, roleIndex) => {
          // if (!role.employee_id && role.isDisabled !== true && isEdit) {
          //   errors[`${prefix}shiftRole[${role?.role_id}].employee_id`] =
          //     "Employee is required";
          // }
          if (!role.role_id && role.isDisabled !== true && isEdit) {
            errors[`${prefix}shiftRole[${role?.role_id}].role_id`] =
              "Role is required";
          }
          if (!role.proximity && role.isDisabled !== true && isEdit) {
            errors[`${prefix}shiftRole[${role?.role_id}].proximity`] =
              "Proximity is required";
          }
          if (!role.break_duration && role.isDisabled !== true && isEdit) {
            errors[`${prefix}shiftRole[${role?.role_id}].break_duration`] =
              "Break duration is required";
          }
        });
      }
    }

    if (currentStep === 3) {
      if (shift.shiftDetail.has_contact_person) {
        if (!shift.shiftDetail.contact_person_name) {
          errors[`${prefix}contact_person_name`] =
            "contact person name is required";
        }

        if (!shift.shiftDetail.contact_person_phone) {
          errors[`${prefix}contact_person_phone`] =
            "Contact person phone is required";
        }
      }
      if (!shift.customer_id && !offer) {
        errors[`${prefix}customer_id`] = "customer  is required";
      }
      if (!shift.phone_no && !offer) {
        errors[`${prefix}phone_no`] = "Phone number is required";
      }
      if (
        !shift.dispatcher_id &&
        !offer &&
        !shift.shiftDetail.has_contact_person
      ) {
        errors[`${prefix}dispatcher_id`] = "Dispatcher is required";
      }

      if (shift.shiftTrain && shift.shiftTrain.length > 0) {
        shift.shiftTrain.forEach((train, trainIndex) => {
          // if (!train.train_no && train.isEnabled !== false) {
          //   errors[`${prefix}shiftTrain[${trainIndex}].arrival_location`] =
          //     "Arrival location is required";
          // }
          // if (!train.train_no && train.isEnabled !== false) {
          //   errors[`${prefix}shiftTrain[${trainIndex}].train_no`] =
          //     "Train number is required";
          // }
          // if (!train.departure_location && train.isEnabled !== false) {
          //   errors[`${prefix}shiftTrain[${trainIndex}].departure_location`] =
          //     "Departure location is required";
          // }
          // if (!train.arrival_location && train.isEnabled !== false) {
          //   errors[`${prefix}shiftTrain[${trainIndex}].arrival_location`] =
          //     "Arrival location is required";
          // }
        });
      }
    }
  });

  return errors;
};
