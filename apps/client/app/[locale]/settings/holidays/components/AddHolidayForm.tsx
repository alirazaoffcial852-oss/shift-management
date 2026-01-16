import { PlusCircle, XCircle } from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { HolidayFormFields } from "./HolidayFormFields";
import { HolidayEntry } from "@/hooks/holiday/useHolidayForm";
import { useTranslations } from "next-intl";

type AddHolidayFormProps = {
  holidayEntries: HolidayEntry[];
  errors: { [key: string]: string };
  onAddEntry: () => void;
  onRemoveEntry: (id: string) => void;
  onUpdateEntry: (id: string, field: keyof HolidayEntry, value: any) => void;
  calendarOpen: { [key: string]: boolean };
  toggleCalendar: (id: string, type: "start" | "end", isOpen: boolean) => void;
};

export const AddHolidayForm = ({
  holidayEntries,
  errors,
  onAddEntry,
  onRemoveEntry,
  onUpdateEntry,
  calendarOpen,
  toggleCalendar,
}: AddHolidayFormProps) => {
  const tHolidays = useTranslations("pages.holidays");

  return (
    <>
      {holidayEntries.map((entry, index) => (
        <HolidayFormFields
          key={entry.id}
          entry={entry}
          index={index}
          errors={errors}
          onRemove={() => onRemoveEntry(entry.id)}
          onUpdate={onUpdateEntry}
          showRemoveButton={holidayEntries.length > 1}
          calendarOpen={calendarOpen}
          toggleCalendar={toggleCalendar}
        />
      ))}

      <div className="flex justify-center">
        <SMSButton type="button" variant="outline" onClick={onAddEntry} startIcon={<PlusCircle className="h-4 w-4" />}>
          {tHolidays("add_another_holiday")}
        </SMSButton>
      </div>
    </>
  );
};
