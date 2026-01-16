import { STATUS } from "@/types/shared/global";
import http from "@workspace/ui/lib/http";

class CustomerService {
  async getAllCustomers(
    page: number,
    limit: number,
    company_id: number,
    status: STATUS = "ACTIVE",
    search?: string
  ) {
    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("company_id", company_id.toString());
    searchParams.append("status", status);

    if (search) {
      searchParams.append("search", search);
    }

    return await http.get(`/customers?${searchParams.toString()}`);
  }

  async getCustomerById(id: number) {
    return await http.get(`/customers/${id}`);
  }

  async createCustomer(data: FormData) {
    return await http.post("/customers", data);
  }

  async updateCustomer(id: number, data: FormData) {
    return await http.put(`/customers/${id}`, data);
  }

  async deleteCustomer(id: string) {
    return await http.del(`/customers/${id}`);
  }
  async archivedCustomer(id: string, data: FormData) {
    return await http.patch(`/customers/${id}/change-status`, data);
  }
  async activateCustomer(id: string, data: FormData) {
    return await http.patch(`/customers/${id}/change-status`, data);
  }
}

export default new CustomerService();
