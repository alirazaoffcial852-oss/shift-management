import { GetAllReasonsParams } from "@/types/reason";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class historyOfMaintenance {
  async getHistoryOfMaintenanceData(
    params: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ) {
    const { page = 1, limit = 10, search, status, startDate, endDate } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (status) {
      queryParams.append("status", status);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    return await JsonHttp.get(
      `/locomotive-action/simplified?${queryParams.toString()}`
    );
  }
}

export default new historyOfMaintenance();
