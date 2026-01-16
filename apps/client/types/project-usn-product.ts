import { STATUS } from "./shared/global";

export interface SupplierPlantRow {
  id: string;
  distance: string;
  costPerTon: string;
}

export interface SupplierPlantColumn {
  id: string;
  label: string;
  rows: SupplierPlantRow[];
  tonnage: string;
}

export interface ProjectUsnProduct {
  product_usn_personnel_roles: any;
  id?: number;
  name: string;
  status?: STATUS;
  customer_id: number;
  supplier_id: number;
  company_id?: number;
  personnel_role_ids?: number[];
  supplier_plants: {
    tons: number;
    distances: {
      distance_km: number;
      cost_per_ton: number;
    }[];
  }[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateProjectUsnProductPayload {
  supplier_id: number;
  customer_id: number;
  company_id?: number;
  personnel_role_ids: number[];
  supplier_plants: {
    tons: number;
    distances: {
      distance_km: number;
      cost_per_ton: number;
    }[];
  }[];
}

export interface ProjectUsnProductResponse {
  data: ProjectUsnProduct;
  message: string;
}

export interface ProjectUsnProductListData {
  data: ProjectUsnProduct[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}

export interface ProjectUsnProductListResponse {
  data: ProjectUsnProductListData;
  message: string;
}
