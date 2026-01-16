import http from "@workspace/ui/lib/http";

class PermissionService {
  async getAllPermissions() {
    return await http.get(`/roles-permissions/permissions`);
  }
}

export default new PermissionService();
