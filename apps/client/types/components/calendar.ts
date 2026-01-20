import { Shift } from "../shift";
import { Order } from "../order";

export interface CalendarActionsProps {
  onAddShift?: () => void;
  onFilter?: () => void;
  onViewChange?: (view: "monthly" | "weekly") => void;
  currentView?: "monthly" | "weekly";
  selectedShiftsCount?: number;
  onBulkAction?: (action: string) => void;
}

export interface DayCellProps {
  date: Date;
  shifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
  onAddShift?: (date: Date) => void;
  isToday?: boolean;
  isSelected?: boolean;
  onDateClick?: (date: Date) => void;
}

export interface OrderDayCellProps {
  date: Date;
  orders: Order[];
  onOrderClick?: (order: Order) => void;
  onAddOrder?: (date: Date) => void;
  isToday?: boolean;
}

export interface OrderEventProps {
  order: Order;
  onClick?: (order: Order) => void;
}

export interface WeekSelectorProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  dateRangeText?: string;
}

export interface MonthYearSelectorProps {
  currentDate: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export interface CalendarFiltersProps {
  filters: CalendarFilters;
  onFilterChange: (filters: CalendarFilters) => void;
  onClear: () => void;
}

export interface CalendarFilters {
  status?: string[];
  employee_id?: string[];
  project_id?: string[];
  product_id?: string[];
  customer_id?: string[];
  location?: string;
}

export interface LocomotivesCalendarProps {
  currentDate: Date;
  shifts: Shift[];
  onShiftClick?: (shift: Shift) => void;
}

export interface RoleCalendarProps {
  currentDate: Date;
  shifts: Shift[];
  roles: any[];
  onShiftClick?: (shift: Shift) => void;
}

export interface WarehouseRoleCalendarProps {
  currentDate: Date;
  shifts: Shift[];
  roles: any[];
  onShiftClick?: (shift: Shift) => void;
}

export interface CalendarViewProps {
  currentDate: Date;
  shifts: Shift[];
  groupedShifts: Record<string, Shift[]>;
  onShiftClick?: (shift: Shift) => void;
  onAddShift?: (date: Date) => void;
  onDateChange?: (date: Date) => void;
}
