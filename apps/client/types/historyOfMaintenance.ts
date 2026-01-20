import { PaginationMeta, PaginatedResponseWithMeta } from "./pagination";

export interface HistoryOfMaintenanceItem {
  id: number;
  actionName: string;
  documents: string[];
  notes: string;
  completionDate: string;
}

export interface HistoryOfMaintenanceData extends PaginatedResponseWithMeta<HistoryOfMaintenanceItem> {}

export interface FetchHistoryOfMaintenanceResponse {
  status: string;
  message: string;
  data: HistoryOfMaintenanceData;
}
