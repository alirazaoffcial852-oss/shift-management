import React, { useState, useRef, useEffect } from "react";
import { Badge } from "@workspace/ui/components/badge";
import { X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface Option {
  value: string;
  label: string;
}

interface MultiSelectorProps {
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  label?: string;
  error?: string;
  className?: string;
  required?: boolean;
  disabledOptions?: string[];
  highlightedOptions?: string[];
  maxHeight?: string; // Added prop for customizable max height
}

const MultiSelector = ({
  options,
  selected,
  onChange,
  label,
  error,
  className,
  required,
  disabledOptions = [],
  highlightedOptions = [],
  maxHeight = "150px", // Default max height
}: MultiSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchText.toLowerCase()) &&
      !selected.includes(option.value)
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (option: Option) => {
    onChange([...selected, option.value]);
    setSearchText("");
    inputRef.current?.focus();
  };

  const handleRemove = (valueToRemove: string) => {
    if (disabledOptions.includes(valueToRemove)) {
      return;
    }
    onChange(selected.filter((value) => value !== valueToRemove));
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchText === "" && selected.length > 0) {
      handleRemove(selected[selected.length - 1] || "");
    }
  };

  return (
    <div className="w-full" ref={wrapperRef}>
      {label && (
        <label className="block text-[18px] font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <div
          className={`flex w-full rounded-[16px] overflow-y-auto border border-input bg-background px-3 py-2 text-sm ring-0 ring-offset-0 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-0 focus-within:ring-ring focus-within:ring-offset-0 focus-within:border-primary focus-within:border-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            error ? "border-red-500" : ""
          } cursor-text items-center gap-3 flex-wrap`}
          style={{ maxHeight: maxHeight, overflowY: "auto" }} // Added max height and vertical scroll
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          {selected.map((value) => {
            const option = options.find((opt) => opt.value === value);
            const isHighlighted = highlightedOptions.includes(value);
            const isDisabled = disabledOptions.includes(value);

            return (
              <Badge
                key={value}
                variant="secondary"
                className={`flex gap-2 items-center px-2 font-medium py-3 ${
                  isHighlighted
                    ? "bg-[#3E8258]/10 border border-[#3E8258]/30"
                    : "bg-[#2D2E330D]/5"
                } text-gray-800 text-xs rounded-[8px] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]`}
                title={
                  isDisabled
                    ? "This is your current company and cannot be deselected"
                    : ""
                }
              >
                {option?.label || value}
                {!isDisabled && (
                  <div className="bg-[#2D2E3380]/50 p-1 rounded-full text-white cursor-pointer">
                    <X
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(value);
                      }}
                      size={12}
                    />
                  </div>
                )}
              </Badge>
            );
          })}
          <input
            ref={inputRef}
            type="text"
            className={cn(
              "flex-grow h-[38px] outline-none min-w-[80px] bg-transparent text-sm",
              className
            )}
            value={searchText}
            onChange={(e) => {
              setSearchText(e.target.value);
              setIsOpen(true);
            }}
            onKeyDown={handleKeyDown}
            placeholder={selected.length === 0 ? "Select options..." : ""}
          />
          <button
            type="button"
            className="ml-auto"
            onClick={() => setIsOpen(!isOpen)}
          ></button>
        </div>

        {isOpen && filteredOptions.length > 0 && (
          <div className="absolute z-50 w-full mt-1 max-h-60 overflow-auto bg-white border border-gray-200 rounded-[16px] shadow-lg">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                className="px-4 py-2.5 cursor-pointer hover:bg-gray-50 text-sm"
                onClick={() => handleSelect(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default MultiSelector;
