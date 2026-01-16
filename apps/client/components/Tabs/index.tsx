import { useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { cn } from "@workspace/ui/lib/utils";
import { TabsProps } from "@/types/tabs";
import { useTranslations } from "next-intl";
import "./tabs.css";

export default function Tabs({ options, value, onChange }: TabsProps) {
  const [coords, setCoords] = useState({ x: 50, y: 50 });
  const tCustomers = useTranslations("pages.customers");
  const tProducts = useTranslations("pages.products");

  const handleMouseMove = (e: React.MouseEvent<HTMLLabelElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCoords({ x, y });
  };

  const getLabel = (label: string, value: string) => {
    if (label === "Active") {
      // Try customers first, fallback to products
      try {
        return tCustomers("active");
      } catch {
        return tProducts("active");
      }
    }
    if (label === "Archive") {
      try {
        return tCustomers("archive");
      } catch {
        return tProducts("archive");
      }
    }
    return label;
  };

  return (
    <div className="sms-radio-inputs">
      {options.map((option, index) => (
        <label className="sms-radio" key={index}>
          <input
            checked={value.toUpperCase() === option.value.toUpperCase()}
            name="radio"
            type="radio"
            onChange={() => onChange(option.value)}
          />
          <span className="name">{getLabel(option.label, option.value)}</span>
        </label>
      ))}
    </div>
  );
}
