import { STATUS } from "@/types/shared/global";
import http from "@workspace/ui/lib/http";

class StaffService {
  async getAllStaff(
    page: number,
    limit: number,
    company_id: number,
    status: STATUS = "ACTIVE"
  ) {
    return await http.get(
      `/staff?page=${page}&limit=${limit}&company_id=${company_id}&status=${status}`
    );
  }

  async getStaffById(id: number) {
    return await http.get(`/staff/${id}`);
  }

  async Addstaff(data: FormData) {
    return await http.post("/staff", data);
  }

  async updatestaff(id: number, data: FormData) {
    return await http.put(`/staff/${id}`, data);
  }

  async deleteStaff(id: string) {
    return await http.del(`/staff/${id}`);
  }

  async archivedStaff(id: string) {
    return await http.put(`/staff/${id}/archive`, {});
  }

  async activateStaff(id: string) {
    return await http.put(`/staff/${id}/activate`, {});
  }
}

export default new StaffService();
