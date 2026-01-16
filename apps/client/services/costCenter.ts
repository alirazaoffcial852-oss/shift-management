import http from "@workspace/ui/lib/http";

class costCenterService {
  async getAllCostCenter(
    page: number,
    limit: number,
    company_id: number,
    searchTerm?: string
  ) {
    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("company_id", company_id.toString());
    if (searchTerm) {
      searchParams.append("search", searchTerm);
    }

    return await http.get(`/cost-centers?${searchParams.toString()}`);
  }
  async getCostCenterById(id: number) {
    return await http.get(`/cost-centers/${id}`);
  }

  async createCostCenter(data: FormData) {
    return await http.post("/cost-centers", data);
  }

  async updateCostCenter(id: number, data: FormData) {
    return await http.put(`/cost-centers/${id}`, data);
  }
  async deleteCostCenter(id: number) {
    return await http.del(`/cost-centers/${id}`);
  }
}

export default new costCenterService();
