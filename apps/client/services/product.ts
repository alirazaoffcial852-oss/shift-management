import { STATUS } from "@/types/shared/global";
import { buildSearchParams } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";

class ProductService {
  async getAllProduct(
    page: number,
    limit: number,
    company_id: number,
    status?: string,
    search?: string
  ) {
    const searchParams = buildSearchParams({
      page,
      limit,
      company_id,
      status,
      search,
    });

    return await http.get(`/products?${searchParams.toString()}`);
  }

  async getProductById(id: number) {
    return await http.get(`/products/${id}`);
  }

  async createProduct(data: FormData) {
    return await http.post("/products", data);
  }

  async updateProduct(id: number, data: FormData) {
    return await http.put(`/products/${id}`, data);
  }
  async duplicateProduct(id: number) {
    return await http.post(`/products/${id}/duplicate`, {});
  }
  async deleteProduct(id: string) {
    return await http.del(`/products/${id}`);
  }
  async archivedProduct(id: string) {
    return await http.put(`/products/${id}/archive`, {});
  }
  async activateProduct(id: string) {
    return await http.put(`/products/${id}/activate`, {});
  }
}

export default new ProductService();
