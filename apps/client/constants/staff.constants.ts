import { GENDER } from "@/types/shared/gender";
import { Staff } from "@/types/staff";

export const initialStaff: Staff = {
  user: {
    name: "",
    email: "",
  },
  name: "",
  phone: "",
  date_of_birth: "",
  gender: "MALE" as unknown as GENDER,
  hiring_date: new Date(),
  address: "",
  country: null,
  city: null,
  postal_code: "",
  role_id: "",
  company_id: "",
};
