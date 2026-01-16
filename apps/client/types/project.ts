import { STATUS } from "./shared/global";

export interface Project {
  id?: number;
  name: string;
  customer_id: string;
  status?: STATUS;
  projectId?: string;
}
