import http from "@workspace/ui/lib/http";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class ProjectUSNShiftsService {
  async getAllProjectUSNShifts(
    page: number = 1,
    limit: number = 100,
    company_id?: number,
    searchTerm?: string
  ) {
    try {
      const params = new URLSearchParams();
      params.set("page", page.toString());
      params.set("limit", limit.toString());

      if (searchTerm) {
        params.set("search", searchTerm);
      }

      const response = await http.get(`/usn-shifts?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getAllProjectUSNShiftsByDate(
    from: string,
    to: string,
    company_id?: number,
    limit?: number
  ) {
    try {
      const params = new URLSearchParams();
      params.set("date_from", from);
      params.set("date_to", to);
      if (limit !== undefined) {
        params.set("limit", limit.toString());
      }
      if (company_id) params.set("company_id", company_id.toString());
      const response = await http.get(`/usn-shifts?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createProjectUSNShift(data: FormData) {
    try {
      const response = await http.post("/usn-shifts", data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProjectUSNShift(id: number, data: FormData) {
    try {
      const response = await http.put(`/usn-shifts/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProjectUSNShiftDate(id: number, date: string) {
    try {
      const response = await JsonHttp.patch(`/usn-shifts/${id}/update-data`, {
        date: date,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectUSNShift(id: number) {
    try {
      const response = await http.get(`/usn-shifts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProjectUSNShift(id: number) {
    try {
      const response = await http.del(`/usn-shifts/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getWagonsByPurpose(purpose: string, wagonIds: number[]) {
    try {
      const response = await JsonHttp.patch(`/usn-shifts/${purpose}`, {
        wagon_id: wagonIds,
        purpose: purpose,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async assignLocomotiveToUSNShift(data: FormData) {
    try {
      const response = await http.patch(
        "/usn-shifts/assign-usn-shift-to-locomotive",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async assignEmployeeToUSNShift(data: FormData) {
    try {
      const response = await http.patch(
        "/usn-shifts/assign-usn-shift-to-employee",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async approveRoutePlanning(id: number) {
    try {
      const response = await http.patch(
        `/usn-shifts/${id}/route-planning-approve`
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async fixedUSNShifts(data: FormData) {
    try {
      const response = await http.patch(
        "/usn-shifts/update-status-planned-to-fix",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async plannedUSNShifts(data: FormData) {
    try {
      const response = await http.patch(
        "/usn-shifts/update-status-to-planned",
        data
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new ProjectUSNShiftsService();
