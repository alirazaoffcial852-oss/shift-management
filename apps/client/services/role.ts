import http from "@workspace/ui/lib/http";

class RoleService {
  async getAllRoles(
    client_id: number,
    page: number,
    limit: number,
    company_id: number,
    act_as?: string,
    searchTerm?: string
  ) {
    const searchParams = new URLSearchParams();
    searchParams.append("page", page.toString());
    searchParams.append("limit", limit.toString());
    searchParams.append("clientId", client_id.toString());
    searchParams.append("company_id", company_id.toString());
    if (act_as) {
      searchParams.append("act_as", act_as);
    }
    if (searchTerm) {
      searchParams.append("search", searchTerm);
    }

    return await http.get(`/clients/roles?${searchParams.toString()}`);
  }
}
export default new RoleService();
