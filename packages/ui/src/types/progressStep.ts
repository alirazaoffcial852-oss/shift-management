import { ReactNode } from "react";

export interface ProgressStepsProps {
  currentStep?: number;
  steps?: { title: string }[];
  heading: ReactNode;
}
