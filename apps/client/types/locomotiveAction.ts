import { FORMMODE } from "./shared/global";

export interface Action {
  locomotive_id?: number;
  actionName: string;
  cycleIndicator: number;
  whenStateIsYellow: number;
  whenStateIsRed: number;
  reason_id: number;
  completion_date?: string;
}

export interface ActionFormErrors {
  locomotive_id: number;
  actionName?: string;
  cycleIndicator?: string;
  whenStateIsYellow?: string;
  whenStateIsRed?: string;
  selectReason?: string;
  reason_id: number;
}

export interface ActionFormProps {
  id?: number;
  onclose?: () => void;
  isDialog?: boolean;
  onSubmit?: (data: Action[]) => Promise<void>;
  actionId?: number;
  type?: "add" | "edit";
}

export interface Locomotive {
  id: number;
  name: string;
  model_type: string;
  engine: string;
  year: number;
  image: string | null;
  company_id: number;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Reason {
  id: number;
  reason: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LocomotiveActions {
  id: number;
  locomotive_id: number;
  status: string;
  action_name: string;
  cycle_indicator_days: number;
  yellow_threshold_days: number;
  red_threshold_days: number;
  current_state: string;
  created_at: string;
  updated_at: string;
  reason_id: number;
  locomotive: Locomotive;
  reason: Reason;
  completions: any[];
}

export interface Pagination {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface FetchLocomotiveResponse {
  status: string;
  message: string;
  data: {
    data: LocomotiveActions[];
    pagination: Pagination;
  };
}

export interface LocomotiveActionRequest {
  actions: {
    locomotive_id?: number;
    action_name: string;
    cycle_indicator_days: number;
    yellow_threshold_days: number;
    red_threshold_days: number;
    reason_id: number;
  }[];
}

export interface OverviewOfLocomotive {
  id: number;
  locomotiveId: number;
  key: string;
  value: string;
}
