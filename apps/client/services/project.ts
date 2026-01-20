import { STATUS } from "@/types/shared/global";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";

class ProjectService {
  async getAllProjects(
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

    return await http.get(`/projects?${searchParams.toString()}`);
  }

  async getProjectById(id: number) {
    return await http.get(`/projects/${id}`);
  }

  async createProject(data: FormData) {
    return await http.post("/projects", data);
  }

  async updateProject(id: number, data: FormData) {
    return await http.put(`/projects/${id}`, data);
  }

  async deleteProject(id: string) {
    return await http.del(`/projects/${id}`);
  }
  async archivedProject(id: string, data: FormData) {
    return await http.patch(`/projects/${id}/status`, data);
  }
  async activateProject(id: string, data: FormData) {
    return await http.patch(`/projects/${id}/status`, data);
  }
}

export default new ProjectService();
