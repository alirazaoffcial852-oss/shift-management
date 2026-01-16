import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import ClientService from "@/services/client";
import { CREATE_FIELDS, INITIAL_CLIENT_STATE, UPDATE_FIELDS } from "@/constants/client.constant";
import { Client, Configuration, DatabaseCredentials, Subscription } from "@workspace/ui/types/client";

type Errors = Record<string, string>;

export const useClientForm = (id?: number) => {
  const router = useRouter();

  const [client, setClient] = useState<Client>(INITIAL_CLIENT_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      try {
        const response = await ClientService.getClientById(id);
        const clientData: Client = {
          user: {
            name: response.data.name,
            email: response.data.email,
          },
          location: {
            country: response?.data?.client?.country,
            city: response?.data?.client?.city,
          },
          subscriptions:
            response.data.client?.subscriptions?.map((sub: Subscription) => ({
              subscription_type: sub.subscription_type,
              subscription_date: sub.subscription_date,
              amount: sub.amount,
              payment_method_id: sub.payment_method_id,
              payment_method: {
                id: sub.payment_method.id,
                name: sub.payment_method.name,
              },
            })) || [],
          database_credentials: {
            db_hostname: response.data.client.db_hostname,
            db_name: response.data.client.db_name,
            db_port: response.data.client.db_port,
            db_username: response.data.client.db_username,
          },
          configuration: {
            number_of_companies: response?.data?.configuration?.number_of_companies,
            number_of_employees: response?.data?.configuration?.number_of_employees,
            number_of_staff: response?.data?.configuration?.number_of_staff,
            number_of_customers: response.data?.configuration?.number_of_customers,
          },
          language: {
            id: response.data.client.language.id,
          },
          country: {
            id: response.data.client.country.id,
          },
          city: {
            id: response.data.client.city.id,
          },
        };
        setClient(clientData);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast.error("Failed to fetch client data");
      }
    };

    fetchClientData();
  }, [id]);

  const handleInputChange = (section: keyof Client, field: string, value: string | number) => {
    if (section === "subscriptions") {
      setClient((prev) => ({
        ...prev,
        subscriptions: (prev?.subscriptions || [])?.map((sub, index) => (index === 0 ? { ...sub, [field]: value } : sub)),
      }));
    } else {
      setClient((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    }

    setErrors((prev) => ({ ...prev, [`${section}.${field}`]: "" }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};

    // User validation
    if (!client.user.name.trim()) newErrors["user.name"] = "Client name is required";
    if (!id && !client.user.email) newErrors["user.email"] = "Client email is required";

    const configFields: (keyof Configuration)[] = ["number_of_employees", "number_of_companies", "number_of_staff", "number_of_customers"];

    configFields.forEach((field) => {
      if (client.configuration?.[field] !== undefined && client.configuration[field] <= 0) {
        newErrors[`configuration.${field}`] = "Number must be positive";
      }
    });

    if (!client.language.id) {
      newErrors["language.id"] = "Language is required";
    }

    if (!client.country.id) {
      newErrors["country.id"] = "Country is required";
    }

    if (!client.city.id) {
      newErrors["city.id"] = "City is required";
    }

    if (id) {
      const dbFields: (keyof DatabaseCredentials)[] = ["db_hostname", "db_name", "db_port", "db_username"];
      dbFields.forEach((field) => {
        if (!client.database_credentials[field]) {
          newErrors[`database_credentials.${field}`] = `Database ${field.replace("db_", "")} is required`;
        }
      });
    }

    if (!id && client.subscriptions && client.subscriptions.length > 0) {
      const subscription = client.subscriptions[0];
      if (subscription && !subscription.subscription_type) {
        newErrors["subscriptions.subscription_type"] = "Subscription Type is required";
      }
      if (subscription && (!subscription.amount || parseFloat(subscription.amount) <= 0)) {
        newErrors["subscriptions.amount"] = "Amount is required and must be positive";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const prepareFormData = () => {
    const formData = new FormData();
    const fields = id ? UPDATE_FIELDS : CREATE_FIELDS;

    const fieldMapping: Record<string, string | number> = {
      name: client.user.name,
      email: client.user.email,

      number_of_employees: client.configuration.number_of_employees,
      number_of_companies: client.configuration.number_of_companies,
      number_of_staff: client.configuration.number_of_staff,
      number_of_customers: client.configuration.number_of_customers,
      amount: client.subscriptions?.[0]?.amount || "",
      payment_method_id: client.subscriptions?.[0]?.payment_method_id || "",
      subscription_type: client.subscriptions?.[0]?.subscription_type || "",

      db_hostname: client.database_credentials.db_hostname,
      db_name: client.database_credentials.db_name,
      db_port: client.database_credentials.db_port,
      db_username: client.database_credentials.db_username,
      country_id: client.country.id as number,
      city_id: client.city.id as number,
      language_id: client.language.id as number,
    };

    fields.forEach((field) => {
      const value = fieldMapping[field]?.toString() || "";
      formData.append(field, value);
    });

    return formData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    prepareFormData();
    setLoading(true);
    try {
      const formData = prepareFormData();
      const response = await (id ? ClientService.updateClient(id, formData) : ClientService.createClient(formData));

      toast(response?.message);
      router.push("/clients");
    } catch (error) {
      const errorMessage = (error as any)?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    client,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    handleBack: router.back,
    setClient,
  };
};
