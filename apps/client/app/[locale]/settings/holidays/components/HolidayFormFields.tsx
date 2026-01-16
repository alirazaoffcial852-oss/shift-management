import { CalendarIcon, XCircle } from "lucide-react";
import { format } from "date-fns";
import { Label } from "@workspace/ui/components/label";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Calendar } from "@workspace/ui/components/calendar";
import { cn } from "@workspace/ui/lib/utils";
import { HolidayEntry } from "@/hooks/holiday/useHolidayForm";
import { useTranslations } from "next-intl";

type HolidayEntryFormProps = {
  entry: HolidayEntry;
  index: number;
  errors: { [key: string]: string };
  onRemove: () => void;
  onUpdate: (id: string, field: keyof HolidayEntry, value: any) => void;
  showRemoveButton: boolean;
  calendarOpen: { [key: string]: boolean };
  toggleCalendar: (id: string, type: "start" | "end", isOpen: boolean) => void;
};

export const HolidayFormFields = ({
  entry,
  index,
  errors,
  onRemove,
  onUpdate,
  showRemoveButton,
  calendarOpen,
  toggleCalendar,
}: HolidayEntryFormProps) => {
  const tHolidays = useTranslations("pages.holidays");

  return (
    <div className="border p-4 rounded-lg mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-medium">
          {tHolidays("title")} #{index + 1}
        </h3>
        {showRemoveButton && (
          <SMSButton
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            startIcon={<XCircle className="h-4 w-4" />}
          >
            {tHolidays("remove")}
          </SMSButton>
        )}
      </div>

      {/* Holiday Title */}
      <div className="space-y-2 mb-4">
        <Label
          htmlFor={`title_${entry.id}`}
          className={cn(errors[`title_${index}`] && "text-destructive")}
        >
          {tHolidays("holiday_title")}{" "}
          <span className="text-destructive">*</span>
        </Label>
        <SMSInput
          id={`title_${entry.id}`}
          value={entry.title}
          onChange={(e) => onUpdate(entry.id, "title", e.target.value)}
          placeholder={tHolidays("enterHolidayTitle")}
          className={cn(errors[`title_${index}`] && "border-destructive")}
        />
        {errors[`${index}_title`] && (
          <p className="text-sm text-destructive">{errors[`${index}_title`]}</p>
        )}
      </div>

      {/* Date Range Selection */}
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Start Date */}
        <div className="space-y-2">
          <Label
            className={cn(errors[`startDate_${index}`] && "text-destructive")}
          >
            {tHolidays("start_date")}{" "}
            <span className="text-destructive">*</span>
          </Label>
          <Popover
            open={calendarOpen[`${entry.id}_start`]}
            onOpenChange={(open) => toggleCalendar(entry.id, "start", open)}
          >
            <PopoverTrigger asChild>
              <SMSButton
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-transparent shadow-none rounded-xl",
                  !entry.startDate && "text-muted-foreground",
                  errors[`startDate_${index}`] && "border-destructive"
                )}
                startIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
              >
                {entry.startDate
                  ? format(entry.startDate, "PPP")
                  : tHolidays("selectDate")}
              </SMSButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={entry.startDate}
                onSelect={(date) => {
                  onUpdate(entry.id, "startDate", date);
                  toggleCalendar(entry.id, "start", false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors[`startDate_${index}`] && (
            <p className="text-sm text-destructive">
              {errors[`startDate_${index}`]}
            </p>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <Label
            className={cn(errors[`endDate_${index}`] && "text-destructive")}
          >
            {tHolidays("end_date")} <span className="text-destructive">*</span>
          </Label>
          <Popover
            open={calendarOpen[`${entry.id}_end`]}
            onOpenChange={(open) => toggleCalendar(entry.id, "end", open)}
          >
            <PopoverTrigger asChild>
              <SMSButton
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-transparent shadow-none rounded-xl",
                  !entry.endDate && "text-muted-foreground",
                  errors[`endDate_${index}`] && "border-destructive"
                )}
                startIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
              >
                {entry.endDate
                  ? format(entry.endDate, "PPP")
                  : tHolidays("selectDate")}
              </SMSButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={entry.endDate}
                onSelect={(date) => {
                  onUpdate(entry.id, "endDate", date);
                  toggleCalendar(entry.id, "end", false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors[`endDate_${index}`] && (
            <p className="text-sm text-destructive">
              {errors[`endDate_${index}`]}
            </p>
          )}
        </div>
      </div>

      {errors[`dateRange_${index}`] && (
        <p className="text-sm text-destructive mt-2">
          {errors[`dateRange_${index}`]}
        </p>
      )}
    </div>
  );
};
