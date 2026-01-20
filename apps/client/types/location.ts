import { Pagination } from "./pagination";
import { BaseEntity } from "./shared/global";

export enum LocationType {
  WAREHOUSE = "WAREHOUSE",
  TARIF_POINT = "TARIF_POINT",
  SUPPLIER_PLANT = "SUPPLIER_PLANT",
}

export interface Location extends BaseEntity {
  id: number;
  name: string;
  location: string;
  type: LocationType;
  company_id?: number;
}

export interface LocationFormData {
  name: string;
  location: string;
  type: LocationType;
}

export interface LocationResponse {
  data: Location[];
  message: string;
  pagination?: Pagination;
}
