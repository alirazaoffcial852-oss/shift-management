"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2, Plus, X } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Label } from "@workspace/ui/components/label";
import { Button } from "@workspace/ui/components/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@workspace/ui/components/command";
import { Popover, PopoverContent, PopoverTrigger } from "@workspace/ui/components/popover";
import { useInView } from "react-intersection-observer";
import { Badge } from "@workspace/ui/components/badge";

export interface SMSComboboxProps {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  value?: string | string[];
  onValueChange?: (value: string) => void;
  options: { value: string; label: string }[];
  error?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  className?: string;
  popoverClassName?: string;
  multiple?: boolean;
  addNew?: {
    text: string;
    onClick: () => void;
  };
  hasMore?: boolean;
  onLoadMore?: (searchQuery?: string) => void;
  loadingMore?: boolean;
  onSearch?: (searchQuery: string) => void;
  onOpen?: () => void;
  color?: "red" | "green" | "yellow" | "blue" | "default";
}

export const SMSCombobox = React.forwardRef<HTMLDivElement, SMSComboboxProps>(
  (
    {
      label,
      placeholder = "Select an option...",
      searchPlaceholder = "Search...",
      emptyText = "No options found.",
      value,
      onValueChange,
      options,
      error,
      disabled,
      loading,
      required,
      className,
      popoverClassName,
      multiple = false,
      addNew,
      hasMore = false,
      onLoadMore,
      loadingMore = false,
      onSearch,
      onOpen,
      color = "default",
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const prevOptionsLengthRef = React.useRef(options.length);

    const { ref: loadMoreRef, inView } = useInView({
      threshold: 0.5,
      rootMargin: "0px 0px 200px 0px",
    });

    React.useEffect(() => {
      if (options.length > prevOptionsLengthRef.current) {
        prevOptionsLengthRef.current = options.length;
      }
    }, [options.length]);

    React.useEffect(() => {
      if (open) {
        onOpen?.();
      }
    }, [open, onOpen]);

    const isSelected = React.useCallback(
      (optionValue: string) => {
        if (multiple && Array.isArray(value)) {
          return value.includes(optionValue);
        }
        return value === optionValue;
      },
      [value, multiple]
    );

    const handleSelect = React.useCallback(
      (currentValue: string) => {
        if (multiple) {
          if (Array.isArray(value)) {
            const newValue = isSelected(currentValue) ? value.filter((v) => v !== currentValue) : [...value, currentValue];

            onValueChange?.(currentValue);
          } else {
            onValueChange?.(currentValue);
          }
        } else {
          onValueChange?.(currentValue === value ? "" : currentValue);
          setOpen(false);
        }
      },
      [onValueChange, value, isSelected, multiple]
    );

    const getSelectedLabels = React.useCallback(() => {
      if (multiple && Array.isArray(value) && value.length > 0) {
        return value.map((val) => options.find((option) => option.value === val)?.label || val);
      }

      const selectedOption = options.find((option) => option.value === value);
      return selectedOption ? [selectedOption.label] : [];
    }, [options, value, multiple]);

    const selectedLabels = getSelectedLabels();

    const handleSearchChange = React.useCallback(
      (input: string) => {
        setSearchQuery(input);

        const timer = setTimeout(() => {
          onSearch?.(input);
        }, 300);

        return () => clearTimeout(timer);
      },
      [onSearch]
    );

    const filteredOptions = React.useMemo(() => {
      if (!searchQuery) return options;
      return options.filter((option) => option.label.toLowerCase().includes(searchQuery.toLowerCase()));
    }, [options, searchQuery]);

    React.useEffect(() => {
      if (open && inView && hasMore && !loadingMore && onLoadMore && filteredOptions.length > 0) {
        onLoadMore(searchQuery);
      }
    }, [open, inView, hasMore, loadingMore, onLoadMore, searchQuery, filteredOptions.length]);

    const removeValue = (valueToRemove: string) => {
      if (multiple && Array.isArray(value)) {
        const newValue = value.filter((v) => v !== valueToRemove);
        onValueChange?.(valueToRemove);
      }
    };

    // Color classes for different states
    const getColorClasses = () => {
      switch (color) {
        case "red":
          return "border-red-500 bg-red-50 text-red-700 focus-visible:border-red-500";
        case "green":
          return "border-green-500 bg-green-50 text-green-700 focus-visible:border-green-500";
        case "yellow":
          return "border-yellow-500 bg-yellow-50 text-yellow-700 focus-visible:border-yellow-500";
        case "blue":
          return "border-blue-500 bg-blue-50 text-blue-700 focus-visible:border-blue-500";
        default:
          return "";
      }
    };

    return (
      <div className="w-full space-y-2" ref={ref} {...props}>
        {label && (
          <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled || loading}
              className={cn(
                "w-full justify-between min-h-[54px] rounded-[16px] border border-input p-[16px] text-[16px] ring-0 ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 focus-visible:border-primary focus-visible:border-1 disabled:cursor-not-allowed disabled:opacity-50 font-normal",
                error && "border-red-500 shadow-[0px_0px_0px_4px_rgba(232,47,46,0.08)]",
                color !== "default" && getColorClasses(),
                className
              )}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : selectedLabels.length > 0 ? (
                <div className="flex items-center gap-2">
                  {multiple ? (
                    selectedLabels.length === 1 ? (
                      // Show single selected label
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {selectedLabels[0]}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeValue(Array.isArray(value) ? (value[0] as string) : "");
                          }}
                          className="focus:outline-none"
                          aria-label={`Remove ${selectedLabels[0]}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <span>{selectedLabels.length} selected</span>
                      </Badge>
                    )
                  ) : (
                    <span>{selectedLabels[0]}</span>
                  )}
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
              <ChevronDown className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className={cn("w-full p-0", popoverClassName)} align="start">
            <Command shouldFilter={false}>
              <CommandInput placeholder={searchPlaceholder} value={searchQuery} onValueChange={handleSearchChange} />
              <div className="flex flex-col h-full max-h-[300px]">
                <CommandList className="overflow-auto flex-grow capitalize">
                  <CommandEmpty>{emptyText}</CommandEmpty>
                  <CommandGroup>
                    {filteredOptions.map((option, index) => (
                      <CommandItem
                        key={`${option.value}-${index}`}
                        value={option.value}
                        onSelect={() => handleSelect(option.value)}
                      >
                        <Check className={cn("mr-2 h-4 w-4", isSelected(option.value) ? "opacity-100" : "opacity-0")} />
                        {option.label}
                      </CommandItem>
                    ))}

                    {hasMore && filteredOptions.length > 0 && <div ref={loadMoreRef} className="h-4 w-full mt-1" aria-hidden="true" data-testid="load-more-trigger" />}

                    {loadingMore && (
                      <div className="flex items-center justify-center py-2">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        <span className="ml-2 text-sm text-muted-foreground">Loading more...</span>
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>

                {addNew && (
                  <div className="border-t border-gray-200 sticky bottom-0 bg-white w-full">
                    <CommandItem
                      onSelect={() => {
                        addNew.onClick();
                        setOpen(false);
                      }}
                      className="py-2 px-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {addNew.text}
                    </CommandItem>
                  </div>
                )}

                {multiple && Array.isArray(value) && value.length > 0 && (
                  <div className="border-t border-gray-200 p-2 flex justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Clear all selections
                        value.forEach((v) => onValueChange?.(v));
                      }}
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>
            </Command>
          </PopoverContent>
        </Popover>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

SMSCombobox.displayName = "SMSCombobox";
