import { useEffect, useState, useCallback } from "react";
import { Customer } from "../../types/customer";
import CustomerService from "@/services/customer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Company } from "@/types/configuration";
import { useCompany } from "@/providers/appProvider";
import { useCountry } from "@workspace/ui/hooks/useCountry";
import { Country } from "@workspace/ui/types/country";
import { City } from "@workspace/ui/types/city";
import { useTranslations } from "next-intl";

interface ValidationRules {
  pattern?: RegExp;
  message?: string;
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  is_for_project_usn_only?: boolean;
}

const VALIDATION_RULES: Record<keyof Partial<Customer>, ValidationRules> = {
  id: {},
  name: {
    message: "Name is required",
    required: true,
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Please enter a valid email address",
    required: true,
  },
  phone: {
    message: "Phone is required",
    required: true,
  },
  contact_person_name: {
    message: "Contact person name is required",
    required: true,
  },
  contact_person_phone: {
    message: "Contact person phone is required",
    required: true,
  },
  address: {
    message: "Address is required",
    required: true,
  },
  postal_code: {
    message: "Postal code is required",
    required: true,
  },
  city: {
    message: "City is required",
    required: true,
  },
  country: {
    message: "Country is required",
    required: true,
  },
  status: {},
  company_id: {},
  is_for_project_usn_only: {
    required: true,
  },
  products: {},
  projects: {},
};

const INITIAL_STATE: Partial<Customer> = {
  name: "",
  phone: "",
  contact_person_name: "",
  contact_person_phone: "",
  address: "",
  city: null,
  postal_code: "",
  country: null,
  email: "",
  company_id: 22,
  is_for_project_usn_only: false,
};

export const useCustomerForm = (id?: number, onclose?: () => void) => {
  const router = useRouter();
  const { company } = useCompany();
  const t = useTranslations("common");
  const [customers, setCustomers] = useState<Partial<Customer>>(INITIAL_STATE);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState<{
    country: Country;
    city: City;
  }>();

  const fetchCustomerData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await CustomerService.getCustomerById(id);
      const { customer, location } = response.data;
      const customerData = {
        name: customer.name,
        phone: customer.phone,
        contact_person_name: customer.contact_person_name,
        contact_person_phone: customer.contact_person_phone,
        address: customer.address,
        city: customer.city,
        postal_code: customer.postal_code,
        country: customer.country,
        email: customer.email,
        company_id: customer.company_id,
        is_for_project_usn_only: customer.is_for_project_usn_only,
      };

      setCustomers(customerData);
      setLocationData(location);
      validateAllFields(customerData);
    } catch (error) {
      console.error("Error fetching Customer:", error);
      toast.error(t("an_error_occurred"));
    }
  }, [id]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const clearError = useCallback((field: keyof Customer) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearLocationErrors = useCallback(() => {
    clearError("address");
    clearError("country");
    clearError("city");
    clearError("postal_code");
  }, [clearError]);

  const validateField = useCallback(
    (
      field: keyof Customer,
      value: string | number | boolean | null
    ): boolean => {
      const rules = VALIDATION_RULES[field];

      if (value === null && rules.required) {
        setErrors((prev) => ({
          ...prev,
          [field]: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
        }));
        return false;
      }

      const stringValue = value !== null ? String(value).trim() : "";

      if (rules.required && stringValue === "") {
        setErrors((prev) => ({
          ...prev,
          [field]: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
        }));
        return false;
      }

      if (
        field === "email" &&
        rules.pattern &&
        stringValue !== "" &&
        !rules.pattern.test(stringValue)
      ) {
        setErrors((prev) => ({
          ...prev,
          [field]: rules.message || `Invalid ${field.replace(/_/g, " ")}`,
        }));
        return false;
      }

      clearError(field);
      return true;
    },
    [clearError]
  );

  const validateAllFields = useCallback(
    (data: Partial<Customer>): boolean => {
      let isValid = true;

      // First check if required fields are present in the data object
      Object.entries(VALIDATION_RULES).forEach(([key, rules]) => {
        const field = key as keyof Customer;
        if (rules.required) {
          // Check if the field exists in data and validate it
          const value = data[field];
          if (
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "")
          ) {
            setErrors((prev) => ({
              ...prev,
              [field]: `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
            }));
            isValid = false;
          } else if (!validateField(field, value as string | number | null)) {
            isValid = false;
          }
        }
      });

      // Validate email separately if it exists
      if (data.email !== undefined && !validateField("email", data.email)) {
        isValid = false;
      }

      return isValid;
    },
    [validateField, setErrors]
  );

  const handleInputChange = useCallback(
    (field: keyof Customer, value: string | number | boolean | null) => {
      setCustomers((prev) => ({ ...prev, [field]: value }));
      validateField(field, value);

      if (field === "address" && value) {
        clearError("address");
      }
      if (field === "country" && value) {
        clearError("country");
      }
      if (field === "city" && value) {
        clearError("city");
      }
      if (field === "postal_code" && value) {
        clearError("postal_code");
      }
    },
    [validateField, clearError]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllFields(customers)) {
      toast.error(
        t("validation.required", { field: "" }) ||
          "Please fix the validation errors"
      );
      return false;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      Object.entries(customers).forEach(([key, value]) => {
        if (key === "company_id") {
          formData.append(key, String(company?.id));
        } else {
          formData.append(key, value !== null ? String(value) : "");
        }
      });

      const response = await (id
        ? CustomerService.updateCustomer(id, formData)
        : CustomerService.createCustomer(formData));

      toast.success(response?.message || t("operation_successful"));
      if (onclose) {
        onclose();
      } else {
        router.push("/customers");
      }
      return true;
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("an_error_occurred");
      toast.error(errorMessage);

      if (error?.data?.type === "VALIDATION_ERROR" && error?.data?.errors) {
        const apiErrors = error.data.errors;
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(apiErrors).map(([field, messages]) => [
              field,
              Array.isArray(messages) ? messages[0] : messages,
            ])
          ),
        }));
      }

      console.error("Error submitting form:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    customers,
    locationData,
    setLocationData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    validateField,
    companies,
  };
};
