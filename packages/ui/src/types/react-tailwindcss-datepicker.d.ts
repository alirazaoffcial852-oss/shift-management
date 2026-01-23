declare module "react-tailwindcss-datepicker" {
  import * as React from "react";

  export type DateType = Date | string | null;

  export interface DateValueType {
    startDate: DateType;
    endDate: DateType;
  }

  export interface DatepickerProps {
    useRange?: boolean;
    asSingle?: boolean;
    value: DateValueType;
    onChange: (
      value: DateValueType | null,
      e?: HTMLInputElement | null
    ) => void;
    placeholder?: string;
    inputClassName?: string;
    containerClassName?: string;
    primaryColor?: string;
    startWeekOn?: string;
    readOnly?: boolean;
    disabled?: boolean;
    inputId?: string;
    inputName?: string;
    popoverDirection?: "up" | "down";
    minDate?: Date;
    maxDate?: Date;
    displayFormat?: string;
    i18n?: string;
    [x: string]: any;
  }

  const Datepicker: React.FC<DatepickerProps>;

  export default Datepicker;
}
