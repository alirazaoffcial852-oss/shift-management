import { City } from "./city";

export interface Timezone {
  tzName: string;
  zoneName: string;
  gmtOffset: number;
  abbreviation: string;
  gmtOffsetName: string;
}

export interface Country {
  id: number;
  name: string;
  iso3: string;
  iso2: string;
  phone_code: string;
  currency: string;
  currency_name: string;
  currency_symbol: string;
  emoji: string;
  timezones: Timezone[];
  created_at: string;
  updated_at: string;
}
export interface Location {
  country: Country;
  city: City;
}
