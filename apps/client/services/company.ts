import http from "@workspace/ui/lib/http";

class CompanyService {
  async getAllCompanies() {
    return await http.get(`/companies`);
  }

  async deleteRoles(id: number) {
    return await http.del(`/companies/roles/${id}`);
  }
  async AddRoles(data: FormData) {
    return await http.post("/companies/roles", data);
  }
  async updateRoles(id: number, data: FormData) {
    return await http.put(`/companies/roles/${id}`, data);
  }
  async AddCompany(data: FormData) {
    return await http.post("/companies", data);
  }
  async UpdateCompany(id: number, data: FormData) {
    return await http.patch(`/companies/${id}`, data);
  }
  async DeleteCompany(id: number) {
    return await http.del(`/companies/${id}`);
  }
}

export default new CompanyService();
