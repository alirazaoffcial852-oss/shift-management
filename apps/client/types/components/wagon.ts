import { BaseEntityRequired } from "../shared/global";

export interface WagonData extends BaseEntityRequired {
  wagon_number: string;
  type: string;
  location_id?: number;
  location?: {
    id: number;
    name: string;
  };
  status?: string;
  last_inspection?: string;
  next_inspection?: string;
  notes?: string;
}

export interface WagonOption {
  value: string | number;
  label: string;
}

export interface GroupedWagonHistory {
  wagonNumber: string;
  lastUpdated: string;
  records: any[];
}

export interface WagonTableProps {
  wagons: WagonData[];
  isLoading?: boolean;
  onEdit?: (wagon: WagonData) => void;
  onDelete?: (id: number) => void;
  onView?: (wagon: WagonData) => void;
}

export interface WagonModalProps {
  isOpen: boolean;
  onClose: () => void;
  wagon?: WagonData | null;
  mode: "add" | "edit" | "view";
  onSubmit?: (data: WagonData) => void;
}

export interface WagonBrakeManualDetails {
  brake_type?: string;
  brake_weight?: number;
  brake_percentage?: number;
}

export interface WagonBrakeAutoDetails {
  auto_brake_type?: string;
  auto_brake_status?: string;
}

export interface WagonDocument {
  id: number;
  name: string;
  url: string;
  type: string;
}

export interface TableViewProps {
  data: WagonData[];
  isLoading?: boolean;
  onRowClick?: (wagon: WagonData) => void;
}

export interface RailViewProps {
  data: WagonData[];
  isLoading?: boolean;
  onWagonClick?: (wagon: WagonData) => void;
}

export interface AddWagonListProps {
  onClose?: () => void;
  onSuccess?: () => void;
  shiftId?: number;
}

export interface WagonPreparationPDFProps {
  data: any;
  t: (key: string) => string;
}
