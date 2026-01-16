import http from "@workspace/ui/lib/http";

class SamplingExamineService {
  async createSamplingExamine(data: FormData) {
    return await http.post(`/sample-examines`, data);
  }
  async getSamplingExamineById(id: number) {
    return await http.get(`/sample-examines/${id}`);
  }
  async updateSamplingExamine(id: number, data: FormData) {
    return await http.put(`/sample-examines/${id}`, data);
  }

  async deleteSamplingExamine(id: string) {
    return await http.del(`/sample-examines/${id}`);
  }
}

export default new SamplingExamineService();
