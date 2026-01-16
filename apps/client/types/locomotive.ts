export interface Locomotive {
  id?: number;
  name: string;
  model_type: string;
  engine: string;
  year: number | string;
  image?: string;
  company_id: number | null;
  status?: string;
}

export interface FormErrors {
  [key: string]: string;
}
export interface locomotive {
  id?: number;
  name: string;
  company_id?: number;
}
