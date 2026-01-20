import { PaginatedResponse } from "./pagination";
import { BaseEntity, BaseEntityRequired, ApiSuccessResponse, FormErrors } from "./shared/global";

export interface Order extends BaseEntity {
  status: string;
  id: number;
  supplier_id: number;
  tariff_id: number;
  delivery_date: string;
  type_of_wagon: string;
  no_of_wagons: number;
  tonnage: number;
  distance_in_km: number;
  return_schedule: string;
  date?: string;
  remaining_tonnage?: number;
  supplier?: SupplierLocation;
  tariff?: TariffLocation;
}

export interface CreateOrderData {
  supplier_id: number;
  tariff_id: number;
  delivery_date: string;
  type_of_wagon: string;
  no_of_wagons: number;
  tonnage: number;
  distance_in_km: number;
  return_schedule: string;
}

export interface UpdateOrderData extends Partial<CreateOrderData> {}

export interface OrderResponse extends ApiSuccessResponse<Order> {}

export interface OrdersResponse extends PaginatedResponse<Order> {}

export interface SupplierLocation extends BaseEntityRequired {
  name: string;
  location: string;
  type: string;
}

export interface TariffLocation extends BaseEntityRequired {
  name: string;
  location: string;
  type: string;
}

export interface OrderFormErrors extends FormErrors {}

export const wagonTypeDisplayNames = [
  "Eaos",
  "Eanos",
  "Eamnos",
  "Eas",
  "Ealnos",
  "Fa",
  "Fas",
  "Fac",
  "Facs",
  "Faccs",
  "Faccns",
  "Fals",
  "Falns",
  "Fans",
  "Fanps",
  "Fads",
  "Fadns",
  "Falrrs",
  "Gbs",
  "Gabs",
  "Gbs-v",
  "Gabs-t",
  "Habbins",
  "Hbis",
  "Hbbins",
  "Hbillns",
  "Ibbhs",
  "Ibblps",
  "Ibbins",
  "Ks",
  "Kls",
  "Kbps",
  "Lgs",
  "Lgns",
  "Lgss",
  "Rils",
  "Res",
  "Rens",
  "Rils-x",
  "Rs",
  "Rmmps",
  "Sgns",
  "Sggmrss",
  "Slpns",
  "Shimmns",
  "Shamms",
  "Tagnpps",
  "Tagnpps-x",
  "T2000",
  "T3000",
  "Uacs",
  "Uacs-x",
  "Uagps",
  "Uapps",
  "Zacns",
  "Zans",
  "Zacens",
  "Zagkks",
  "Xas",
  "Xmms",
  "Xns",
  "Xrms",
] as const;

export const wagonTypes = wagonTypeDisplayNames.map((displayName) => ({
  label: displayName,
  value: displayName.toUpperCase(),
}));
