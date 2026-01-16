export enum LocationType {
  WAREHOUSE = "WAREHOUSE",
  TARIF_POINT = "TARIF_POINT",
  SUPPLIER_PLANT = "SUPPLIER_PLANT",
}

export interface Location {
  id: number;
  name: string;
  location: string;
  type: LocationType;
  company_id?: number;
  created_at?: string;
  updated_at?: string;
}

export interface LocationFormData {
  name: string;
  location: string;
  type: LocationType;
}

export interface LocationResponse {
  data: Location[];
  message: string;
  pagination?: {
    current_page: number;
    total_pages: number;
    total_items: number;
    per_page: number;
  };
}
