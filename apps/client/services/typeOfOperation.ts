import http from "@workspace/ui/lib/http";

class TypeOfOperationService {
  async getAllTypeOfOperation(
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

    return await http.get(`/type-of-operations?${searchParams.toString()}`);
  }

  async getTypeOfOperationById(id: number) {
    return await http.get(`/type-of-operations/${id}`);
  }

  async createTypeOfOperation(data: FormData) {
    return await http.post("/type-of-operations", data);
  }

  async updateTypeOfOperation(id: number, data: FormData) {
    return await http.put(`/type-of-operations/${id}`, data);
  }
  async deleteTypeOfOperation(id: number) {
    return await http.del(`/type-of-operations/${id}`);
  }
}

export default new TypeOfOperationService();
