import http from "@workspace/ui/lib/http";

class LocomotiveService {
  async getAllRoute(companyId: string) {
    return await http.get(`/locomotives/routes/${companyId}`);
  }

  async AddRoute(data: FormData) {
    return await http.post("/locomotives/routes", data);
  }

  async getAllLocomotives(page: number, limit: number, companyId: number, status: string = "ACTIVE") {
    return await http.get(`/locomotives?page=${page}&limit=${limit}&company_id=${companyId}&status=${status}`);
  }

  async addLocomotive(data: FormData) {
    return await http.post("/locomotives", data);
  }

  async updateLocomotive(id: number, data: FormData) {
    return await http.put(`/locomotives/${id}`, data);
  }

  async archiveLocomotive(id: number) {
    return await http.del(`/locomotives/${id}`);
  }

  async activateLocomotive(id: number) {
    const data = {
      status: "ACTIVE",
    };
    return await http.patch(`/locomotives/${id}/status`, data);
  }

  async getLocomotiveById(id: number) {
    return await http.get(`/locomotives/${id}`);
  }
}

export default new LocomotiveService();
