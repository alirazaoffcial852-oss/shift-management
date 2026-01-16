import { Action, LocomotiveActionRequest } from "@/types/locomotiveAction";
import { GetAllReasonsParams } from "@/types/reason";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class LocomotiveActionService {
  async getAllLocomotiveActions(params: GetAllReasonsParams = {}) {
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

    return await JsonHttp.get(`/locomotive-action?${queryParams.toString()}`);
  }

  async getLocomotiveActionId(id: number) {
    return await JsonHttp.get(`/locomotive-action/get-by-id/${id}`);
  }

  async createLocomotiveAction(actions: Action[]) {
    const requestData: LocomotiveActionRequest = {
      actions: actions.map((action) => ({
        locomotive_id: action.locomotive_id,
        action_name: action.actionName,
        cycle_indicator_days: action.cycleIndicator,
        yellow_threshold_days: action.whenStateIsYellow,
        red_threshold_days: action.whenStateIsRed,
        reason_id: action.reason_id,
      })),
    };

    return await JsonHttp.post("/locomotive-action", requestData);
  }

  async updateLocomotiveAction(id: number, action: Action) {
    const requestData = {
      locomotive_id: action.locomotive_id,
      action_name: action.actionName,
      cycle_indicator_days: action.cycleIndicator,
      yellow_threshold_days: action.whenStateIsYellow,
      red_threshold_days: action.whenStateIsRed,
      reason_id: action.reason_id,
      completion_date: action.completion_date,
    };

    return await JsonHttp.put(`/locomotive-action/${id}`, requestData);
  }

  async deleteLocomotiveAction(id: number) {
    return await JsonHttp.del(`/locomotive-action/${id}`);
  }

  async uploadDocuments(
    locomotive_action_id: number,
    note: string,
    images: File[]
  ) {
    const formData = new FormData();
    formData.append("note", note);

    images.forEach((image) => {
      formData.append("images", image);
    });

    return await JsonHttp.post(
      `/locomotive-action/upload-document/${locomotive_action_id}`,
      formData
    );
  }

  async completeLocomotiveAction(id: number) {
    return await JsonHttp.get(`/locomotive-action/completion/${id}`);
  }

  async getActionsAgainstLocomotive(id: number) {
    return await JsonHttp.get(`/locomotive-action/get-actions/${id}`);
  }

  async updateDocuments(
    id: number,
    note: string,
    files: File[],
    removedDocs: number[]
  ) {
    const formData = new FormData();
    formData.append("note", note);

    files.forEach((file, index) => {
      formData.append(`newFiles`, file);
    });

    formData.append("removedDocs", JSON.stringify(removedDocs));

    return await JsonHttp.patch(
      `/locomotive-action/update-documents/${id}`,
      formData
    );
  }
}

export default new LocomotiveActionService();
