import { City } from "@workspace/ui/types/city";
import { Client } from "@workspace/ui/types/client.js";
import { Country } from "@workspace/ui/types/country";
import { Language } from "@workspace/ui/types/language";

export interface BasicInformationSectionProps {
  data: Client;
  errors: Record<string, string>;
  isEditMode: boolean;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}
export interface SubscriptionPaymentSectionProps {
  client: Client;
  errors: Record<string, string>;
  isEditMode: boolean;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}
export interface ConfigurationNumbersSectionProps {
  client: Client;
  errors: Record<string, string>;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}
export interface DatabaseConfigurationSectionProps {
  client: Client;
  errors: Record<string, string>;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}
export interface BaseFormLayoutProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  isEditMode: boolean;
  loading: boolean;
}

export interface LanguageSectionProps {
  data: Client;
  errors: Record<string, string>;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}

export interface CountryCitySectionProps {
  data: Client;
  locationData?: {
    country: Country;
    city: City;
  };
  errors: Record<string, string>;
  handleInputChange: (
    section: keyof Client,
    field: string,
    value: string | number
  ) => void;
}
