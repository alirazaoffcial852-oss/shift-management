import http from "@workspace/ui/lib/http";

class AuthService {
  async forgotPassword(data: FormData) {
    const resp = await http.post("/auth/forgot-password", data);
    return resp;
  }
  async verifyToken(token: string) {
    return http.get(`/auth/verify-token?token=${token}`);
  }
  async changePassword(formData: FormData) {
    return http.post(`/auth/update-password`, formData);
  }
}

export default new AuthService();
