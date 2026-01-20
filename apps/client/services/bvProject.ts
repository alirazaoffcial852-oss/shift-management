import { STATUS } from "@/types/shared/global";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";

class BvProjectService {
  async getAllBvProjects(
    page: number,
    limit: number,
    company_id: number,
    status: STATUS = "ACTIVE",
    project_id?: number | null,
    search?: string
  ) {
    const searchParams = buildSearchParams({
      page,
      limit,
      company_id,
      status,
      project_id,
      search,
    });

    return await http.get(`/bv-projects?${searchParams.toString()}`);
  }

  async getBvProjectById(id: number) {
    return await http.get(`/bv-projects/${id}`);
  }

  async createBvProject(data: FormData) {
    return await http.post("/bv-projects", data);
  }

  async updateBvProject(id: number, data: FormData) {
    return await http.put(`/bv-projects/${id}`, data);
  }

  async deleteBvProject(id: string) {
    return await http.del(`/bv-projects/${id}`);
  }
  async archivedBvProject(id: string, data: FormData) {
    return await http.patch(`/bv-projects/${id}/status`, data);
  }

  async activateBvProject(id: string, data: FormData) {
    return await http.patch(`/bv-projects/${id}/status`, data);
  }
}

export default new BvProjectService();
