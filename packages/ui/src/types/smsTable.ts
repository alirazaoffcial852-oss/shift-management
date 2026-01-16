export interface TableColumn {
  header: string;
  accessor: string;
  className?: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface TableAction {
  label: string;
  element: (row: any) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface SMSTableProps {
  columns: TableColumn[];
  data: any[];
  actions?: Array<{
    element: (row?: any) => React.ReactNode;
    label?: string;
  }>;
  className?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  pagination?: boolean;
  isLoading?: boolean;
  search?: boolean;
  onSearchChange?: (searchTerm: string) => void;
  onTimeFilterChange?: (value: string) => void;
  onDateRangeChange?: (dateRange: any) => void;
  dateTimeFilter?: boolean;
  enableSelection?: boolean;
  selectedRows?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
  getRowClassName?: (row: any) => string;

  // New filter props
  showFilter?: boolean;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  onFilterChange?: (filterValue: string) => void;
  filterLabel?: string;
  selectedFilterValue?: string;

  // Custom content slot between filters and table
  headerBottomContent?: React.ReactNode;

  // Custom header text for actions column
  actionsHeader?: string;

  // Search placeholder text
  searchPlaceholder?: string;
}
