import { CreateOrderData } from "@/types/order";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class OrderService {
  async getAllOrders(page: number, limit: number, searchTerm?: string) {
    const searchParams = buildSearchParams({
      page,
      limit,
      search: searchTerm,
    });

    return await JsonHttp.get(`/orders?${searchParams.toString()}`);
  }

  async getOrderById(id: number) {
    return await JsonHttp.get(`/orders/${id}`);
  }

  async createOrder(data: CreateOrderData[]) {
    return await JsonHttp.post("/orders", { orders: data });
  }

  async updateOrder(id: number, data: FormData) {
    const response = await http.put(`/orders/${id}`, data);
    return response;
  }

  async deleteOrder(id: number) {
    return await JsonHttp.del(`/orders/${id}`);
  }

  async archiveOrder(id: number) {
    return await JsonHttp.put(`/orders/${id}/archive`, {});
  }

  async activateOrder(id: number) {
    return await JsonHttp.put(`/orders/${id}/activate`, {});
  }

  async getSupplierLocations() {
    return await JsonHttp.get("/orders/supplier");
  }

  async getTariffLocations() {
    return await JsonHttp.get("/orders/tariff");
  }
}

export default new OrderService();
