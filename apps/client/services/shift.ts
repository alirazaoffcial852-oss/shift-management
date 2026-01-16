import { STATUS } from "@/types/shift";
import http from "@workspace/ui/lib/http";
import { format, addDays } from "date-fns";

class ShiftService {
  async createShift(data: FormData) {
    return await http.post("/shifts", data);
  }

  async createOfferShift(data: FormData) {
    return await http.post("/shifts/add-offer-shift", data);
  }

  async updateShifts(data: FormData) {
    return await http.put("/shifts", data);
  }

  async updateOfferShift(data: FormData) {
    return await http.put("/shifts/update-offer-shift", data);
  }

  async fixedShifts(data: FormData) {
    return await http.patch("/shifts/update-status-planned-to-fix", data);
  }
  async plannedShifts(data: FormData) {
    return await http.patch("/shifts/update-status-to-planned", data);
  }
  async assignShifts(data: FormData) {
    return await http.patch("/shifts/assign-shift-to-employee", data);
  }

  async deleteShift(data: FormData) {
    return await http.post(`/shifts/bulk-delete`, data);
  }

  async getShiftById(id: number) {
    return await http.get(`/shifts/${id}`);
  }

  async getAllShifts(
    from: string,
    to: string,
    employee_ids: number[] | null,
    statuses?: STATUS[] | "ALL" | null,
    company_id: number | null = null,
    additionalParams: any = {}
  ) {
    const params = new URLSearchParams();

    if (from) {
      params.append("from", format(new Date(from), "yyyy-MM-dd"));
    }

    if (to) {
      params.append("to", format(new Date(to), "yyyy-MM-dd"));
    }

    if (employee_ids && employee_ids.length > 0) {
      employee_ids.forEach((id) => {
        params.append("employee_id", id.toString());
      });
    }

    if (
      statuses &&
      statuses !== "ALL" &&
      Array.isArray(statuses) &&
      statuses.length > 0
    ) {
      statuses.forEach((status) => {
        params.append("status", status);
      });
    }

    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        if (value !== null && value !== "" && value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach((item) => {
              if (item !== null && item !== undefined && item !== "") {
                params.append(key, item.toString());
              }
            });
          } else if (key !== "status" && key !== "employee_id") {
            params.append(key, value.toString());
          }
        }
      });
    }
    if (company_id) {
      params.append("company_id", company_id.toString());
    }

    return await http.get(`/shifts?${params.toString()}`);
  }

  async getWeeklyShifts(
    startDate: string,
    endDate: string,
    company_id: number,
    role_id: number[] = [],
    has_locomotive: boolean = true
  ) {
    const params = new URLSearchParams();

    if (startDate) params.append("from", startDate);
    if (endDate) params.append("to", endDate);
    if (company_id) params.append("company_id", company_id.toString());

    // Format role_id as an array string: role_id=[1,2]
    if (role_id.length > 0) {
      params.append("role_id", JSON.stringify(role_id));
    } else {
      params.append("role_id", JSON.stringify([]));
    }

    if (has_locomotive)
      params.append("has_locomotive", has_locomotive.toString());

    return await http.get(`/shifts/get-weekly-shifts?${params.toString()}`);
  }

  async assignLocomotiveToShift(formData: FormData) {
    try {
      const response = await http.patch(
        "shifts/assign-shift-to-locomotive",
        formData
      );
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ShiftService();
