import { ApiPaginatedResponseWithMeta } from "./pagination";
import { BaseEntityRequired } from "./shared/global";

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

export interface LocomotiveDetail extends BaseEntityRequired {
  name: string;
  model_type: string;
  engine: string;
  year: number;
  image: string | null;
  company_id: number;
  status: string;
}

export interface ReasonDetail extends BaseEntityRequired {
  reason: string;
  status: string;
}

export interface LocomotiveActions extends BaseEntityRequired {
  locomotive_id: number;
  status: string;
  action_name: string;
  cycle_indicator_days: number;
  yellow_threshold_days: number;
  red_threshold_days: number;
  current_state: string;
  reason_id: number;
  locomotive: LocomotiveDetail;
  reason: ReasonDetail;
  completions: any[];
}

export interface FetchLocomotiveResponse extends ApiPaginatedResponseWithMeta<LocomotiveActions> {}

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
