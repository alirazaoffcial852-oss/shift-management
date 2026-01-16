import { STATUS } from "@/types/shared/global";
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
    let params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("company_id", company_id.toString());
    params.set("status", status);
    if (project_id) {
      params.set("project_id", project_id.toString());
    }
    if (search) {
      params.set("search", search);
    }
    return await http.get(`/bv-projects?${params.toString()}`);
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
