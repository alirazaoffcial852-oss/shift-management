export interface HistoryOfMaintenanceItem {
  id: number;
  actionName: string;
  documents: string[];
  notes: string;
  completionDate: string;
}

export interface HistoryOfMaintenancePagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface HistoryOfMaintenanceData {
  data: HistoryOfMaintenanceItem[];
  pagination: HistoryOfMaintenancePagination;
}

export interface FetchHistoryOfMaintenanceResponse {
  status: string;
  message: string;
  data: HistoryOfMaintenanceData;
}
