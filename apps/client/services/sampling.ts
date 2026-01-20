import JsonHttp from "@workspace/ui/lib/JsonHttp";

class SamplingService {
  async getAllSampling(
    page: number,
    limit: number,
    company_id: number,
    search?: string
  ) {
    let params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("company_id", company_id.toString());
    
    if (search) {
      params.set("search", search);
    }

    return await JsonHttp.get(`/samples?${params.toString()}`);
  }

  async getSamplingById(id: number) {
    return await JsonHttp.get(`/samples/${id}`);
  }

  async createSampling(data: FormData) {
    return await JsonHttp.post("/samples", data);
  }

  async updateSampling(id: number, data: FormData) {
    return await JsonHttp.put(`/samples/${id}`, data);
  }

  async deleteSampling(id: string) {
    return await JsonHttp.del(`/samples/${id}`);
  }
}

export default new SamplingService();
