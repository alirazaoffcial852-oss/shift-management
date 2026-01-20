import { TIMESHEET_STATUS } from "@/types/timeSheet";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";

class TimeSheetService {
  async createTimeSheet(data: FormData) {
    return await http.post("/timesheets", data);
  }

  async getTimeSheet(page: number, limit: number, status?: TIMESHEET_STATUS, company?: string, employeeId?: string, search?: string) {
    const searchParams = buildSearchParams({
      page,
      limit,
      status,
      company_id: company,
      employee_id: employeeId,
      search,
    });

    return await http.get(`/timesheets?${searchParams.toString()}`);
  }
  async getTimeSheetById(id: string) {
    return await http.get(`/timesheets/${id}`);
  }
  async submitTimeSheet(data: FormData) {
    return await http.post(`/timesheets/submit`, data);
  }

  async approvedTimeSheet(data: FormData) {
    return await http.post(`/timesheets/approve`, data);
  }

  async rejectTimeSheet(data: FormData) {
    return await http.post(`/timesheets/reject`, data);
  }

  async updateTimeSheet(data: FormData, id: string) {
    return await http.put(`/timesheets/${id}`, data);
  }

  async getUSTimeSheet(page: number, limit: number, status?: TIMESHEET_STATUS, company?: string, employeeId?: string, fromDate?: string, toDate?: string) {
    const searchParams = buildSearchParams({
      page,
      limit,
      status,
      company_id: company,
      employee_id: employeeId,
      from_date: fromDate,
      to_date: toDate,
    });

    return await http.get(`/timesheets/usn?${searchParams.toString()}`);
  }

  async getUSTimeSheetById(id: string) {
    return await http.get(`/timesheets/usn/${id}`);
  }

  async submitUSTimeSheet(data: FormData) {
    return await http.post(`/timesheets/usn/submit`, data);
  }

  async approvedUSTimeSheet(data: FormData) {
    return await http.post(`/timesheets/usn/approve`, data);
  }

  async rejectUSTimeSheet(data: FormData) {
    return await http.post(`/timesheets/usn/reject`, data);
  }

  async updateUSTimeSheet(data: FormData, id: string) {
    return await http.put(`/timesheets/usn/${id}`, data);
  }
}

export default new TimeSheetService();
