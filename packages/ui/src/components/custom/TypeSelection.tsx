import React from "react";

interface TypeSelectionProps {
  label: string;
  name: string;
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder: string;
  error?: string;
  type: "FLAT" | "PERCENTAGE" | "HOURLY";
  required?: boolean;
  onTypeChange: (type: "FLAT" | "PERCENTAGE" | "HOURLY") => void;
  disabled?: boolean;
  allowedTypes?: ("FLAT" | "PERCENTAGE" | "HOURLY")[];
}

const TypeSelection: React.FC<TypeSelectionProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  error,
  type,
  onTypeChange,
  required = false,
  disabled = false,
  allowedTypes = ["FLAT", "PERCENTAGE"],
}) => {
  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target;
    value = value.replace(/[^0-9.]/g, "");
    const customEvent = {
      ...e,
      target: {
        ...e.target,
        value: value,
        name: name,
      },
    };
    onChange(customEvent as React.ChangeEvent<HTMLInputElement>);
  };

  // Ensure the current type is in the allowed types, otherwise default to the first allowed type
  const safeType = allowedTypes.includes(type) ? type : allowedTypes[0];

  return (
    <div className="w-full">
      <label className="block text-[14px] sm:text-[15px]  md:text-[16px] lg:text-[18px] mb-2 font-medium whitespace-nowrap" htmlFor={name}>
        {label}
        {required && <span className="text-red-400">*</span>}
      </label>
      <div
        className={`flex items-center border shadow-sm rounded-[16px] overflow-hidden 
            ${error ? "border-red-500" : ""}
            ${disabled ? "opacity-50" : ""}
            focus-within:border-primary focus-within:border-1`}
      >
        <div className="flex-shrink-0">
          <select
            className="px-2 py-[14px] w-20 text-sm bg-white text-gray-400 border-none focus:outline-none"
            value={safeType}
            onChange={(e) => onTypeChange(e.target.value as "FLAT" | "PERCENTAGE" | "HOURLY")}
            disabled={disabled}
            aria-label="Type selector"
          >
            {allowedTypes.map((allowedType) => (
              <option key={allowedType} value={allowedType}>
                {allowedType === "FLAT" ? "Flat" : allowedType === "PERCENTAGE" ? "%" : "Hourly"}
              </option>
            ))}
          </select>
        </div>
        <div className="relative flex-grow">
          <input
            className="w-full h-12 px-3 py-2 text-sm bg-background border-none focus:outline-none"
            id={name}
            name={name}
            type="text"
            placeholder={placeholder}
            value={value as string}
            onChange={handleNumberInputChange}
            inputMode="decimal"
            disabled={disabled}
          />
          {safeType === "PERCENTAGE" && <span className="absolute right-3 text-gray-400 top-1/2 transform -translate-y-1/2">%</span>}
        </div>
      </div>
      {error && <p className="text-red-500 text-xs italic mt-1">{error}</p>}
    </div>
  );
};

export default TypeSelection;
