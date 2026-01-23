import { Country } from "./country";

export interface City {
  id: number;
  country_id: number;
  name: string;
  country_code: string;
  created_at: string;
  updated_at: string;
  country: Country;
}
