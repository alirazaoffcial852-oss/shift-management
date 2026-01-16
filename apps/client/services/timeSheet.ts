import { TIMESHEET_STATUS } from "@/types/timeSheet";
import http from "@workspace/ui/lib/http";

class TimeSheetService {
  async createTimeSheet(data: FormData) {
    return await http.post("/timesheets", data);
  }

  async getTimeSheet(page: number, limit: number, status?: TIMESHEET_STATUS, company?: string, employeeId?: string) {
    let url = `/timesheets?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (company) {
      url += `&company_id=${company}`;
    }
    if (employeeId) {
      url += `&employee_id=${employeeId}`;
    }

    return await http.get(url);
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

  // USN Timesheet methods
  async getUSTimeSheet(page: number, limit: number, status?: TIMESHEET_STATUS, company?: string, employeeId?: string, fromDate?: string, toDate?: string) {
    let url = `/timesheets/usn?page=${page}&limit=${limit}`;

    if (status) {
      url += `&status=${status}`;
    }

    if (company) {
      url += `&company_id=${company}`;
    }
    if (employeeId) {
      url += `&employee_id=${employeeId}`;
    }
    if (fromDate) {
      url += `&from_date=${fromDate}`;
    }
    if (toDate) {
      url += `&to_date=${toDate}`;
    }

    return await http.get(url);
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
