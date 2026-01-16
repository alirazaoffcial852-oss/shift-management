import { FORMMODE } from "./shared/global";

export interface Reason {
  id?: number;
  reason: string;
}

export interface ReasonFormErrors {
  reason?: string;
}

export interface ReasonFormProps {
  useComponentAs: FORMMODE;
  id?: number;
  onClose?: () => void;
  isDialog?: boolean;
  onSubmit?: (success: boolean) => void;
  refetch: () => void;
}

export interface FetchReasonResponse {
  data: {
    data: Reason[];
    pagination: {
      total: number;
      totalPages: number;
    };
  };
}

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: "add" | "edit";
  id?: string;
  refetch: () => void;
}

export interface TableActionsProps {
  row: any;
  onDelete?: (row: any) => void;
  handleOpenAddDialog?: (config: { type: "add" | "edit"; id?: string }) => void;
  handleOpenViewDetailsDialog?: (config: {
    type: "add" | "edit";
    id?: string;
  }) => void;
}

export interface GetAllReasonsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
}
