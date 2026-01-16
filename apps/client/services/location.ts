import http from "@workspace/ui/lib/http";

class LocationService {
  async getAllLocations(
    page: number,
    limit: number,
    company_id: number,
    searchTerm?: string,
    type?: string
  ) {
    let url = `/locations?page=${page}&limit=${limit}&company_id=${company_id}`;

    if (searchTerm) {
      url += `&search=${encodeURIComponent(searchTerm)}`;
    }

    if (type) {
      url += `&type=${encodeURIComponent(type)}`;
    }

    return await http.get(url);
  }

  async getLocationById(id: number) {
    return await http.get(`/locations/${id}`);
  }

  async createLocation(data: FormData) {
    return await http.post("/locations", data);
  }

  async updateLocation(id: number, data: FormData) {
    return await http.put(`/locations/${id}`, data);
  }

  async deleteLocation(id: number) {
    return await http.del(`/locations/${id}`);
  }
}

export default new LocationService();
