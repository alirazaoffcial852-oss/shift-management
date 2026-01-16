import { GENDER } from "@/types/shared/gender";
import { Location } from "@workspace/ui/types/country";
import { User } from "@workspace/ui/types/user";

export type Staff = {
  id?: number;
  name: string;
  user: User;
  phone: string;
  date_of_birth: string;
  hiring_date: Date;
  gender: GENDER;
  location?: Location;
  status?: "ARCHIVED" | "ACTIVE";
  address: string;
  country: number | null;
  city: number | null;
  postal_code: string;
  role_id: string;
  company_id: string;
};
