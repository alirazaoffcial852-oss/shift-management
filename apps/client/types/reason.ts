import { ApiPaginatedResponse, PaginationParams } from "./pagination";
import { BaseEntity, FormProps, DialogProps } from "./shared/global";

export interface Reason extends BaseEntity {
  reason: string;
}

export interface ReasonFormErrors {
  reason?: string;
}

export interface ReasonFormProps extends FormProps {
  refetch: () => void;
}

export interface FetchReasonResponse extends ApiPaginatedResponse<Reason> {}

export interface ReasonDialogProps extends DialogProps {
  refetch: () => void;
}

export interface ReasonTableActionsProps {
  row: Reason;
  onDelete?: (row: Reason) => void;
  handleOpenAddDialog?: (config: { type: "add" | "edit"; id?: string }) => void;
  handleOpenViewDetailsDialog?: (config: {
    type: "add" | "edit";
    id?: string;
  }) => void;
}

export interface GetAllReasonsParams extends PaginationParams {}
