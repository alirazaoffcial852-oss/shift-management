"use client";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { AddHolidayForm } from "./AddHolidayForm";
import { useRouter } from "next/navigation";
import { useHolidayForm } from "@/hooks/holiday/useHolidayForm";
import { EditHolidayForm } from "./EditHolidayForm";
import { FORMMODE } from "@/types/shared/global";

type CustomerFormProps = {
  useComponentAs: FORMMODE;
  id?: number;
};

const ViewHolidayForm: React.FC<CustomerFormProps> = ({ useComponentAs, id }) => {
  const tActions = useTranslations("actions");
  const tHolidays = useTranslations("pages.holidays");
  const {
    holiday,
    holidayEntries,
    errors,
    calendarOpen,
    handleSubmit,
    setHoliday,
    addHolidayEntry,
    removeHolidayEntry,
    updateHolidayEntry,
    toggleCalendar,
    loading,
  } = useHolidayForm(useComponentAs, id);
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{useComponentAs === "ADD" ? tHolidays("add_new_holiday") : tHolidays("edit_holiday")}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {useComponentAs === "EDIT" ? (
              <EditHolidayForm
                holiday={holiday}
                errors={errors}
                setHoliday={(updatedHoliday) => {
                  setHoliday({
                    ...holiday,
                    ...updatedHoliday,
                  });
                }}
                calendarOpen={calendarOpen}
                toggleCalendar={toggleCalendar}
              />
            ) : (
              <AddHolidayForm
                holidayEntries={holidayEntries}
                errors={errors}
                onAddEntry={addHolidayEntry}
                onRemoveEntry={removeHolidayEntry}
                onUpdateEntry={updateHolidayEntry}
                calendarOpen={calendarOpen}
                toggleCalendar={toggleCalendar}
              />
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex space-x-2">
              <SMSButton type="button" variant="outline" className="text-sm h-12 w-20" onClick={() => router.push("/settings/holidays")}>
                {tActions("back")}
              </SMSButton>
            </div>
            <SMSButton type="submit" className="text-sm h-12 w-20" disabled={loading} loading={loading}>
              {useComponentAs === "ADD" ? tActions("add") : tActions("update")}
            </SMSButton>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ViewHolidayForm;
