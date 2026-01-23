import { PropsWithChildren, ReactNode } from "react";
export interface Step {
  title: string;
}
export interface FormLayoutProps extends PropsWithChildren {
  heading?: ReactNode;
  steps?: Step[];
  currentStep?: number;
  children?: React.ReactNode;
  isDialog?: boolean;
}
export interface EditFormProps {
  useComponentAs: "EDIT" | "ADD";
  isEditMode?: boolean;
  id?: string;
}
