import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { MoreVertical } from "lucide-react";
import Pagination from "@workspace/ui/components/custom/SMSTable/Pagination";
import { SMSTableProps, TableColumn } from "@workspace/ui/types/smsTable";
import NoDataFound from "../NoDataFound/index";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { SearchFilters } from "../TableFilters";
import { useTranslations } from "next-intl";
import { SMSTableSkeleton } from "./Skeleton";

const getNestedValue = (obj: any, path: string) => {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

export function SMSTable({
  columns,
  data,
  actions,
  className,
  currentPage = 1,
  totalPages = 0,
  onPageChange = () => {},
  pagination = true,
  isLoading = false,
  search = false,
  onSearchChange = () => {},
  onTimeFilterChange = () => {},
  onDateRangeChange = () => {},
  dateTimeFilter = false,
  enableSelection = false,
  selectedRows = [],
  onSelectionChange = () => {},
  getRowClassName,
  showFilter = false,
  filterOptions = [],
  filterPlaceholder = "Select filter...",
  onFilterChange = () => {},
  filterLabel = "Filter",
  selectedFilterValue = "",
  headerBottomContent,
  actionsHeader = "Actions",
  searchPlaceholder,
}: SMSTableProps) {
  // Always call hooks unconditionally at the top level
  const t = useTranslations("common.labels");
  const defaultSearchPlaceholder = searchPlaceholder || t("typeHereToSearch");

  const selectionColumn = enableSelection
    ? [
        {
          header: "",
          accessor: "selection",
          className: "w-[50px]",
        },
      ]
    : [];

  const allColumns = [
    ...selectionColumn,
    ...columns,
    ...(actions
      ? [{ header: actionsHeader, accessor: "actions", className: "w-[100px]" }]
      : []),
  ];

  const handleRowSelection = (id: number) => {
    const newSelection = selectedRows.includes(id)
      ? selectedRows.filter((rowId) => rowId !== id)
      : [...selectedRows, id];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allIds = data.map((row) => row.id);
    const newSelection = selectedRows.length === data.length ? [] : allIds;
    onSelectionChange(newSelection);
  };

  const renderCell = (column: TableColumn, row: any, rowIndex: number) => {
    if (column.accessor === "selection") {
      return (
        <Checkbox
          checked={selectedRows.includes(row.id)}
          onCheckedChange={() => handleRowSelection(row.id)}
        />
      );
    }

    if (column.accessor === "actions" && actions) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none hover:bg-gray-100 p-1 rounded-md transition-colors">
            <MoreVertical className="h-5 w-5 text-gray-600" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 p-1 bg-white">
            {actions.map((action, index) => (
              <DropdownMenuItem
                key={index}
                className="cursor-pointer p-0 focus:bg-transparent"
              >
                {action.element(row)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    if (column.accessor === "__index__") {
      return rowIndex + 1;
    }

    if (column.render && typeof column.render === "function") {
      const cellValue = getNestedValue(row, column.accessor);
      return column.render(cellValue, row);
    }

    return getNestedValue(row, column.accessor);
  };

  if (isLoading) {
    return (
      <SMSTableSkeleton
        columns={columns.length}
        rows={10}
        showSearch={search}
        showActions={!!actions}
        className={className}
      />
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mt-4 md:mt-6 !pb-1 !mb-4">
        <div className="rounded-lg overflow-x-auto">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {search && (
              <div className="flex-1">
                <SearchFilters
                  dateFilter={true}
                  onSearchChange={onSearchChange}
                  onDateRangeChange={onDateRangeChange}
                  searchPlaceholder={defaultSearchPlaceholder}
                />
              </div>
            )}
            {showFilter && filterOptions.length > 0 && (
              <div className="flex-shrink-0">
                <DropdownMenu>
                  <DropdownMenuTrigger className="ml-2 inline-flex mt-[7px] items-center justify-center rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                    {selectedFilterValue
                      ? filterOptions.find(
                          (option) => option.value === selectedFilterValue
                        )?.label || "All"
                      : "All"}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-white">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => onFilterChange("")}
                    >
                      All
                    </DropdownMenuItem>
                    {filterOptions.map((option) => (
                      <DropdownMenuItem
                        key={option.value}
                        className="cursor-pointer"
                        onClick={() => onFilterChange(option.value)}
                      >
                        {option.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>

          {/* Custom header content (e.g., filter pills) */}
          {headerBottomContent && (
            <div className="mb-4">{headerBottomContent}</div>
          )}

          <Table className={className}>
            <TableHeader className="[&_tr]:border-b-0 ">
              <TableRow className="bg-muted">
                {allColumns.map((column, index) => (
                  <TableHead
                    key={index}
                    className={cn(
                      "font-medium whitespace-nowrap capitalize",
                      index === 0 && "rounded-l-xl",
                      index === allColumns.length - 1 && "rounded-r-xl",
                      column.className
                    )}
                  >
                    {column.accessor === "selection" ? (
                      <Checkbox
                        checked={
                          selectedRows.length === data.length && data.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    ) : (
                      column.header
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={cn(getRowClassName?.(row), "transition-colors")}
                >
                  {allColumns.map((column, cellIndex) => (
                    <TableCell
                      key={`${cellIndex}`}
                      className={cn(
                        "whitespace-nowrap",
                        cellIndex === 0 && "font-medium",
                        column.accessor === "email" ? "" : "capitalize",
                        column.className
                      )}
                    >
                      {renderCell(column, row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {data.length === 0 && <NoDataFound />}
          {pagination && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </div>
      </div>
    </>
  );
}

export { SMSTableSkeleton } from "./Skeleton";
