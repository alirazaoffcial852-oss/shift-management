// useEmployeeForm.ts
import {
  useCallback,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from "react";
import { useRouter } from "next/navigation";
import { Employee } from "../../types/employee";
import { validateEmployee, validatePricing } from "@/utils/validation/employee";
import { toast } from "sonner";
import EmployeeService from "@/services/employee";
import { initialEmployee } from "@/constants/employee.constants";
import { useAuth, useCompany } from "@/providers/appProvider";
import { useRoleManager } from "../role/useRole";
import { useTranslations } from "next-intl";

export const useEmployeeForm = (id?: number, isDialog: boolean = false) => {
  const router = useRouter();
  const { company } = useCompany();
  const { user } = useAuth();
  const t = useTranslations("common");

  const [employee, setEmployee] = useState<Employee>(initialEmployee);
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleEmployeeUpdate: Dispatch<SetStateAction<Employee>> = useCallback(
    (updatedEmployee) => {
      setEmployee((prev) => {
        const newEmployee =
          typeof updatedEmployee === "function"
            ? updatedEmployee(prev)
            : updatedEmployee;

        if (newEmployee.address) {
          clearError("address");
        }
        if (newEmployee.country) {
          clearError("country");
        }
        if (newEmployee.city) {
          clearError("city");
        }
        if (newEmployee.postal_code) {
          clearError("postal_code");
        }

        return newEmployee;
      });
    },
    [clearError]
  );
  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await EmployeeService.getEmployeeById(id);

      const employeeData: Employee = {
        user: {
          name: response.data.name,
          email: response.data.email,
        },
        ...response.data,
      };

      setEmployee(employeeData);
    } catch (error) {
      console.error("Error fetching Customer:", error);
      toast.error(t("an_error_occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleContinue = () => {
    const newErrors = validateEmployee(employee);
    if (Object.keys(newErrors).length === 0) {
      setCurrentStep(currentStep + 1);
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    const newErrors = validatePricing(employee.pricing);
    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        let pricing = {
          far_away_hourly_rate: Number(employee.pricing.far_away_hourly_rate),
          nearby_hourly_rate: Number(employee.pricing.nearby_hourly_rate),
          costing_terms: employee.pricing.costing_terms,
          monthly_hours_target_enabled:
            employee.pricing.monthly_hours_target_enabled,
          monthly_hours_target: employee.pricing.monthly_hours_target_enabled
            ? employee.pricing.monthly_hours_target
            : 0,
          nightShiftPricing: {
            night_time_rate: Number(
              employee.pricing.nightShiftPricing.night_time_rate
            ),
            night_time_rate_type:
              employee.pricing.nightShiftPricing.night_time_rate_type,
            night_shift_start_at:
              employee.pricing.nightShiftPricing.night_shift_start_at,
            night_shift_end_at:
              employee.pricing.nightShiftPricing.night_shift_end_at,
          },
          travellingPricing: {
            travel_time_rate: Number(
              employee.pricing.travellingPricing.travel_time_rate
            ),
            travel_time_rate_type:
              employee.pricing.travellingPricing.travel_time_rate_type,
            travel_allowance_departure: Number(
              employee.pricing.travellingPricing.travel_allowance_departure
            ),
            travel_allowance_departure_type:
              employee.pricing.travellingPricing
                .travel_allowance_departure_type,
            travel_allowance_arrival: Number(
              employee.pricing.travellingPricing.travel_allowance_arrival
            ),
            travel_allowance_arrival_type:
              employee.pricing.travellingPricing.travel_allowance_arrival_type,
            full_day_travel_allowance: Number(
              employee.pricing.travellingPricing.full_day_travel_allowance
            ),
            full_day_travel_allowance_type:
              employee.pricing.travellingPricing.full_day_travel_allowance_type,
          },
          holidayPricing: {
            holiday_rate: Number(employee.pricing.holidayPricing.holiday_rate),
            holiday_rate_type:
              employee.pricing.holidayPricing.holiday_rate_type,
            sunday_rate: Number(employee.pricing.holidayPricing.sunday_rate),
            sunday_rate_type: employee.pricing.holidayPricing.sunday_rate_type,
          },
        };

        const formData = new FormData();
        formData.append("name", employee.user.name);
        formData.append("role_id", employee.role_id?.toString() || "");
        formData.append("email", employee.user.email);
        formData.append("phone", employee.phone);
        formData.append(
          "date_of_birth",
          employee.date_of_birth
            ? new Date(employee.date_of_birth).toISOString()
            : ""
        );
        formData.append(
          "hiring_date",
          employee.hiring_date
            ? new Date(employee.hiring_date).toISOString()
            : ""
        );
        formData.append("gender", employee.gender.toString());
        formData.append("address", employee.address);
        formData.append("country", employee?.country?.toString() || "");
        formData.append("city", employee?.city?.toString() || "");
        formData.append("postal_code", employee.postal_code);
        formData.append("company_id", company?.id?.toString() ?? "");
        formData.append("pricing", JSON.stringify(pricing));

        const response = await (id
          ? EmployeeService.updateEmployee(id, formData)
          : EmployeeService.AddEmployee(formData));
        toast.success(response?.message || t("operation_successful"));

        // Only redirect if not in dialog mode
        if (!isDialog) {
          router.push("/employees");
        }

        return true;
      } catch (error: any) {
        const errorMessage = error?.data?.message || t("an_error_occurred");

        if (error?.data?.type === "VALIDATION_ERROR" && error?.data?.errors) {
          const apiErrors = error.data.errors;

          const formattedErrors: { [key: string]: string } = {};

          try {
            Object.entries(apiErrors).forEach(([field, messages]) => {
              if (field === "email") {
                formattedErrors["email"] = Array.isArray(messages)
                  ? messages[0]
                  : String(messages);
              } else {
                formattedErrors[field] = Array.isArray(messages)
                  ? messages[0]
                  : String(messages);
              }
            });

            setErrors((prev) => {
              console.log("Previous errors:", prev);
              return formattedErrors;
            });

            setTimeout(() => {
              console.log("Errors after update (timeout):", errors);
            }, 100);
          } catch (parseError) {
            setErrors({ general: "Validation error occurred" });
          }
        }

        toast.error(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return {
    employee,
    setEmployee: handleEmployeeUpdate,
    currentStep,
    errors,
    company,
    loading,
    handleContinue,
    handleBack,
    handleSubmit,
    clearError,
  };
};
