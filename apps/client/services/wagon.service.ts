import http from "@workspace/ui/lib/http";
import {
  WagonFormData,
  WagonBrakeManualDetails,
  WagonBrakeAutoDetails,
  WagonDamageInformations,
  WagonRents,
} from "@/types/wagonTypes";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class WagonService {
  async getAllWagons(
    page: number = 1,
    limit: number = 20,
    searchTerm?: string,
    filters?: {
      status?: string;
      wagon_type?: string;
      rail?: string;
      location?: string | string[];
      date?: string;
      nextStatus?: string;
      loadedLocation?: string;
    }
  ) {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    }

    if (filters) {
      if (filters.status) {
        params.set("status", filters.status);
      }
      if (filters.date) {
        params.set("date", filters.date);
      }
      if (filters.wagon_type) {
        params.set("wagon_type", filters.wagon_type);
      }
      if (filters.rail) {
        params.set("rail", filters.rail);
      }
      if (filters.location) {
        if (Array.isArray(filters.location)) {
          filters.location.forEach((loc) => {
            if (loc) params.append("location_id", loc);
          });
        } else if (filters.location) {
          params.append("location_id", filters.location);
        }
      }

      if (filters.nextStatus) {
        params.set("next_status", filters.nextStatus);
      }
      if (filters.loadedLocation) {
        params.set("loaded_location", filters.loadedLocation);
      }
    }

    return await http.get(`/wagons?${params.toString()}`);
  }

  async getWagonById(id: number) {
    return await http.get(`/wagons/${id}`);
  }

  private formatDate(dateString: string): string {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0] || "";
  }

  private formatNestedObject(obj: any): any {
    const formatted = { ...obj };

    if (formatted.from) {
      formatted.from = this.formatDate(formatted.from);
    }
    if (formatted.to) {
      formatted.to = this.formatDate(formatted.to);
    }
    if (formatted.date_when_available_again) {
      formatted.date_when_available_again = this.formatDate(
        formatted.date_when_available_again
      );
    }

    if (formatted.amount) {
      formatted.amount = Number(formatted.amount);
    }

    return formatted;
  }

  private customJSONStringify(obj: any): string {
    let jsonString = JSON.stringify(obj);

    jsonString = jsonString.replace(/"(\d{4}-\d{2}-\d{2})"/g, "$1");

    return jsonString;
  }

  async createWagon(
    data: WagonFormData,
    brakeManualDetails?: WagonBrakeManualDetails,
    brakeAutoDetails?: WagonBrakeAutoDetails,
    damageInformations?: WagonDamageInformations,
    wagonRents?: WagonRents
  ) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "location_id") {
        if (value !== null && value !== undefined) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            formData.append(key, String(numValue));
          }
        }
        return;
      }

      if (value !== null && value !== undefined && value !== "") {
        if (key === "last_revision_date" || key === "next_revision_date") {
          formData.append(key, this.formatDate(String(value)));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (brakeManualDetails) {
      formData.append(
        "wagon_brake_manual_details",
        JSON.stringify(brakeManualDetails)
      );
    }

    if (brakeAutoDetails) {
      formData.append(
        "wagon_brake_auto_details",
        JSON.stringify(brakeAutoDetails)
      );
    }

    if (damageInformations) {
      const formattedDamageInfo = this.formatNestedObject(damageInformations);
      formData.append(
        "wagons_damage_informations",
        this.customJSONStringify(formattedDamageInfo)
      );
    }

    if (wagonRents) {
      const formattedWagonRents = this.formatNestedObject(wagonRents);
      formData.append(
        "wagon_rents",
        this.customJSONStringify(formattedWagonRents)
      );
    }

    return await http.post("/wagons", formData);
  }

  async updateWagon(
    id: number,
    data: WagonFormData,
    brakeManualDetails?: WagonBrakeManualDetails,
    brakeAutoDetails?: WagonBrakeAutoDetails,
    damageInformations?: WagonDamageInformations,
    wagonRents?: WagonRents
  ) {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (key === "location_id") {
        if (value !== null && value !== undefined) {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            formData.append(key, String(numValue));
          }
        }
        return;
      }

      if (value !== null && value !== undefined && value !== "") {
        if (key === "last_revision_date" || key === "next_revision_date") {
          formData.append(key, this.formatDate(String(value)));
        } else {
          formData.append(key, String(value));
        }
      }
    });

    if (brakeManualDetails) {
      formData.append(
        "wagon_brake_manual_details",
        JSON.stringify(brakeManualDetails)
      );
    }

    if (brakeAutoDetails) {
      formData.append(
        "wagon_brake_auto_details",
        JSON.stringify(brakeAutoDetails)
      );
    }

    if (damageInformations) {
      const formattedDamageInfo = this.formatNestedObject(damageInformations);
      formData.append(
        "wagons_damage_informations",
        this.customJSONStringify(formattedDamageInfo)
      );
    }

    if (wagonRents) {
      const formattedWagonRents = this.formatNestedObject(wagonRents);
      formData.append(
        "wagon_rents",
        this.customJSONStringify(formattedWagonRents)
      );
    }

    return await http.put(`/wagons/${id}`, formData);
  }

  async deleteWagon(id: number) {
    return await http.del(`/wagons/${id}`);
  }

  async updateWagonPosition(wagonId: number, rail: string, position: string) {
    return await JsonHttp.patch(`/wagons/${wagonId}/wagon-position`, {
      rail,
      position: String(position),
    });
  }

  async updateWagonStatus(wagonId: number, status: string) {
    return await http.patch(`/wagons/${wagonId}/update-status`, { status });
  }

  async updateFirstWagonActionOrder(
    firstWagonActionId: number,
    usnShiftRoutePlanningId: number,
    wagonOrder: number
  ) {
    return await JsonHttp.patch(
      `/usn-shifts/first-wagon-action/update-order`,
      {
        first_wagon_action_id: firstWagonActionId,
        usn_shift_route_planning_id: usnShiftRoutePlanningId,
        wagon_order: wagonOrder,
      }
    );
  }

  async updateSecondWagonActionOrder(
    secondWagonActionId: number,
    usnShiftRoutePlanningId: number,
    wagonOrder: number
  ) {
    return await JsonHttp.patch(
      `/usn-shifts/second-wagon-action/update-order`,
      {
        second_wagon_action_id: secondWagonActionId,
        usn_shift_route_planning_id: usnShiftRoutePlanningId,
        wagon_order: wagonOrder,
      }
    );
  }

  async getWagonHistory(params?: {
    page?: number;
    limit?: number;
    wagon_id?: number;
    status?: string;
    date_from?: string;
    date_to?: string;
    search?: string;
  }) {
    const queryParams = new URLSearchParams();

    if (params?.page) {
      queryParams.set("page", params.page.toString());
    }
    if (params?.limit) {
      queryParams.set("limit", params.limit.toString());
    }
    if (params?.wagon_id) {
      queryParams.set("wagon_id", params.wagon_id.toString());
    }
    if (params?.status) {
      queryParams.set("status", params.status);
    }
    if (params?.date_from) {
      queryParams.set("date_from", params.date_from);
    }
    if (params?.date_to) {
      queryParams.set("date_to", params.date_to);
    }
    if (params?.search) {
      queryParams.set("search", params.search);
    }

    return await http.get(`/wagons/history?${queryParams.toString()}`);
  }

  async getWagonFilters(
    page: number = 1,
    limit: number = 20,
    filters?: {
      status?: string;
      wagon_type?: string;
      rail?: string;
      location_id?: string | string[];
      date?: string;
      next_status?: string;
      loaded_location?: string;
    }
  ) {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (filters) {
      if (filters.status) {
        params.set("status", filters.status);
      }
      if (filters.date) {
        params.set("date", filters.date);
      }
      if (filters.wagon_type) {
        params.set("wagon_type", filters.wagon_type);
      }
      if (filters.rail) {
        params.set("rail", filters.rail);
      }
      if (filters.location_id) {
        if (Array.isArray(filters.location_id)) {
          filters.location_id.forEach((loc) => {
            if (loc) params.append("location_id", loc);
          });
        } else if (filters.location_id) {
          params.append("location_id", filters.location_id);
        }
      }
      if (filters.next_status) {
        params.set("next_status", filters.next_status);
      }
      if (filters.loaded_location) {
        params.set("loaded_location", filters.loaded_location);
      }
    }

    return await http.get(`/wagons/wagon-filters?${params.toString()}`);
  }
}

export default new WagonService();
