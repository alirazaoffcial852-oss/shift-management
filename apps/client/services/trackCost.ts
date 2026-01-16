import http from "@workspace/ui/lib/http";
import { TrackCostResponse } from "@/types/trackCost";

class TrackCostService {
  async getTrackCostShifts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<TrackCostResponse> {
    const searchParams = new URLSearchParams();

    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.search) searchParams.append("search", params.search);
    if (params?.status) searchParams.append("status", params.status);

    const queryString = searchParams.toString();
    const url = `shifts/toll-cost-shifts${queryString ? `?${queryString}` : ""}`;

    return await http.get(url);
  }

  async getTrackCostById(trackCostId: string) {
    return await http.get(`/shift-toll-cost/${trackCostId}`);
  }

  async getTrackCostByShiftId(shiftId: string) {
    return await http.get(`/shift-toll-cost/${shiftId}`);
  }

  async createTrackCost(data: FormData) {
    return await http.post("/shift-toll-cost", data);
  }

  async updateTrackCostStatus(id: string, status: string) {
    return await http.put(`shifts/toll-cost-shifts/${id}/status`, { status });
  }

  async updateTrackCost(trackCostId: string, data: FormData) {
    return await http.put(`/shift-toll-cost/${trackCostId}`, data);
  }
}

export default new TrackCostService();
