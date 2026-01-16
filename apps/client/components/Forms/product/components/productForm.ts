import { Company } from "@/types/configuration";
import { Product } from "@/types/product";
import { RouteOption } from "@/types/shared/route";

export type BasicInformationProps = {
  product: Product;
  customers: any[];
  productCustomization?: boolean;
  setRoutes: React.Dispatch<React.SetStateAction<RouteOption[]>>;
  routes: RouteOption[];
  fetchCustomers?: () => void;
  onUpdate: (product: Product) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  handleBack?: () => void;
  isLoadingCustomers: boolean;
  handleLoadMoreCustomers: () => void;
  handleSearchCustomers: (search: string) => void;
};
export type PersonnelSelectionFormProps = {
  product: Product;
  company: Company;
  onUpdate: (product: Product) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  handleBack: () => void;
  isSubmitting?: boolean;
};
export interface PriceModelFormProps {
  product: Product;
  setRoutes: React.Dispatch<React.SetStateAction<RouteOption[]>>;
  routes: RouteOption[];
  onUpdate: (updatedProduct: Product) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  handleBack: () => void;
  isSubmitting?: boolean;
}
export interface SelectedPersonnelDetailsFormProps {
  product: Product;
  company: Company;
  customers: any[];
  onUpdate: (product: Product) => void;
  errors: { [key: string]: string };
  onSubmit: () => void;
  handleBack: () => void;
  isSubmitting?: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  isLoadingCustomers: boolean;
  fetchCustomers?: () => void;
  handleLoadMoreCustomers: () => void;
  handleSearchCustomers: (search: string) => void;
}
export interface StepRendererProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  company: Company;
  setRoutes: React.Dispatch<React.SetStateAction<RouteOption[]>>;
  routes: RouteOption[];
  fetchCustomers?: () => void;
  productCustomization?: boolean;
  customers: any[];
  currentStep: number;
  errors: { [key: string]: string };
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  isLoadingCustomers: boolean;
  handleLoadMoreCustomers: () => void;
  handleSearchCustomers: (search: string) => void;
}
export interface CustomizeStepRendererProps {
  product: Product;
  setProduct: React.Dispatch<React.SetStateAction<Product>>;
  company: Company;
  setRoutes: React.Dispatch<React.SetStateAction<RouteOption[]>>;
  routes: RouteOption[];
  fetchCustomers?: () => void;
  productCustomization?: boolean;
  customers: any[];
  currentStep: number;
  errors: { [key: string]: string };
  handleContinue: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  selectedOption: string;
  isLoadingCustomers: boolean;
  handleLoadMoreCustomers: () => void;
  handleSearchCustomers: (search: string) => void;
  setSelectedOption: React.Dispatch<React.SetStateAction<string>>;
}
export type TotalCostFormProps = {
  product: Product;
  onUpdate: (product: Product) => void;
  errors: { [key: string]: string };
  onContinue: () => void;
  handleBack: () => void;
  isSubmitting?: boolean;
};
