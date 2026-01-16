import JsonHttp from "@workspace/ui/lib/JsonHttp";
import {
  QualityManagementShift,
  UsnShift,
  ClientRole,
  QualityManagementFilters,
} from "@/types/qualityManagement";

class QualityManagementService {
  /**
   * Get client roles for filter dropdowns
   * GET /clients/roles?clientId={clientId}
   */
  async getClientRoles(clientId: number) {
    try {
      const response = await JsonHttp.get(
        `/clients/roles?clientId=${clientId}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching client roles:", error);
      throw error;
    }
  }

  /**
   * Get approved shifts for quality management
   * GET /shifts/quality-management/approved?employee_id={employeeId}
   */
  async getApprovedShifts(filters?: QualityManagementFilters) {
    try {
      const params = new URLSearchParams();

      if (filters?.employee_id) {
        params.append("employee_id", filters.employee_id.toString());
      }
      if (filters?.customer_id) {
        params.append("customer_id", filters.customer_id.toString());
      }
      if (filters?.from_date) {
        params.append("from", filters.from_date);
      }
      if (filters?.to_date) {
        params.append("to", filters.to_date);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }

      // Ensure we always request approved shifts
      params.append("status", "APPROVED");

      const queryString = params.toString();
      const url = `/shifts/quality-management/approved${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await JsonHttp.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching approved shifts:", error);
      throw error;
    }
  }

  /**
   * Get approved USN shifts for quality management
   * GET /usn-shifts/quality-management/approved
   */
  async getApprovedUsnShifts(filters?: QualityManagementFilters) {
    try {
      const params = new URLSearchParams();

      if (filters?.employee_id) {
        params.append("employee_id", filters.employee_id.toString());
      }
      if (filters?.customer_id) {
        params.append("customer_id", filters.customer_id.toString());
      }
      if (filters?.from_date) {
        params.append("date_from", filters.from_date);
      }
      if (filters?.to_date) {
        params.append("date_to", filters.to_date);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
      }
      if (filters?.limit) {
        params.append("limit", filters.limit.toString());
      }

      // Ensure we always request approved shifts
      params.append("status", "APPROVED");

      const queryString = params.toString();
      const url = `/usn-shifts/quality-management/approved${
        queryString ? `?${queryString}` : ""
      }`;

      const response = await JsonHttp.get(url);
      return response;
    } catch (error) {
      console.error("Error fetching approved USN shifts:", error);
      throw error;
    }
  }

  /**
   * Get combined overview data (both regular shifts and USN shifts)
   */
  async getQualityOverview(filters?: QualityManagementFilters) {
    try {
      const [shiftsResponse, usnShiftsResponse] = await Promise.all([
        this.getApprovedShifts(filters),
        this.getApprovedUsnShifts(filters),
      ]);

      return {
        shifts: shiftsResponse?.data || [],
        usnShifts: usnShiftsResponse?.data || [],
      };
    } catch (error) {
      console.error("Error fetching quality overview:", error);
      throw error;
    }
  }
}

export default new QualityManagementService();
