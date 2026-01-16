import { STATUS } from "@/types/shared/global";
import http from "@workspace/ui/lib/http";

class EmployeeService {
  async getAllEmployees(
    page: number,
    limit: number,
    company_id: number,
    status: STATUS = "ACTIVE",
    role_id?: string,
    searchTerm?: string
  ) {
    let url = `/employees?page=${page}&limit=${limit}&company_id=${company_id}&status=${status}`;
    if (role_id) {
      url += `&role_id=${role_id}`;
    }
    if (searchTerm) {
      url += `&search=${searchTerm}`;
    }
    return await http.get(url);
  }

  async getEmployeeById(id: number) {
    return await http.get(`/employees/${id}`);
  }

  async AddEmployee(data: FormData) {
    return await http.post("/employees", data);
  }

  async updateEmployee(id: number, data: FormData) {
    return await http.put(`/employees/${id}`, data);
  }

  async deleteEmployee(id: string) {
    return await http.del(`/employees/${id}`);
  }
  async archivedEmployee(id: string) {
    return await http.put(`/employees/${id}/archive`, {});
  }
  async activeEmployee(id: string) {
    return await http.put(`/employees/${id}/activate`, {});
  }
}

export default new EmployeeService();
