import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SearchInputProps } from "@workspace/ui/types/searchInput";
import { Search } from "lucide-react";

export const SearchInput = ({
  onSearchChange,
  className = "",
  inputClassName = "",
}: SearchInputProps) => {
  return (
    <div className={`relative w-full sm:w-[406px] ${className}`}>
      <SMSInput
        placeholder={"Type here to search"}
        startIcon={<Search className="w-4 h-4" />}
        className={`w-full pl-10 rounded-full h-10 ${inputClassName}`}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>
  );
};
