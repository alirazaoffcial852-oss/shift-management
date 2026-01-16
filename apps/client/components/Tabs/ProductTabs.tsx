import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import "./tabs.css";

export type PRODUCT_TAB_STATUS = "ACTIVE" | "ARCHIVED" | "USN_PRODUCT";

export interface ProductTabsProps {
  options: ProductTabOption[];
  value: PRODUCT_TAB_STATUS;
  onChange: (value: PRODUCT_TAB_STATUS) => void;
  className?: string;
}

export interface ProductTabOption {
  label: string;
  value: PRODUCT_TAB_STATUS;
}

export default function ProductTabs({
  options,
  value,
  onChange,
  className,
}: ProductTabsProps) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const router = useRouter();
  const t = useTranslations("pages.products");

  const handleMouseMove = (e: React.MouseEvent<HTMLLabelElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const handleTabChange = (optionValue: PRODUCT_TAB_STATUS) => {
    onChange(optionValue);
    if (optionValue === "USN_PRODUCT") {
      router.push("/products/project-usn-product");
    }
  };

  const getLabel = (value: PRODUCT_TAB_STATUS) => {
    if (value === "ACTIVE") return t("active");
    if (value === "ARCHIVED") return t("archive");
    if (value === "USN_PRODUCT") return t("usnProduct");
    return "";
  };

  return (
    <div className={cn("sms-radio-inputs", className)}>
      {options.map((option, index) => (
        <label className="sms-radio" key={index}>
          <input
            checked={value.toUpperCase() === option.value.toUpperCase()}
            name="radio"
            type="radio"
            onChange={() => handleTabChange(option.value)}
          />
          <span className="name">{getLabel(option.value)}</span>
        </label>
      ))}
    </div>
  );
}
