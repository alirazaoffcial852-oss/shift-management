import { STATUS } from "./shared/global";

export interface BvProject {
  id?: number;
  name: string;
  status?: STATUS;
  project_id: string;
}
