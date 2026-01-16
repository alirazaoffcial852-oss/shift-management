import { GetAllTopicsParams, CreateTopicRequest } from "@/types/topic";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class TopicService {
  async getAllTopics(params: GetAllTopicsParams = {}) {
    const { page = 1, limit = 10, search, status, startDate, endDate } = params;

    const queryParams = new URLSearchParams();
    queryParams.append("page", page.toString());
    queryParams.append("limit", limit.toString());

    if (search && search.trim()) {
      queryParams.append("search", search.trim());
    }

    if (status) {
      queryParams.append("status", status);
    }

    if (startDate) {
      queryParams.append("startDate", startDate);
    }

    if (endDate) {
      queryParams.append("endDate", endDate);
    }

    return await JsonHttp.get(
      `/quality-management-topics?${queryParams.toString()}`
    );
  }

  async getTopicById(id: number) {
    return await JsonHttp.get(`/quality-management-topics/${id}`);
  }

  async createTopics(data: CreateTopicRequest) {
    return await JsonHttp.post("/quality-management-topics", data);
  }

  async updateTopicById(
    id: number,
    data: {
      topic: string;
      category: "CUSTOMER" | "EMPLOYEE" | "COMPANY";
      status?: string;
    }
  ) {
    return await JsonHttp.put(`/quality-management-topics/${id}`, data);
  }

  async updateTopic(
    id: number,
    data: {
      topics: { topicName: string; category?: string; status?: string }[];
    }
  ) {
    return await JsonHttp.put(`/api/topic/${id}`, data);
  }

  async deleteTopic(id: string) {
    return await JsonHttp.del(`/quality-management-topics/${id}`);
  }
}

export default new TopicService();
