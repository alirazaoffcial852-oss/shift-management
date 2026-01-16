import { Label } from "@workspace/ui/components/label";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { cn } from "@workspace/ui/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@workspace/ui/components/calendar";
import { useTranslations } from "next-intl";

type SingleHolidayFormProps = {
  holiday: {
    title: string;
    startDate: Date | undefined;
    endDate: Date | undefined;
  };
  setHoliday: (holiday: { title: string; startDate: Date | undefined; endDate: Date | undefined }) => void;
  errors: { [key: string]: string };

  calendarOpen: { [key: string]: boolean };
  toggleCalendar: (id: string, type: "start" | "end", isOpen: boolean) => void;
};

export const EditHolidayForm = ({ holiday, errors, setHoliday, calendarOpen, toggleCalendar }: SingleHolidayFormProps) => {
  const tHolidays = useTranslations("pages.holidays");

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title" className={cn(errors.title && "text-destructive")}>
          {tHolidays("holiday_title")} <span className="text-destructive">*</span>
        </Label>
        <SMSInput
          id="title"
          value={holiday?.title}
          onChange={(e) => setHoliday({ ...holiday, title: e.target.value })}
          placeholder="Enter holiday title"
          className={cn(errors.title && "border-destructive")}
        />
        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className={cn(errors.startDate && "text-destructive")}>
            {tHolidays("start_date")} <span className="text-destructive">*</span>
          </Label>
          <Popover open={calendarOpen["edit_start"]} onOpenChange={(open) => toggleCalendar("edit", "start", open)}>
            <PopoverTrigger asChild>
              <SMSButton
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-transparent shadow-none rounded-xl",
                  !holiday?.startDate && "text-muted-foreground",
                  errors.startDate && "border-destructive"
                )}
                startIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
              >
                {holiday?.startDate ? format(holiday?.startDate, "PPP") : "Select date"}
              </SMSButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={holiday?.startDate}
                onSelect={(date) => {
                  setHoliday({ ...holiday, startDate: date });
                  toggleCalendar("edit", "start", false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
        </div>

        <div className="space-y-2">
          <Label className={cn(errors.endDate && "text-destructive")}>
            {tHolidays("end_date")} <span className="text-destructive">*</span>
          </Label>
          <Popover open={calendarOpen["edit_end"]} onOpenChange={(open) => toggleCalendar("edit", "end", open)}>
            <PopoverTrigger asChild>
              <SMSButton
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal bg-transparent shadow-none rounded-xl",
                  !holiday?.endDate && "text-muted-foreground",
                  errors.endDate && "border-destructive"
                )}
                startIcon={<CalendarIcon className="mr-2 h-4 w-4" />}
              >
                {holiday?.endDate ? format(holiday?.endDate, "PPP") : "Select date"}
              </SMSButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={holiday?.endDate}
                onSelect={(date) => {
                  setHoliday({ ...holiday, endDate: date });
                  toggleCalendar("edit", "end", false);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.endDate && <p className="text-sm text-destructive">{errors.endDate}</p>}
        </div>
      </div>

      {errors.dateRange && <p className="text-sm text-destructive">{errors.dateRange}</p>}
    </>
  );
};
