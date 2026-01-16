import { GetAllReasonsParams } from "@/types/reason";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class ReasonService {
  async getAllReasons(params: GetAllReasonsParams = {}) {
    const { page = 1, limit = 10, search, status, startDate, endDate } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (status) {
      queryParams.append("status", status);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    return await JsonHttp.get(`/reason?${queryParams.toString()}`);
  }

  async getReasonById(id: number) {
    return await JsonHttp.get(`/reason/${id}`);
  }

  async createReasons(data: {
    reasons: { reason: string; status?: string }[];
  }) {
    return await JsonHttp.post("/reason", data);
  }

  async updateReason(
    id: number,
    data: { reasons: { reason: string; status?: string }[] }
  ) {
    return await JsonHttp.put(`/reason/${id}`, data);
  }

  async deleteReason(id: string) {
    return await JsonHttp.del(`/reason/${id}`);
  }
}

export default new ReasonService();
