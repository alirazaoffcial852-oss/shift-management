import { buildQueryString } from "@/utils/common/url";
import http from "@workspace/ui/lib/http";
import { TrackCostResponse } from "@/types/trackCost";

class TrackCostService {
  async getTrackCostShifts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<TrackCostResponse> {
    const queryString = buildQueryString({
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      status: params?.status,
    });

    return await http.get(`shifts/toll-cost-shifts${queryString}`);
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
