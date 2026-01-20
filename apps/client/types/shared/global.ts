export type STATUS = "ACTIVE" | "ARCHIVED";

export type EXTENDED_STATUS = "ACTIVE" | "INACTIVE" | "ARCHIVED";

export type FORMMODE = "ADD" | "EDIT";

export type COSTING_TERMS =
  | "COUNT_HOLIDAY_SURCHARGES_COST_ONLY"
  | "COUNT_HIGHEST_SURCHARGES_COST_ONLY"
  | "COUNT_ALL_SURCHARGES_COST";

export interface BaseEntity {
  id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BaseEntityRequired {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface NamedEntity extends BaseEntity {
  name: string;
  status?: STATUS;
}

export interface FormErrors {
  [key: string]: string;
}

export interface DialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onClose: () => void;
  type: FORMMODE | "add" | "edit";
  id?: string | number;
  refetch?: () => void;
}

export interface FormProps<T = FORMMODE> {
  useComponentAs: T;
  id?: number;
  onClose?: () => void;
  isDialog?: boolean;
  onSubmit?: (success: boolean) => void;
  refetch?: () => void;
}

export interface SelectOption<T = string | number> {
  value: T;
  label: string;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message: string;
  success?: boolean;
  status?: string;
}

export interface TableActionsProps<T = any> {
  row: T;
  onDelete?: (row: T) => void;
  onEdit?: (row: T) => void;
  onView?: (row: T) => void;
}
