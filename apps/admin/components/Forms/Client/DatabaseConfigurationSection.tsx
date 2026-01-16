import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { DatabaseConfigurationSectionProps } from "@/types/clientForm.interface";

export const DatabaseConfigurationSection: React.FC<
  DatabaseConfigurationSectionProps
> = ({ client, errors, handleInputChange }) => {
  return (
    <>
      <SMSInput
        label="Database Hostname"
        value={client.database_credentials.db_hostname}
        onChange={(e) =>
          handleInputChange(
            "database_credentials",
            "db_hostname",
            e.target.value
          )
        }
        required
        error={errors["database_credentials.db_hostname"]}
        name="db_hostname"
        type="text"
        placeholder="Enter database hostname"
      />

      <SMSInput
        label="Database Name"
        value={client.database_credentials.db_name}
        onChange={(e) =>
          handleInputChange("database_credentials", "db_name", e.target.value)
        }
        required
        error={errors["database_credentials.db_name"]}
        name="db_name"
        type="text"
        placeholder="Enter database name"
      />

      <SMSInput
        label="Database Port"
        value={client.database_credentials.db_port}
        onChange={(e) =>
          handleInputChange("database_credentials", "db_port", e.target.value)
        }
        required
        error={errors["database_credentials.db_port"]}
        name="db_port"
        type="text"
        placeholder="Enter database port"
      />

      <SMSInput
        label="Database Username"
        value={client.database_credentials.db_username}
        onChange={(e) =>
          handleInputChange(
            "database_credentials",
            "db_username",
            e.target.value
          )
        }
        required
        error={errors["database_credentials.db_username"]}
        name="db_username"
        type="text"
        placeholder="Enter database username"
      />
    </>
  );
};
