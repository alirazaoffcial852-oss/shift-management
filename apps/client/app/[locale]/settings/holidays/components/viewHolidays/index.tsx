"use client";
import { useMemo, useState, useEffect } from "react";
import { useHolidayColumns, getHolidayActions } from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useHolidayTable } from "@/hooks/holiday/useHolidayTable";
import { useTranslations } from "next-intl";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Edit2Icon,
  Trash2,
  X,
  Plus,
} from "lucide-react";
import {
  addDays,
  endOfMonth,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isEqual,
  isToday,
  startOfMonth,
  startOfWeek,
  isSameMonth,
} from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { cn } from "@workspace/ui/lib/utils";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@workspace/ui/components/dialog";
import { COLORS } from "@/constants/holiday.constants";
import { usePermission } from "@/hooks/usePermission";

interface Holiday {
  id: string;
  name: string;
  from: string;
  to: string;
  company_id: number;
  created_at: string;
  updated_at: string;
}

const Viewholiday = () => {
  const router = useRouter();
  const tAction = useTranslations("actions");
  const tSetting = useTranslations("pages.holidays");
  const t = useTranslations("components.pagination");
  const { hasPermission } = usePermission();

  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const month = useMemo(() => currentMonth.getMonth() + 1, [currentMonth]);
  const year = useMemo(() => currentMonth.getFullYear(), [currentMonth]);

  const { holidays, removeHoliday, refetch } = useHolidayTable(
    1,
    20,
    month,
    year
  );

  useEffect(() => {
    refetch();
  }, [month, year]);

  const holidayActions = getHolidayActions({
    onDelete: removeHoliday,
  });

  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth),
    [currentMonth]
  );

  const [showMoreHolidays, setShowMoreHolidays] = useState<{
    date: Date | null;
    holidays: Holiday[];
  }>({ date: null, holidays: [] });

  function getCalendarDays(date: Date) {
    const start = startOfWeek(startOfMonth(date));
    const end = endOfWeek(endOfMonth(date));

    const days: Date[] = [];
    let day = start;

    while (day <= end) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setCurrentMonth(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentMonth(nextMonth);
  };

  const handleTodayClick = () => {
    setCurrentMonth(new Date());
  };

  function isDateInHoliday(date: Date, holiday: Holiday) {
    const startDate = new Date(holiday.from);
    const endDate = new Date(holiday.to);

    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    return (
      isEqual(compareDate, startDate) ||
      isEqual(compareDate, endDate) ||
      (isAfter(compareDate, startDate) && isBefore(compareDate, endDate))
    );
  }

  function getHolidayColor(holiday: Holiday) {
    const hash = holiday.name.split("").reduce((acc: number, char: string) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return COLORS[Math.abs(hash) % COLORS.length];
  }

  function handleShowMoreClick(date: Date, dayHolidays: Holiday[]) {
    setShowMoreHolidays({
      date: date,
      holidays: dayHolidays,
    });
  }

  const HolidayItem = ({
    holiday,
    isInModal = false,
  }: {
    holiday: Holiday;
    isInModal?: boolean;
  }) => {
    return (
      <div className="relative" key={holiday.id}>
        <Popover>
          <PopoverTrigger asChild>
            <div
              className={cn(
                "cursor-pointer truncate rounded px-1.5 py-1 text-xs mb-1",
                getHolidayColor(holiday),
                isInModal && "py-2 text-sm"
              )}
            >
              {holiday.name}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0 shadow-lg" align="start">
            <div className="p-4 border-b">
              <h4 className="font-medium text-lg">{holiday.name}</h4>
              <div className="text-sm text-muted-foreground flex items-center mt-1">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                {format(new Date(holiday.from), "PPP")} -{" "}
                {format(new Date(holiday.to), "PPP")}
              </div>
            </div>
            <div className="flex justify-end p-3 bg-gray-50 dark:bg-gray-900/30 gap-2">
              {hasPermission("settings.holiday") && (
                <SMSButton
                  variant="outline"
                  size="sm"
                  className="rounded-md h-10 text-sm"
                  onClick={() =>
                    router.push(`/settings/holidays/${holiday.id}/edit`)
                  }
                  startIcon={<Edit2Icon className="w-4 h-4" />}
                >
                  {tAction("edit")}
                </SMSButton>
              )}
              {hasPermission("settings.holiday") && (
                <div>
                  {holidayActions[1]?.element({
                    ...holiday,
                    id: Number(holiday.id),
                  })}
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  return (
    <>
      <Card className="w-full mx-auto shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center mb-5">
            <CardTitle className="flex items-center text-xl text-primary">
              <Calendar className="mr-2 h-5 w-5" />
              {tSetting("holidayCalendar")}
            </CardTitle>
            {hasPermission("settings.holiday") && (
              <SMSButton
                text={tAction("add") + " " + tSetting("title")}
                startIcon={<Plus className="h-4 w-4" />}
                className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
                onClick={() => router.push("/settings/holidays/add")}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-lg font-semibold">
              {format(currentMonth, "MMMM yyyy")}
            </div>
            <div className="flex items-center space-x-2">
              <SMSButton
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handlePrevMonth}
              >
                <ChevronLeft className="h-4 w-4" />
              </SMSButton>
              <SMSButton
                variant="outline"
                className="h-8 px-3 rounded-md text-sm"
                onClick={handleTodayClick}
              >
                {tSetting("today")}
              </SMSButton>
              <SMSButton
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={handleNextMonth}
              >
                <ChevronRight className="h-4 w-4" />
              </SMSButton>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-2">
          <div className="rounded-md border overflow-hidden">
            <div className="grid grid-cols-7 bg-muted font-medium">
              {[
                tSetting("sun"),
                tSetting("mon"),
                tSetting("tue"),
                tSetting("wed"),
                tSetting("thu"),
                tSetting("fri"),
                tSetting("sat"),
              ].map((day) => (
                <div
                  key={day}
                  className="p-3 text-center border-r last:border-r-0 border-b"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, i) => {
                // Find holidays that include this day
                const dayHolidays = holidays.filter((holiday) =>
                  isDateInHoliday(day, holiday)
                );
                console.log(dayHolidays, "dayHolidays");

                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                return (
                  <div
                    key={i}
                    className={cn(
                      "min-h-28 p-2 border-r border-b last:border-r-0",
                      !isCurrentMonth &&
                        "bg-gray-50 text-gray-400 dark:bg-gray-900/30",
                      isToday(day) && "bg-blue-50/50 dark:bg-blue-900/10",
                      isWeekend &&
                        isCurrentMonth &&
                        "bg-gray-50/50 dark:bg-gray-800/20"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <div
                        className={cn(
                          "flex items-center justify-center h-7 w-7 text-sm font-medium rounded-full",
                          isToday(day) && "bg-primary text-primary-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </div>
                      {dayHolidays.length > 0 && (
                        <Badge
                          variant="outline"
                          className="text-xs rounded-full"
                        >
                          {dayHolidays.length}
                        </Badge>
                      )}
                    </div>

                    <div className="mt-1 space-y-1 max-h-20 overflow-y-auto scrollbar-thin">
                      {dayHolidays.slice(0, 2).map((holiday) => (
                        <TooltipProvider key={holiday.id}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="w-full">
                                <HolidayItem holiday={holiday} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                              <p>
                                {holiday.name} (
                                {format(new Date(holiday.from), "MMM d")} -{" "}
                                {format(new Date(holiday.to), "MMM d")})
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ))}
                      {dayHolidays.length > 2 && (
                        <div
                          className="text-xs text-blue-600 dark:text-blue-400 cursor-pointer hover:underline font-medium px-1.5 py-1"
                          onClick={() => handleShowMoreClick(day, dayHolidays)}
                        >
                          +{dayHolidays.length - 2} {tSetting("more")}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={showMoreHolidays.date !== null}
        onOpenChange={(open) => {
          if (!open) setShowMoreHolidays({ date: null, holidays: [] });
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              {tSetting("holidaysFor")}{" "}
              {showMoreHolidays.date &&
                format(showMoreHolidays.date, "MMMM d, yyyy")}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 max-h-[60vh] overflow-y-auto pr-2">
            {showMoreHolidays.holidays.map((holiday) => (
              <HolidayItem
                key={holiday.id}
                holiday={holiday}
                isInModal={true}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Viewholiday;
