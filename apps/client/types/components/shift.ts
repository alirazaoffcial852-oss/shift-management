import { Shift } from "../shift";
import { FORMMODE } from "../shared/global";

export interface ShiftActionsProps {
  selectedShifts: Set<string>;
  onDeleteShifts: () => void;
  onFixedShifts?: () => void;
  onPlannedShifts?: () => void;
  isDeleting?: boolean;
}

export interface BulkShiftActionsProps {
  selectedShifts: Set<string>;
  onAction: (action: string) => void;
  isLoading?: boolean;
}

export interface ShiftEventProps {
  shift: Shift;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  onClick?: (shift: Shift) => void;
  onDragStart?: (shift: Shift) => void;
  view?: "monthly" | "weekly";
}

export interface ShiftListProps {
  shifts: Shift[];
  isLoading?: boolean;
  onShiftClick?: (shift: Shift) => void;
}

export interface ShiftInformationProps {
  shift: Shift;
  mode?: "view" | "edit";
}

export interface ShiftHandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  shiftId?: number;
  onSuccess?: () => void;
}

export interface OrderSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (orderId: number) => void;
  currentDate?: Date;
}

export interface PersonnelSectionProps {
  roles: any[];
  onRoleChange: (index: number, field: string, value: any) => void;
  onAddRole: () => void;
  onRemoveRole: (index: number) => void;
  errors?: Record<string, string>;
}

export interface DocumentUploadProps {
  documents: File[];
  existingDocuments?: any[];
  onDocumentsChange: (files: File[]) => void;
  onRemoveExisting?: (id: number) => void;
  maxFiles?: number;
}

export interface RoutePlanningTableProps {
  routes: any[];
  onRouteChange: (index: number, field: string, value: any) => void;
  onAddRoute: () => void;
  onRemoveRoute: (index: number) => void;
  errors?: Record<string, string>;
}

export interface ProjectUSNShiftDayCellProps {
  date: Date;
  shifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
  onAddShift?: (date: Date) => void;
  isToday?: boolean;
}

export interface ProjectUSNShiftEventProps {
  shift: Shift;
  onClick?: (shift: Shift) => void;
  onDragStart?: (shift: Shift) => void;
}

export interface RouteLocationPDFProps {
  route: any;
  shift: Shift;
  t: (key: string) => string;
}

export interface RouteWagonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeIndex: number;
  wagons: any[];
  onWagonsChange: (wagons: any[]) => void;
}

export interface ShiftFormProps {
  mode: FORMMODE;
  shiftId?: number;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export interface ViewShiftProps {
  shiftId: number;
  onClose?: () => void;
}

export interface BasicInformationProps {
  shift: Shift;
}

export interface ShiftDetailProps {
  shift: Shift;
}
