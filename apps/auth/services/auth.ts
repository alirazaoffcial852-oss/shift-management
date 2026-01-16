import http from "@workspace/ui/lib/http";

class AuthService {
  async forgotPassword(data: FormData) {
    const resp = await http.post("/auth/forgot-password", data);
    return resp;
  }
  async resetPassword(data: FormData, token: string) {
    const resp = await http.post(`/auth/reset-password/${token}`, data);
    return resp;
  }
  async changePassword(data: FormData) {
    const resp = await http.post("/auth/change-password", data);
    return resp;
  }
}

export default new AuthService();
