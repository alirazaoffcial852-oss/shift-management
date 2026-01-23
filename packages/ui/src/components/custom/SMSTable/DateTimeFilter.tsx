import { DateTimeFilterProps } from "@workspace/ui/types/dateRangeFilter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
export const DateTimeFilter = ({
  timeFilterOptions = [
    { value: "monthly", label: "Monthly" },
    { value: "weekly", label: "Weekly" },
    { value: "daily", label: "Daily" },
  ],
  dateRangeOptions = [
    { value: "date-range", label: "28 June 2024 - 30 Sep 2024" },
    { value: "previous", label: "Previous Period" },
  ],
  defaultTimeFilter = "monthly",
  defaultDateRange = "date-range",
  onTimeFilterChange,
  onDateRangeChange,
  additionalFilters,
  className = "",
}: DateTimeFilterProps) => {
  return (
    <div
      className={`w-full sm:w-auto flex flex-row md:flex-row  md:items-center gap-4 ${className}`}
    >
      <Select
        defaultValue={defaultTimeFilter}
        onValueChange={onTimeFilterChange}
      >
        <SelectTrigger className="w-full sm:w-[120px] rounded-full h-10">
          <SelectValue placeholder="Monthly" />
        </SelectTrigger>
        <SelectContent>
          {timeFilterOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select defaultValue={defaultDateRange} onValueChange={onDateRangeChange}>
        <SelectTrigger className="w-full sm:w-[200px] rounded-full h-10">
          <SelectValue placeholder="28 June 2024 - 30 Sep 2024" />
        </SelectTrigger>
        <SelectContent>
          {dateRangeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {additionalFilters}
    </div>
  );
};
