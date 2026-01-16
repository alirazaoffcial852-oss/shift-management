import { Client } from "@workspace/ui/types/client";

export const SUBSCRPTION_TYPES = [
  { label: "Monthly", value: "MONTHLY" },
  { label: "One Time", value: "ONE_TIME" },
];
export const INITIAL_CLIENT_STATE: Client = {
  user: {
    name: "",
    email: "",
  },
  subscriptions: [
    {
      id: 0,
      subscription_type: "ONE_TIME",
      subscription_date: "",
      amount: "0",
      client_id: 0,
      payment_method_id: 1,
      payment_method: {
        name: "",
      },
    },
  ],
  database_credentials: {
    db_hostname: "",
    db_name: "",
    db_username: "",
    db_port: "",
  },
  configuration: {
    number_of_companies: 0,
    number_of_employees: 0,
    number_of_staff: 0,
    number_of_customers: 0,
  },
  language: {
    id: 0,
  },
  country: {
    id: 0,
  },
  city: {
    id: 0,
  },
};
export const CREATE_FIELDS = [
  "name",
  "email",
  "number_of_employees",
  "number_of_companies",
  "number_of_staff",
  "number_of_customers",
  "amount",
  "payment_method_id",
  "subscription_type",
  "language_id",
  "country_id",
  "city_id",
] as const;

export const UPDATE_FIELDS = [
  "name",
  "number_of_employees",
  "number_of_companies",
  "number_of_staff",
  "number_of_customers",
  "db_hostname",
  "db_name",
  "db_port",
  "db_username",
  "language_id",
  "country_id",
  "city_id",
] as const;
