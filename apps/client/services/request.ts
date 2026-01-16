import { SendRequestData, UpdateRequestData } from "@/types/request";
import http from "@workspace/ui/lib/http";
import JsonHttp from "@workspace/ui/lib/JsonHttp";
import { toast } from "sonner";

class RequestService {
  async sendRequest(data: SendRequestData) {
    const resp = await http.post("/company-request-employees", data);
    return resp;
  }

  async getReceivedRequests(
    companyId: number,
    page: number = 1,
    limit: number = 20,
    status?: string
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    const resp = await http.get(
      `/company-request-employees/send-requests/${companyId}?${params}`
    );
    return resp;
  }

  async getSendRequests(
    companyId: number,
    page: number = 1,
    limit: number = 20,
    status?: string
  ) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
    });

    const resp = await http.get(
      `/company-request-employees/received-requests/${companyId}?${params}`
    );
    return resp;
  }

  async deleteRequest(requestId: number) {
    const resp = await http.del(`/company-request-employees/${requestId}`);
    toast.success(resp.message);
    return resp;
  }

  async updateRequest(data: UpdateRequestData) {
    const { id, ...updateData } = data;
    const resp = await http.put(`/company-request-employees/${id}`, updateData);
    toast.success(resp.message || "Request updated successfully");
    return resp;
  }

  async rejectRequest(requestId: number) {
    try {
      const resp = await http.patch(
        `/company-request-employees/${requestId}/reject`
      );
      toast.success(resp.message);
      return resp;
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to reject request");
      throw error;
    }
  }

  async approveRequest(requestId: number, data: any) {
    try {
      const resp = await JsonHttp.post(
        `/company-request-employees/${requestId}/approve`,
        data
      );
      toast.success("Request approved successfully");
      return resp;
    } catch (error: any) {
      console.log(error, "error");
      toast.error(error.data.message);
      throw error;
    }
  }
}

export default new RequestService();
