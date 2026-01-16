export interface Order {
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
  created_at?: string;
  updated_at?: string;
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

export interface OrderResponse {
  data: Order;
  message: string;
}

export interface OrdersResponse {
  data: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface SupplierLocation {
  id: number;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface TariffLocation {
  id: number;
  name: string;
  location: string;
  type: string;
  created_at: string;
  updated_at: string;
}

export interface FormErrors {
  [key: string]: string;
}

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
