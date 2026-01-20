"use client";
import * as React from "react";
import Datepicker, { DateValueType } from "react-tailwindcss-datepicker";
import { cn } from "@workspace/ui/lib/utils";
import { Label } from "@workspace/ui/components/label";
import { Calendar } from "lucide-react";

export type DatePickerValue = DateValueType;

export interface DatePickerProps {
  label: string;
  error?: string;
  required?: boolean;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  useRange?: boolean;
  asSingle?: boolean;
  minDate?: Date;
  maxDate?: Date;
  displayFormat?: string;
  value?: DatePickerValue;
  onChange: (value: DatePickerValue) => void;
  inputId?: string;
  inputName?: string;
  popoverDirection?: "up" | "down";
  containerClassName?: string;
  i18n?: string;
}

export const SMSDatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      label,
      error,
      required,
      className,
      disabled = false,
      readOnly = false,
      placeholder = "DD/MM/YYYY",
      useRange = false,
      asSingle = true,
      minDate,
      maxDate,
      displayFormat = "DD/MM/YYYY",
      value,
      onChange,
      inputId = "datepicker",
      inputName = "datepicker",
      popoverDirection = "down",
      containerClassName,
      i18n = "en",
      ...props
    },
    ref
  ) => {
    const [dateValue, setDateValue] = React.useState<DatePickerValue>({
      startDate: value?.startDate || null,
      endDate: value?.endDate || null,
    });
    const [inputValue, setInputValue] = React.useState("");
    const [showCalendar, setShowCalendar] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const calendarRef = React.useRef<HTMLDivElement>(null);
    const datepickerWrapperRef = React.useRef<HTMLDivElement>(null);

    const formatDateForInput = (date: Date): string => {
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      const separator = displayFormat.includes(".") ? "." : "/";
      return `${day}${separator}${month}${separator}${year}`;
    };

    React.useEffect(() => {
      if (value?.startDate) {
        setDateValue(value);
        const date = new Date(value.startDate);
        if (!isNaN(date.getTime())) {
          setInputValue(formatDateForInput(date));
        }
      } else {
        setInputValue("");
      }
    }, [value, displayFormat]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(event.target as Node) &&
          inputRef.current &&
          !inputRef.current.contains(event.target as Node)
        ) {
          setShowCalendar(false);
        }
      };

      if (showCalendar) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [showCalendar]);

    // Trigger click on hidden datepicker input when calendar should show
    React.useEffect(() => {
      if (showCalendar && datepickerWrapperRef.current) {
        const hiddenInput = datepickerWrapperRef.current.querySelector("input");
        if (hiddenInput) {
          setTimeout(() => {
            hiddenInput.click();
            hiddenInput.focus();
          }, 0);
        }
      }
    }, [showCalendar]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const input = e.target.value;

      let cleaned = input.replace(/[^\d/]/g, "");

      const numbersOnly = cleaned.replace(/\//g, "");

      let formatted = "";
      for (let i = 0; i < numbersOnly.length && i < 8; i++) {
        if (i === 2 || i === 4) {
          formatted += "/";
        }
        formatted += numbersOnly[i];
      }

      setInputValue(formatted);

      if (formatted.length === 10) {
        const parts = formatted.split("/");
        const day = parseInt(parts[0] ?? "", 10);
        const month = parseInt(parts[1] ?? "", 10);
        const year = parseInt(parts[2] ?? "", 10);

        if (
          day >= 1 &&
          day <= 31 &&
          month >= 1 &&
          month <= 12 &&
          year >= 1900 &&
          year <= 2100
        ) {
          const date = new Date(year, month - 1, day);

          if (
            date.getDate() === day &&
            date.getMonth() === month - 1 &&
            date.getFullYear() === year
          ) {
            const newValue: DatePickerValue = {
              startDate: date,
              endDate: date,
            };
            setDateValue(newValue);
            onChange(newValue);
          }
        }
      } else if (formatted.length === 0) {
        const emptyValue: DatePickerValue = {
          startDate: null,
          endDate: null,
        };
        setDateValue(emptyValue);
        onChange(emptyValue);
      }
    };

    const handleValueChange = (newValue: DatePickerValue | null) => {
      if (newValue?.startDate) {
        setDateValue(newValue);
        onChange(newValue);

        const date = new Date(newValue.startDate);
        setInputValue(formatDateForInput(date));
        setShowCalendar(false);
      } else {
        const emptyValue: DatePickerValue = {
          startDate: null,
          endDate: null,
        };
        setDateValue(emptyValue);
        onChange(emptyValue);
        setInputValue("");
        setShowCalendar(false);
      }
    };

    const toggleCalendar = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && !readOnly) {
        setShowCalendar(!showCalendar);
      }
    };

    const handleInputClick = () => {
      if (!disabled && !readOnly) {
        setShowCalendar(true);
      }
    };

    return (
      <div className="w-full space-y-2" ref={ref} {...props}>
        {label && (
          <div className="flex justify-between items-center">
            <Label
              htmlFor={inputId}
              className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )}
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            id={inputId}
            name={inputName}
            value={inputValue}
            onChange={handleInputChange}
            onClick={handleInputClick}
            onFocus={handleInputClick}
            placeholder={placeholder}
            disabled={disabled}
            readOnly={readOnly}
            maxLength={10}
            className={cn(
              "h-[54px] w-full rounded-[16px] border-2 border-input bg-background p-[16px] pr-12 text-[16px] ring-0 ring-offset-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:border-1 disabled:cursor-not-allowed disabled:opacity-50",
              error &&
                "border-red-500 shadow-[0px_0px_0px_4px_rgba(232,47,46,0.08)]",
              className
            )}
          />
          <button
            type="button"
            onClick={toggleCalendar}
            disabled={disabled || readOnly}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Calendar className="h-5 w-5" />
          </button>

          {showCalendar && !disabled && !readOnly && (
            <div
              ref={calendarRef}
              className={cn(
                "absolute z-50 mt-1 right-0",
                popoverDirection === "up" ? "bottom-full mb-1" : "top-full",
                containerClassName
              )}
            >
              <div ref={datepickerWrapperRef}>
                <Datepicker
                  i18n={i18n}
                  startWeekOn="mon"
                  useRange={useRange}
                  primaryColor={"emerald"}
                  readOnly={false}
                  disabled={false}
                  inputId={inputId + "-hidden"}
                  inputName={inputName + "-hidden"}
                  asSingle={asSingle}
                  value={dateValue}
                  onChange={handleValueChange}
                  placeholder={placeholder}
                  inputClassName="opacity-0 absolute pointer-events-none"
                  containerClassName="w-full"
                  popoverDirection={popoverDirection}
                  minDate={minDate}
                  maxDate={maxDate}
                  displayFormat={displayFormat}
                />
              </div>
            </div>
          )}
        </div>
        {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
      </div>
    );
  }
);

SMSDatePicker.displayName = "SMSDatePicker";
