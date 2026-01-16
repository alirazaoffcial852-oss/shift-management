import { format } from "date-fns";
import { Shift, shiftRole, ShiftTrain } from "@/types/shift";

const normalizeNullableId = (value: string | number | null | undefined) => {
  if (value === undefined || value === null) {
    return null;
  }
  const num = Number(value);
  return Number.isNaN(num) || num === 0 ? null : num;
};

export class ShiftTransformer {
  static transformForEdit(shifts: any[]): Shift[] {
    return shifts.map((shift) => ({
      id: shift.id,

      shiftDetail: {
        contact_person_name: shift.shiftDetail?.contact_person_name || "",
        contact_person_phone: shift.shiftDetail?.contact_person_phone || "",
        has_contact_person: shift.shiftDetail?.has_contact_person || false,
        has_document: shift.shiftDetail?.has_document || false,
        has_locomotive: shift.shiftDetail?.has_locomotive || false,
        has_note: shift.shiftDetail?.has_note || false,
        location: shift.shiftDetail?.location || "",
        note: shift.shiftDetail?.note || "",
        cost_center: shift.shiftDetail?.cost_center || "",
        type_of_operation: shift.shiftDetail?.type_of_operation || "",
        type_of_operation_id: shift.shiftDetail?.type_of_operation_id || null,
        cost_center_id: shift.shiftDetail?.cost_center_id || null,
      },
      shiftRole: this.transformShiftRoles(shift.shiftRole),
      shiftTrain: this.transformShiftTrains(shift.shiftTrain),
      documents: shift.shiftDocument,
      customer_id: shift.customer_id?.toString(),
      project_id: shift.project_id?.toString(),
      bv_project_id: shift.bv_project_id?.toString(),
      product_id: shift.product_id?.toString(),
      dispatcher_id: shift.dispatcher_id?.toString(),
      company_id: shift.company_id?.toString(),
      location: shift.shiftDetail?.location || "",
      status: shift.status,
      phone_no: shift?.customer?.phone || "",
      date: shift.date,
      start_time: shift.start_time
        ? format(new Date(shift.start_time.replace("Z", "")), "HH:mm")
        : "",
      end_time: shift.end_time
        ? format(new Date(shift.end_time.replace("Z", "")), "HH:mm")
        : "",

      locomotive_id: shift.locomotive_id?.toString(),
      product: shift.product,
      customer: shift.customer,
      project: shift.project,
      bv_project: shift.bv_project,
    }));
  }

  static transformForUpdate(shifts: Shift[]) {
    return shifts.map((shift) => {
      const shiftData: any = {
        id: shift.id,
        date: shift.date ? format(new Date(shift.date), "yyyy-MM-dd") : "",
        start_time: shift.start_time
          ? shift.start_time.match(/^\d{2}:\d{2}$/)
            ? shift.start_time
            : format(new Date(shift.start_time.replace("Z", "")), "HH:mm")
          : "",
        end_time: shift.end_time
          ? shift.end_time.match(/^\d{2}:\d{2}$/)
            ? shift.end_time
            : format(new Date(shift.end_time.replace("Z", "")), "HH:mm")
          : "",
        customer_id: Number(shift.customer_id),
        project_id: normalizeNullableId(shift.project_id),
        bv_project_id: normalizeNullableId(shift.bv_project_id),
        product_id: Number(shift.product_id),
        company_id: Number(shift.company_id),
        location: shift.shiftDetail.location,
        type_of_operation_id: shift.shiftDetail.type_of_operation_id
          ? Number(shift.shiftDetail.type_of_operation_id)
          : null,

        has_locomotive: shift.shiftDetail.has_locomotive,
        has_contact_person: shift.shiftDetail.has_contact_person,
        has_document: shift.shiftDetail.has_document,
        has_note: shift.shiftDetail.has_note,
        shiftRole: this.transformRolesForUpdate(shift.shiftRole || []),
        shiftTrain: this.transformTrainsForUpdate(shift.shiftTrain || []),
      };
      if (shift.shiftDetail.has_note) {
        shiftData.note = shift.shiftDetail.note;
      }
      if (shift.locomotive_id) {
        shiftData.locomotive_id = shift.locomotive_id
          ? Number(shift.locomotive_id)
          : null;
      }

      if (shift.shiftDetail.has_contact_person) {
        shiftData.contact_person_name = shift.shiftDetail.contact_person_name;
        shiftData.contact_person_phone = shift.shiftDetail.contact_person_phone;
      }
      if (shift.dispatcher_id) {
        shiftData.dispatcher_id = shift.dispatcher_id
          ? Number(shift.dispatcher_id)
          : null;
      }
      if (shift.shiftDetail.cost_center_id) {
        shiftData.cost_center_id = Number(shift.shiftDetail.cost_center_id);
      }

      return shiftData;
    });
  }

  public static transformShiftRoles(roles: any[] = []): shiftRole[] {
    return roles
      .filter((role) => !role.isDisabled)
      .map((role) => ({
        role_id: role.role_id.toString(),
        employee_id: role.employee_id ? role.employee_id.toString() : null,
        proximity: role.proximity || "NEARBY",
        break_duration: role.break_duration?.toString() || "0",
        start_day: role.start_day || "YES",
      }));
  }

  public static transformShiftTrains(trains: any[] = []): ShiftTrain[] {
    if (!trains || trains.length === 0) {
      return [
        {
          train_no: "",
          departure_location: "",
          arrival_location: "",
          isEnabled: true,
        },
      ];
    }

    return trains.map((train) => ({
      train_no: train.train_no,
      departure_location: train.departure_location,
      arrival_location: train.arrival_location,
      isEnabled: true,
      freight_transport: train.freight_transport,
    }));
  }

  public static transformRolesForUpdate(roles: shiftRole[]) {
    return roles
      .filter((role) => !role.isDisabled)
      .map((role) => {
        const roleData: any = {
          role_id: Number(role.role_id),
          proximity: role.proximity || "NEARBY",
          break_duration: role.break_duration?.toString() || "0",
          start_day: role.start_day || "YES",
        };

        if (role.employee_id) {
          roleData.employee_id = Number(role.employee_id);
        }

        return roleData;
      });
  }

  public static transformTrainsForUpdate(trains: ShiftTrain[]) {
    return trains.map((train) => ({
      train_no: train.train_no,
      departure_location: train.departure_location,
      arrival_location: train.arrival_location,
      freight_transport: train.freight_transport === true,
    }));
  }
}
