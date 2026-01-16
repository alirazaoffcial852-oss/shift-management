import { Company } from "@/types/configuration";
import { Customer } from "@/types/customer";
import { Product } from "@/types/product";
import { FORMMODE } from "@/types/shared/global";
import { RouteOption } from "@/types/shared/route";
import { IniateShift, Shift as BaseShift } from "@/types/shift";

export interface ShiftDocument {
  id: number;
  shift_id: number;
  document: string;
  created_at: string;
  updated_at: string;
}

export interface Shift extends Omit<BaseShift, "documents"> {
  documents: ShiftDocument[];
}

export interface StepRendererProps {
  shifts: Shift;
  setShifts: React.Dispatch<React.SetStateAction<Shift>>;
  iniateShift: IniateShift[];
  setIniateShift: React.Dispatch<React.SetStateAction<IniateShift[]>>;
  company: Company;
  files: File[];
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  setRoutes: React.Dispatch<React.SetStateAction<RouteOption[]>>;
  routes: RouteOption[];
  products: Product[];
  currentStep: number;
  errors: { [key: string]: string };
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  setCustomizeProduct?: (product: Product) => void;
}

export interface BasicInformationFormProps {
  iniateShift: IniateShift[];
  onUpdate: (shifts: IniateShift[]) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  hideFooter?: boolean;
}

export interface ShiftInformationFormProps {
  shifts: Shift;
  useComponentAs?: FORMMODE;
  setCustomizeProduct?: (product: Product) => void;
  onUpdate: (shifts: any) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  handleBack: () => void;
  products: Product[];
}

export interface BasicDetailFormProps {
  shifts: Shift;
  useComponentAs?: FORMMODE;
  setCustomizeProduct?: (product: Product) => void;
  products: Product[];
  onUpdate: (Shift: any) => void;
  errors: { [key: string]: string };
}

export interface PersonalDetailFormProps {
  shifts: Shift;
  product: Product;
  onUpdate: (Shift: any) => void;
  errors: { [key: string]: string };
}

export interface shiftDetailFormProps {
  shifts: Shift;
  products: Product[];
  isSubmitting: boolean;
  onContinue: () => void;
  handleBack: () => void;
  onUpdate: (Shift: any) => void;
  errors: { [key: string]: string };
  files: File[];
  useComponentAs?: FORMMODE;
  dragActive: boolean;
  handleDrag: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent) => void;
  handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (index: number) => void;
  handleDocumentRemoval?: (documentId: number) => void;
}

export interface CustomerSectionProps {
  shifts: Shift;
  onUpdate: (field: keyof Shift, value: any) => void;
  errors: { [key: string]: string };
}

export interface TrainSectionProps {
  shifts: Shift;
  onUpdate: (newTrains: any[]) => void;
  errors: { [key: string]: string };
}
