import http from "@workspace/ui/lib/http";

class userService {
  async updateProfile(data: FormData) {
    return await http.patch(`/settings/profile`, data);
  }
  async getUserProfile() {
    return await http.get(`/auth/user`);
  }
  async deleteProfileImage() {
    try {
      const response = await http.del("/settings/profile/image");
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default new userService();
