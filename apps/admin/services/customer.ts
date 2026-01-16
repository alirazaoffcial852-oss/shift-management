import http from "@workspace/ui/lib/http";

class CustomerService {
  async getAllCustomers(page: number, limit: number) {
    return await http.get(`/customers?page=${page}&limit=${limit}`);
  }

  async getCustomerById(id: number) {
    return await http.get(`/customers/${id}`);
  }

  async createCustomer(data: FormData) {
    return await http.post("/customers/add", data);
  }

  async updateCustomer(id: number, data: FormData) {
    return await http.post(`/customers/update/${id}`, data);
  }

  async deleteCustomer(id: string) {
    return await http.del(`/customers/${id}`);
  }
}

export default new CustomerService();
