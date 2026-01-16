import http from "@workspace/ui/lib/http";

class HolidayService {
  async getHoliday(
    page: number,
    limit: number,
    company_id: number,
    month?: number,
    year?: number
  ) {
    return await http.get(
      `/settings/holidays/?page=${page}&limit=${limit}&month=${month}&year=${year}&company_id=${company_id}`
    );
  }
  async getHolidayById(id: number) {
    return await http.get(`/settings/holidays/${id}`);
  }
  async addHoliday(data: FormData) {
    return await http.post("/settings/holidays", data);
  }
  async updateHoliday(id: number, data: FormData) {
    return await http.put(`/settings/holidays/${id}`, data);
  }
  async deleteHoliday(id: number) {
    return await http.del(`/settings/holidays/${id}`);
  }
}

export default new HolidayService();
