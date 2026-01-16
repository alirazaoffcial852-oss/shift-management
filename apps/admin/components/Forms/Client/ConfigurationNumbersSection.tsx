import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { ConfigurationNumbersSectionProps } from "@/types/clientForm.interface";

export const ConfigurationNumbersSection: React.FC<
  ConfigurationNumbersSectionProps
> = ({ client, errors, handleInputChange }) => {
  return (
    <>
      <SMSInput
        label="Number of Employees"
        value={client?.configuration?.number_of_employees?.toString() || ""}
        onChange={(e) =>
          handleInputChange(
            "configuration",
            "number_of_employees",
            parseInt(e.target.value) || 0
          )
        }
        required
        error={errors["configuration.number_of_employees"]}
        name="number_of_employees"
        type="number"
        min="0"
        placeholder="Enter number of employees"
      />

      <SMSInput
        label="Number of Companies"
        value={client?.configuration?.number_of_companies?.toString() || ""}
        onChange={(e) =>
          handleInputChange(
            "configuration",
            "number_of_companies",
            parseInt(e.target.value) || 0
          )
        }
        required
        error={errors["configuration.number_of_companies"]}
        name="number_of_companies"
        type="number"
        min="0"
        placeholder="Enter number of companies"
      />

      <SMSInput
        label="Number of Staff"
        value={client?.configuration?.number_of_staff?.toString() || ""}
        onChange={(e) =>
          handleInputChange(
            "configuration",
            "number_of_staff",
            parseInt(e.target.value) || 0
          )
        }
        required
        error={errors["configuration.number_of_staff"]}
        name="number_of_staff"
        type="number"
        min="0"
        placeholder="Enter number of staff"
      />

      <SMSInput
        label="Number of Customers"
        value={client?.configuration?.number_of_customers?.toString() || ""}
        onChange={(e) =>
          handleInputChange(
            "configuration",
            "number_of_customers",
            parseInt(e.target.value) || 0
          )
        }
        required
        error={errors["configuration.number_of_customers"]}
        name="number_of_customers"
        type="number"
        min="0"
        placeholder="Enter number of customers"
      />
    </>
  );
};
