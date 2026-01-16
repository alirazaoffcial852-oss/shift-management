import http from "@workspace/ui/lib/http";

class SamplingService {
  async getAllSampling(page: number, limit: number, company_id: number) {
    let params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    params.set("company_id", company_id.toString());

    return await http.get(`/samples?${params.toString()}`);
  }

  async getSamplingById(id: number) {
    return await http.get(`/samples/${id}`);
  }

  async createSampling(data: FormData) {
    return await http.post("/samples", data);
  }

  async updateSampling(id: number, data: FormData) {
    return await http.put(`/samples/${id}`, data);
  }

  async deleteSampling(id: string) {
    return await http.del(`/samples/${id}`);
  }
}

export default new SamplingService();
