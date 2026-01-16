import { Staff } from "@/types/staff";

export const validateStaff = (staff: Staff) => {
  const newErrors: { [key: string]: string } = {};

  if (!staff.user.name) {
    newErrors.name = "Employee name is required";
  }
  if (!staff.role_id) {
    newErrors.role_id = "Role is required";
  }

  if (!staff.user.email) {
    newErrors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(staff.user.email)) {
    newErrors.email = "Invalid email format";
  }
  if (!staff.phone) {
    newErrors.phone = "Phone number is required";
  }

  if (!staff.date_of_birth) {
    newErrors.date_of_birth = "Date of birth is required";
  } else {
    const birthDate = new Date(staff.date_of_birth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      newErrors.date_of_birth = "Staff must be at least 18 years old";
    }
  }
  if (!staff.hiring_date) {
    newErrors.hiring_date = "Hiring date is required";
  }
  if (!staff.gender) {
    newErrors.gender = "Gender is required";
  }
  if (!staff.address) {
    newErrors.address = "Address is required";
  }
  if (!staff.city) {
    newErrors.city = "City is required";
  }
  if (!staff.country) {
    newErrors.country = "country is required";
  }
  if (!staff.postal_code) {
    newErrors.postal_code = "Postal code is required";
  }

  return newErrors;
};
