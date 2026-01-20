import { buildSearchParams } from "@/utils/common/url";
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
    const searchParams = buildSearchParams({
      page,
      limit,
      clientId: client_id,
      company_id,
      act_as,
      search: searchTerm,
    });

    return await http.get(`/clients/roles?${searchParams.toString()}`);
  }
}
export default new RoleService();
