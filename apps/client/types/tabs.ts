import { OPTIONS } from "@/constants/tabsOption.constant";
import { STATUS } from "./shared/global";

export interface TabsProps {
  options: TabOption[];
  value: STATUS;
  onChange: (value: STATUS) => void;
  className?: string;
}
export type TabOption = (typeof OPTIONS.tabs)[number];
