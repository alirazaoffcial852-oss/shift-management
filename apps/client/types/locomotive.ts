import { BaseEntity, FormErrors } from "./shared/global";

export interface Locomotive extends BaseEntity {
  name: string;
  model_type: string;
  engine: string;
  year: number | string;
  image?: string;
  company_id: number | null;
  status?: string;
}

export interface LocomotiveFormErrors extends FormErrors {}

export interface LocomotiveBasic extends BaseEntity {
  name: string;
  company_id?: number;
}
