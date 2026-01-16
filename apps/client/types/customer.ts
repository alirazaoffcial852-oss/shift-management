import { Product } from "./product";
import { Project } from "./project";
import { STATUS } from "./shared/global";

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  contact_person_name: string;
  contact_person_phone: string;
  address: string;
  status: STATUS;
  city: number | null;
  postal_code: string;
  email: string;
  country: number | null;
  company_id: number;
  is_for_project_usn_only?: boolean;
  products: Product[];
  projects: Project[];
}
