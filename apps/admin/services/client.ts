import http from "@workspace/ui/lib/http";

class ClientService {
  async getAllClients(page: number, limit: number) {
    return await http.get(`/clients?page=${page}&limit=${limit}`);
  }

  async getClientById(id: number) {
    return await http.get(`/clients/${id}`);
  }

  async createClient(data: FormData) {
    return await http.post("/clients", data);
  }

  async updateClient(id: number, data: FormData) {
    return await http.patch(`/clients/${id}`, data);
  }

  async deleteClient(id: string) {
    return await http.del(`/clients/${id}`);
  }
  async blockClient(id: string) {
    return await http.patch(`/clients/${id}/block`, {});
  }
  async unBlockClient(id: string) {
    return await http.patch(`/clients/${id}/unblock`, {});
  }
  async suspendClient(id: string) {
    return await http.patch(`/clients/${id}/suspend`, {});
  }
}

export default new ClientService();
