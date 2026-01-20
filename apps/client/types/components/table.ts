import { STATUS, EXTENDED_STATUS } from "../shared/global";

export interface BaseTableActionCallbacks {
  onDelete?: (id: number) => void;
  onStatusUpdate?: (id: number, status: STATUS | EXTENDED_STATUS | string) => void;
}

export interface CustomerActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface ProjectActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface ProductActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface BvProjectActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface LocomotiveActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface EmployeeActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface StaffActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface LocationActionCallbacks {
  onDelete: (id: number) => void;
}

export interface TypeOfOperationActionCallbacks {
  onDelete: (id: number) => void;
}

export interface CostCenterActionCallbacks {
  onDelete: (id: number) => void;
}

export interface HolidayActionCallbacks {
  onDelete: (id: number) => void;
}

export interface SamplingActionCallbacks {
  onDelete: (id: number) => void;
  onExamine?: (id: number) => void;
}

export interface OrderActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface ProjectUsnProductActionCallbacks {
  onDelete: (id: number) => void;
  onStatusUpdate: (id: number, status: STATUS) => void;
}

export interface TableColumn<T = any> {
  header: string;
  accessor: string;
  render?: (value: any, row?: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
}

export interface TableAction<T = any> {
  label: string;
  element: (item: T, callbacks?: any) => React.ReactNode;
}

export interface UseTableReturn<T> {
  data: T[];
  isLoading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  setPage: (page: number) => void;
  refetch: () => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}
