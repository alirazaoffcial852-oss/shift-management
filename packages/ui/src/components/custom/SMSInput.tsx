import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Label } from "@workspace/ui/components/label";
import { DatePickerValue, SMSDatePicker } from "./SMSDatePicker";
import { SMSTimePicker } from "./SMSTimePicker";

export interface CustomInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  showPasswordToggle?: boolean;
  isLoginPage?: boolean;
  forgotPasswordComponent?: React.ReactNode;
  i18n?: string;
  popoverDirection?: "up" | "down";
}

export const SMSInput = React.forwardRef<HTMLInputElement, CustomInputProps>(
  (
    {
      className,
      type,
      label,
      error,
      startIcon,
      endIcon,
      showPasswordToggle,
      required,
      isLoginPage,
      forgotPasswordComponent,
      onChange,
      i18n,
      popoverDirection,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const inputType = showPassword ? "text" : type;

    const handleCustomDatePickerChange = (value: DatePickerValue) => {
      if (onChange) {
        onChange({
          target: {
            value: value ? value.startDate : null,
            name: props.name,
            type: "date",
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const handleTimeChange = (newValue: string) => {
      if (onChange) {
        onChange({
          target: {
            value: newValue,
            name: props.name,
            type: "time",
          },
        } as unknown as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="w-full space-y-2">
        {type === "date" ? (
          <SMSDatePicker
            label={label || ""}
            onChange={handleCustomDatePickerChange}
            error={error}
            disabled={props.disabled}
            required={required}
            className={className}
            i18n={i18n}
            placeholder={props.placeholder}
            value={{
              startDate: props.value ? new Date(props.value as string) : null,
              endDate: props.value ? new Date(props.value as string) : null,
            }}
            popoverDirection={popoverDirection}
            readOnly={false}
          />
        ) : type === "time" ? (
          <SMSTimePicker
            value={props.value as string}
            label={label || ""}
            onChange={(value) => handleTimeChange(value)}
            error={error}
            disabled={props.disabled}
            required={required}
            className={className}
          />
        ) : (
          <>
            {label && (
              <div className="flex justify-between items-center">
                <Label
                  htmlFor={props.id}
                  className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1"
                >
                  {label}
                  {required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {props.name === "password" &&
                  isLoginPage &&
                  forgotPasswordComponent}
              </div>
            )}
            <div className="relative">
              {startIcon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {startIcon}
                </div>
              )}
              <input
                type={inputType}
                className={cn(
                  "flex h-[54px] w-full rounded-[16px] border border-input bg-background p-[16px] text-[16px] ring-0 ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:border-1 disabled:cursor-not-allowed disabled:opacity-50",
                  error &&
                    "border-red-500 shadow-[0px_0px_0px_4px_rgba(232,47,46,0.08)]",
                  startIcon && "pl-10",
                  (endIcon || showPasswordToggle) && "pr-10",
                  className
                )}
                onChange={onChange}
                ref={ref}
                {...props}
              />
              {showPasswordToggle && type === "password" && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                  <span className="sr-only">
                    {showPassword ? "Hide password" : "Show password"}
                  </span>
                </button>
              )}
              {endIcon && !showPasswordToggle && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  {endIcon}
                </div>
              )}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </>
        )}
      </div>
    );
  }
);
SMSInput.displayName = "SMSInput";
