// useStaffForm.ts
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Staff } from "@/types/staff";
import { toast } from "sonner";
import StaffService from "@/services/staff";
import RoleService from "@/services/role";
import { validateStaff } from "@/utils/validation/staff";
import { initialStaff } from "@/constants/staff.constants";
import { useAuth, useCompany } from "@/providers/appProvider";
import { Role } from "@/types/role";
import { useTranslations } from "next-intl";

export const useStaffForm = (id?: number) => {
  const router = useRouter();
  const { company } = useCompany();
  const { user } = useAuth();
  const t = useTranslations("common");
  const [staff, setStaff] = useState<Staff>(initialStaff);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleStaffUpdate = useCallback(
    (updatedStaff: Staff) => {
      setStaff(updatedStaff);

      if (updatedStaff.address) {
        clearError("address");
      }
      if (updatedStaff.country) {
        clearError("country");
      }
      if (updatedStaff.city) {
        clearError("city");
      }
      if (updatedStaff.postal_code) {
        clearError("postal_code");
      }
    },
    [clearError]
  );
  const [roles, setRoles] = useState<Role[]>([]);
  const [pagination, setpagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const fetchRoles = useCallback(
    async (page = 1, searchTerm = "") => {
      try {
        if (!user?.clientId || !company?.id) {
          return;
        }

        setIsLoadingRoles(true);

        const response = await RoleService.getAllRoles(
          Number(user.clientId),
          page,
          pagination.limit,
          Number(company.id),
          "STAFF",
          searchTerm
        );

        if (response?.data) {
          const newRoles = response.data?.data?.map((role: any) => ({
            id: role.id,
            name: role.name,
          }));

          if (page === 1) {
            setRoles(newRoles);
          } else {
            setRoles((prev) => [...prev, ...newRoles]);
          }

          if (response.data.pagination) {
            setpagination({
              page: response.data.pagination.page,
              limit: response.data.pagination.limit,
              total: response.data.pagination.total,
              total_pages: response.data.pagination.total_pages,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching Roles:", error);
      } finally {
        setIsLoadingRoles(false);
      }
    },
    [company, pagination.limit, user?.clientId]
  );

  useEffect(() => {
    if (company?.id) {
      fetchRoles(1, "");
    }
  }, [company, fetchRoles]);

  const handleLoadMoreRoles = useCallback(
    (searchTerm = "") => {
      if (pagination.page < pagination.total_pages) {
        fetchRoles(pagination.page + 1, searchTerm);
      }
    },
    [fetchRoles, pagination]
  );

  const handleSearchRoles = useCallback(
    (searchTerm: string) => {
      setpagination((prev) => ({
        ...prev,
        page: 1,
      }));

      fetchRoles(1, searchTerm);
    },
    [fetchRoles]
  );

  const fetchStaffData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await StaffService.getStaffById(id);
      const staffData: Staff = {
        user: {
          name: response.data.name,
          email: response.data.email,
        },
        ...response.data,
      };

      setStaff(staffData);
    } catch (error) {
      console.error("Error fetching Staff:", error);
      toast.error(t("an_error_occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStaffData();
  }, [fetchStaffData]);

  const handleSubmit = async () => {
    const newErrors = validateStaff(staff);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("name", staff.user.name);
        formData.append("role_id", staff.role_id?.toString() || "");
        formData.append("email", staff.user.email);
        formData.append("phone", staff.phone);
        formData.append(
          "date_of_birth",
          staff.date_of_birth ? new Date(staff.date_of_birth).toISOString() : ""
        );
        formData.append(
          "hiring_date",
          staff.hiring_date ? new Date(staff.hiring_date).toISOString() : ""
        );
        formData.append("gender", staff.gender.toString());
        formData.append("address", staff.address);
        formData.append("country", staff.country?.toString() || "");
        formData.append("city", staff.city?.toString() || "");
        formData.append("postal_code", staff.postal_code);
        formData.append("company_id", company?.id?.toString() || "");

        const response = await (id
          ? StaffService.updatestaff(id, formData)
          : StaffService.Addstaff(formData));
        toast.success(response?.message || t("operation_successful"));
        router.push("/staff");
      } catch (error: any) {
        const errorMessage = error?.data?.message || t("an_error_occurred");
        toast.error(errorMessage);

        if (error?.data?.type === "VALIDATION_ERROR" && error?.data?.errors) {
          const apiErrors = error.data.errors;
          setErrors((prev) => ({
            ...prev,
            ...Object.fromEntries(
              Object.entries(apiErrors).map(([field, messages]) => [
                field,
                Array.isArray(messages) ? messages[0] : messages,
              ])
            ),
          }));
        }

        console.error("Error submitting form:", error);
        return false;
      } finally {
        setLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return {
    staff,
    setStaff: handleStaffUpdate,
    errors,
    company,
    loading,
    handleSubmit,
    isLoadingRoles,
    roles,
    handleLoadMoreRoles,
    pagination,
    handleSearchRoles,
    clearError,
  };
};
