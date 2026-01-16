import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { toast } from "sonner";
import { useCompany } from "@/providers/appProvider";
import HolidayService from "@/services/holiday";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

export type HolidayEntry = {
  id: string;
  title: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
};

export const useHolidayForm = (useComponentAs: "ADD" | "EDIT", id?: number) => {
  const { company } = useCompany();
  const router = useRouter();
  const tHolidays = useTranslations("pages.holidays");

  const [holidayEntries, setHolidayEntries] = useState<HolidayEntry[]>([
    {
      id: "1",
      title: "",
      startDate: new Date(),
      endDate: new Date(),
    },
  ]);
  const [holiday, setHoliday] = useState<HolidayEntry>({
    id: "1",
    title: "",
    startDate: new Date(),
    endDate: new Date(),
  });
  const { title, startDate, endDate } = holiday;
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [calendarOpen, setCalendarOpen] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const fetchHolidayData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const response = await HolidayService.getHolidayById(id);
      const data = response.data;
      setHoliday({
        id: data.id,
        title: data.name,
        startDate: new Date(data.from),
        endDate: new Date(data.to),
      });
    } catch (error) {
      console.error(tHolidays("error_occurred"), error);
      toast.error(tHolidays("error_occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (useComponentAs === "EDIT") {
      fetchHolidayData();
    }
  }, [fetchHolidayData, useComponentAs]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    let hasErrors = false;

    const validateEntry = (entry: HolidayEntry, prefix: string = "") => {
      const fields = [
        {
          key: "title",
          value: entry.title,
          message: tHolidays("error_title"),
        },
        {
          key: "startDate",
          value: entry.startDate,
          message: tHolidays("error_start_date"),
        },
        {
          key: "endDate",
          value: entry.endDate,
          message: tHolidays("error_end_date"),
        },
      ];

      fields.forEach(({ key, value, message }) => {
        if (!value || (typeof value === "string" && value.trim() === "")) {
          newErrors[`${prefix}${key}`] = message;
          hasErrors = true;
        }
      });

      if (entry.startDate && entry.endDate && entry.startDate > entry.endDate) {
        newErrors[`${prefix}dateRange`] = tHolidays("error_start_date_greater_than_end_date");
        hasErrors = true;
      }
    };

    if (useComponentAs === "EDIT") {
      validateEntry(holiday);
    } else {
      holidayEntries.forEach((entry, index) => {
        validateEntry(entry, `${index}_`);
      });
    }
    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;
    if (loading) return;

    setLoading(true);

    try {
      const formData = new FormData();
      if (useComponentAs === "ADD") {
        const holidayData = holidayEntries.map((entry) => ({
          name: entry.title,
          from: format(entry.startDate as Date, "yyyy-MM-dd"),
          to: format(entry.endDate as Date, "yyyy-MM-dd"),
        }));

        formData.append("holidays", JSON.stringify(holidayData));
        if (company) {
          formData.append("company_id", company.id.toString());
        }

        const response = await HolidayService.addHoliday(formData);
        setLoading(false);
        toast.success(response.message || tHolidays("holiday_added"));
      } else {
        // For EDIT, prepare individual fields
        formData.append("name", title);
        formData.append("from", format(startDate as Date, "yyyy-MM-dd"));
        formData.append("to", format(endDate as Date, "yyyy-MM-dd"));

        if (company) {
          formData.append("company_id", company.id.toString());
        }

        const response = await HolidayService.updateHoliday(id as number, formData);
        setLoading(false);
        toast.success(response.message || tHolidays("holiday_updated"));
      }

      router.push("/settings/holidays");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error(tHolidays("error_occurred"));
      }
      console.error("Error saving holiday:", error);
    } finally {
      setLoading(false);
    }
  };

  const addHolidayEntry = () => {
    setHolidayEntries([
      ...holidayEntries,
      {
        id: `${holidayEntries.length + 1}`,
        title: "",
        startDate: new Date(),
        endDate: new Date(),
      },
    ]);
  };

  const removeHolidayEntry = (idToRemove: string) => {
    if (holidayEntries.length === 1) {
      return; // Keep at least one entry
    }
    setHolidayEntries(holidayEntries.filter((entry) => entry.id !== idToRemove));
  };

  const updateHolidayEntry = (id: string, field: keyof HolidayEntry, value: any) => {
    setHolidayEntries(holidayEntries.map((entry) => (entry.id === id ? { ...entry, [field]: value } : entry)));
  };

  const toggleCalendar = (id: string, type: "start" | "end", isOpen: boolean) => {
    setCalendarOpen({ ...calendarOpen, [`${id}_${type}`]: isOpen });
  };

  const isCalendarOpen = (id: string, type: "start" | "end") => {
    return !!calendarOpen[`${id}_${type}`];
  };

  return {
    // State
    holiday,
    holidayEntries,
    errors,
    calendarOpen,

    // Setters
    setHoliday,
    setHolidayEntries,

    // Form handlers
    handleSubmit,
    addHolidayEntry,
    removeHolidayEntry,
    updateHolidayEntry,

    // Calendar handlers
    toggleCalendar,
    isCalendarOpen,

    // Loading state
    loading,
  };
};
