import { Employee, Pricing } from "@/types/employee";
import { Role, RoleFormData } from "@/types/role";

export interface EmployeeFormProps {
  employee: Employee;
  company: any;
  onUpdate: (employee: Employee) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  isEditMode?: boolean;
  isDialog?: boolean;
  onclose?: () => void;
}
export interface PricingFormProps {
  employee: Employee;
  onUpdate: (employee: Employee) => void;
  errors: { [key: string]: string };
  onSubmit: () => void;
  handleBack: () => void;
  isSubmitting: boolean;
  isDialog?: boolean;
  onclose?: () => void;
}

export interface PricingComponentProps {
  employee: PricingFormProps["employee"];
  handlePricingChange: (category: keyof Pricing | "root", field: string, value: string | boolean | number) => void;
  safeNumberToString: (value: number | undefined | null) => string;
  errors: any;
}
