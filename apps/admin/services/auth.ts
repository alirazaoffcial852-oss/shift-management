import http from "@workspace/ui/lib/http";

class AuthService {
  async verifyToken(token: string) {
    return http.get(`/auth/verify-token?token=${token}`);
  }
}

export default new AuthService();
