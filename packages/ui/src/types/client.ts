import { User } from "@workspace/ui/types/user";
import { Language } from "./language";
import { Country, Location } from "./country";
import { City } from "./city";

export interface PaymentMethod {
  id?: number;
  name: string;
}
export interface Subscription {
  id?: number;
  subscription_type: "MONTHLY" | "ONE_TIME";
  subscription_date: string;
  amount: string;
  client_id?: number;
  payment_method_id: number;
  payment_method: PaymentMethod;
}
export interface DatabaseCredentials {
  id?: number;
  db_hostname: string;
  db_name: string;
  db_username: string;
  db_port: string;
}

export interface Configuration {
  id?: number;
  number_of_companies: number;
  number_of_employees: number;
  number_of_staff: number;
  number_of_customers: number;
}

export interface Client {
  user: User;
  location?: Location;
  subscriptions?: Subscription[];
  database_credentials: DatabaseCredentials;
  configuration: Configuration;
  language: Partial<Language>;
  country: Partial<Country>;
  city: Partial<City>;
}
