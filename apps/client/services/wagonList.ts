import { WagonFormData } from "@/types/wagon";
import JsonHttp from "@workspace/ui/lib/JsonHttp";

class WagonListService {
  async createWagonList(data: WagonFormData, shiftId: number) {
    const formData = new FormData();
    formData.append("trainPreparation", JSON.stringify(data.trainPreparation));
    formData.append(
      "technicalPreparations",
      JSON.stringify(data.technicalPreparations)
    );
    formData.append("brakePreparation", JSON.stringify(data.brakePreparation));
    formData.append("wagonNumbers", JSON.stringify(data.wagonNumbers));
    if (data.documents && data.documents.length > 0) {
      data.documents.forEach((file: File) => {
        formData.append("documents", file);
      });
    }
    return await JsonHttp.post(`/wagon-list/${shiftId}`, formData);
  }

  async getByShiftTrainId(shiftTrainId: number) {
    return await JsonHttp.get(`/wagon-list/${shiftTrainId}`);
  }

  async updateWagonListById(
    wagonListId: number,
    data: WagonFormData,
    deleteDocumentIds: number[] = []
  ) {
    const formData = new FormData();
    formData.append("trainPreparation", JSON.stringify(data.trainPreparation));
    formData.append(
      "technicalPreparations",
      JSON.stringify(data.technicalPreparations)
    );
    formData.append("brakePreparation", JSON.stringify(data.brakePreparation));
    formData.append("wagonNumbers", JSON.stringify(data.wagonNumbers));

    if (deleteDocumentIds.length > 0) {
      formData.append("deleteDocumentIds", JSON.stringify(deleteDocumentIds));
    }

    // Only append NEW documents (File objects), not existing document paths (strings)
    if (data.documents && data.documents.length > 0) {
      const newFiles = data.documents.filter((file: any) => file instanceof File);
      if (newFiles.length > 0) {
        newFiles.forEach((file: File) => {
          formData.append("documents", file);
        });
      }
    }

    return await JsonHttp.patch(`/wagon-list/${wagonListId}`, formData);
  }

  async getAllWagonLists(
    page: number = 1,
    limit: number = 10,
    search: string = "",
    filters?: {
      timeFilter?: string;
      startDate?: string;
      endDate?: string;
    }
  ) {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());

    if (search) {
      params.set("search", search);
    }

    if (filters) {
      if (filters.timeFilter) params.set("timeFilter", filters.timeFilter);
      if (filters.startDate) params.set("startDate", filters.startDate);
      if (filters.endDate) params.set("endDate", filters.endDate);
    }

    return await JsonHttp.get(`/wagon-list?${params.toString()}`);
  }
}

export default new WagonListService();
