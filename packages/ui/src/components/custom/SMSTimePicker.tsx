import React, { useState, useRef, useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Button } from "@workspace/ui/components/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Input } from "@workspace/ui/components/input";
import { Clock } from "lucide-react";
import { Label } from "@workspace/ui/components/label";
import { cn } from "@workspace/ui/lib/utils";

export interface TimePickerProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  error?: string;
  required?: boolean;
}

export const SMSTimePicker = React.forwardRef<
  HTMLButtonElement,
  TimePickerProps
>(
  (
    {
      label,
      value,
      onChange,
      disabled = false,
      className = "",
      error,
      required,
      ...props
    },
    ref
  ) => {
    const [selectedTime, setSelectedTime] = useState(() => {
      const [hour, minute] = (value || "").split(":");
      return {
        hour: hour ? hour.padStart(2, "0") : "00",
        minute: minute ? minute.padStart(2, "0") : "00",
      };
    });
    const [inputValue, setInputValue] = useState(value || "00:00");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const hours = Array.from({ length: 24 }, (_, i) =>
      i.toString().padStart(2, "0")
    );
    const minutes = Array.from({ length: 60 }, (_, i) =>
      i.toString().padStart(2, "0")
    );

    const handleTimeChange = (type: "hour" | "minute", newValue: string) => {
      const newTime = { ...selectedTime, [type]: newValue };
      setSelectedTime(newTime);
      const newInputValue = `${newTime.hour}:${newTime.minute}`;
      setInputValue(newInputValue);
      onChange(newInputValue);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 4);

      const hourPart = digitsOnly.slice(0, 2);
      const minutePart = digitsOnly.slice(2);

      let formattedValue = digitsOnly;
      if (digitsOnly.length > 2) {
        formattedValue = `${hourPart}:${minutePart}`;
      } else if (digitsOnly.length > 0) {
        formattedValue = hourPart;
      } else {
        formattedValue = "";
      }

      setInputValue(formattedValue);

      const validatedHour =
        hourPart.length > 0
          ? Math.min(Math.max(parseInt(hourPart, 10) || 0, 0), 23)
              .toString()
              .padStart(2, "0")
          : "00";

      const validatedMinute =
        minutePart.length > 0
          ? Math.min(Math.max(parseInt(minutePart, 10) || 0, 0), 59)
              .toString()
              .padStart(2, "0")
          : "00";

      setSelectedTime((prev) => ({
        hour: validatedHour,
        minute:
          minutePart.length === 0 && digitsOnly.length === 0
            ? "00"
            : minutePart.length === 0
              ? prev.minute
              : validatedMinute,
      }));

      if (digitsOnly.length === 4) {
        onChange(`${validatedHour}:${validatedMinute}`);
      }

      setTimeout(() => {
        if (inputRef.current) {
          const nextPosition = formattedValue.length;
          inputRef.current.setSelectionRange(nextPosition, nextPosition);
        }
      }, 0);
    };

    const handleInputBlur = () => {
      const formattedValue = `${selectedTime.hour}:${selectedTime.minute}`;
      setInputValue(formattedValue);
      onChange(formattedValue);
    };

    useEffect(() => {
      const [hour, minute] = (value || "").split(":");
      const newTime = {
        hour: hour ? hour.padStart(2, "0") : "00",
        minute: minute ? minute.padStart(2, "0") : "00",
      };
      setSelectedTime(newTime);
      setInputValue(`${newTime.hour}:${newTime.minute}`);
    }, [value]);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);

    const timeIcon = <Clock className="h-5 w-5" />;

    return (
      <div className="w-full space-y-2">
        {label && (
          <div className="flex justify-between items-center">
            <Label
              htmlFor={label}
              className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1"
            >
              {label}
              {required && <span className="text-red-500 ml-1">*</span>}
            </Label>
          </div>
        )}

        <div className="relative">
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={ref}
                type="button"
                variant="outline"
                disabled={disabled}
                className={cn(
                  "flex h-[54px] w-full rounded-[16px] border border-input bg-background p-[16px] text-[16px] ring-0 ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:border-1 disabled:cursor-not-allowed disabled:opacity-50",
                  error &&
                    "border-red-500 shadow-[0px_0px_0px_4px_rgba(232,47,46,0.08)]",
                  timeIcon && "pl-10",
                  className
                )}
                {...props}
              >
                <span className="flex-1 text-left">{inputValue}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4">
              <div className="space-y-4">
                <Input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  className="text-center outline-none border focus-visible:ring-2 rounded text-base"
                />
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label
                      htmlFor="hour-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Hour
                    </label>
                    <Select
                      value={selectedTime.hour}
                      onValueChange={(value) => handleTimeChange("hour", value)}
                    >
                      <SelectTrigger id="hour-select">
                        <SelectValue>{selectedTime.hour}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {hours.map((hour) => (
                          <SelectItem key={hour} value={hour}>
                            {hour}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <label
                      htmlFor="minute-select"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Minute
                    </label>
                    <Select
                      value={selectedTime.minute}
                      onValueChange={(value) =>
                        handleTimeChange("minute", value)
                      }
                    >
                      <SelectTrigger id="minute-select">
                        <SelectValue>{selectedTime.minute}</SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {minutes.map((minute) => (
                          <SelectItem key={minute} value={minute}>
                            {minute}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

SMSTimePicker.displayName = "SMSTimePicker";
