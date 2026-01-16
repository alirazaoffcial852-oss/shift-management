import { RATE_TYPE } from "../rate";

export type Route = {
  id?: number;
  route_id: string;
  name?: string; // Added this property
  rate: number;
  label?: string;
  rate_type: RATE_TYPE;
};
export interface RouteOption {
  value: string;
  label: string;
}
