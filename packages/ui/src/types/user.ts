export type USER_STATUS =
  | "CAN_LOGIN"
  | "CAN_NOT_LOGIN"
  | "SUSPEND_DUE_TO_PAYMENT";

export type Role =
  | "ADMIN"
  | "ADMIN_STAFF"
  | "CLIENT"
  | "CLIENT_STAFF"
  | "CLIENT_EMPLOYEE";

export interface User {
  id?: number;
  name: string;
  email: string;
  image?: File | string | null;
  clientId?: string;
  status?: USER_STATUS;
  role?: {
    id: number;
    name: string;
  };
  employeeRole?: {
    name: string;
    act_as: string;
    has_train_driver: boolean;
  };
}
