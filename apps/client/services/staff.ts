import { STATUS } from "@/types/shared/global";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";

class StaffService {
  async getAllStaff(
    page: number,
    limit: number,
    company_id: number,
    status: STATUS = "ACTIVE",
    search?: string
  ) {
    const searchParams = buildSearchParams({
      page,
      limit,
      company_id,
      status,
      search,
    });

    return await http.get(`/staff?${searchParams.toString()}`);
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
