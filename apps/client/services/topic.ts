import { GetAllTopicsParams, CreateTopicRequest } from "@/types/topic";
import { buildSearchParams } from "@/utils/common/url";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class TopicService {
  async getAllTopics(params: GetAllTopicsParams = {}) {
    const { page = 1, limit = 10, search, status, startDate, endDate } = params;

    const queryParams = buildSearchParams({
      page,
      limit,
      search: search?.trim(),
      status,
      startDate,
      endDate,
    });

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
