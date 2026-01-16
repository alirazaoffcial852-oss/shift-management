import {
  CreateProjectUsnProductPayload,
  ProjectUsnProductListResponse,
  ProjectUsnProductResponse,
} from "@/types/project-usn-product";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class ProjectUsnProductService {
  private baseUrl = "/product-usn";

  async createProjectUsnProduct(data: CreateProjectUsnProductPayload) {
    return (await JsonHttp.post(
      this.baseUrl,
      data
    )) as ProjectUsnProductResponse;
  }

  async getProjectUsnProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }) {
    return (await JsonHttp.get(
      this.baseUrl,
      params
    )) as ProjectUsnProductListResponse;
  }

  async getProjectUsnProductById(id: string) {
    return (await JsonHttp.get(
      `${this.baseUrl}/${id}`
    )) as ProjectUsnProductResponse;
  }

  async updateProjectUsnProduct(
    id: string,
    data: CreateProjectUsnProductPayload
  ) {
    return (await JsonHttp.put(
      `${this.baseUrl}/${id}`,
      data
    )) as ProjectUsnProductResponse;
  }

  async deleteProjectUsnProduct(id: string) {
    return (await JsonHttp.del(`${this.baseUrl}/${id}`)) as { message: string };
  }

  async updateStatus(id: string, status: string) {
    return (await JsonHttp.put(`${this.baseUrl}/${id}/status`, {
      status,
    })) as ProjectUsnProductResponse;
  }
}

export default new ProjectUsnProductService();
