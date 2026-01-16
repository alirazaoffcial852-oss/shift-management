"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  FormState,
  RoleConfiguration,
  Company,
} from "@/types/configuration";
import type { Permissions } from "@/types/permissions";
import CompanyService from "@/services/company";
import RoleService from "@/services/role";
import PermissionService from "@/services/permissions";
import {
  validateCompanies,
  validateRolesAndPermissions,
} from "@/utils/validation/config";
import { Role } from "@/types/role";
import { useRouter } from "next/navigation";
import { INITIAL_FORM_STATE } from "@/constants/configuration.constants";
import { useAuth, useCompany } from "@/providers/appProvider";

type Errors = Record<string, string>;

export const useConfigurationForm = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { company } = useCompany();
  const [totalCount, setTotalCount] = useState(0);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [permissions, setPermissions] = useState<Permissions[]>([]);
  const [roles, setRoles] = useState([
    { name: "", permissions: [], short_name: "", act_as_Employee: false },
  ]);
  const limit = 20;
  const format = (str: string) => {
    return str
      .replace(/\./g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const fetchPermissions = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await PermissionService.getAllPermissions();

      data.forEach((permission: any) => {
        permission.originalName = permission.name;
        permission.name = format(permission.name);
      });

      setPermissions(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching permissions";
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllClientRoles = useCallback(async () => {
    try {
      setLoading(true);
      if (!user || !company?.id) {
        toast.error("User information not available");
        return;
      }
      const response = await RoleService.getAllRoles(
        Number(user.clientId),
        currentPage,
        limit,
        Number(company.id)
      );
      if (response?.data?.data.length === 0) {
        return;
      }
      let roles = response?.data?.data?.map((roleConfig: any) => ({
        id: roleConfig.id,
        name: roleConfig.name,
        permissions: roleConfig.rolePermissions.map(
          (permission: Permissions) => permission.id?.toString() ?? ""
        ),
        short_name: roleConfig.short_name,
        act_as_Employee: roleConfig.act_as === "STAFF" ? false : true,
      }));

      const reversedRoles = [...roles].reverse();

      setFormState((prev) => ({ ...prev, rolesAndPermissions: reversedRoles }));
      setTotalCount(response.data.pagination.total || 0);
      setTotalPages(
        Math.ceil((response.data.pagination.total_pages || 0) / limit)
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error fetching roles";
      toast.error(errorMessage);
      console.error("Error fetching permissions:", error);
    } finally {
      setLoading(false);
    }
  }, [user, company?.id, currentPage]);

  useEffect(() => {
    if (formState.currentStep === 0) {
      fetchPermissions();
    }
    fetchAllClientRoles();
  }, [formState.currentStep]);

  const updateFormState = useCallback(
    <T extends keyof FormState>(field: T, value: FormState[T]) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const updateRolesAndPermissions = useCallback(
    (roles: RoleConfiguration[]) => {
      updateFormState("rolesAndPermissions", roles);
    },
    [updateFormState]
  );

  const updateCompanies = useCallback(
    (companies: Company[]) => {
      updateFormState("companies", companies);
    },
    [updateFormState]
  );

  const prepareRoleData = useCallback((roles: RoleConfiguration[]) => {
    return roles.map((role) => {
      const roleData: any = {
        name: role.name,
        permissions: role.permissions.map(Number),
        short_name: role.short_name,
        act_as: role.act_as_Employee ? "EMPLOYEE" : "STAFF",
      };
      if (role.id) {
        roleData.id = role.id;
      }
      return roleData;
    });
  }, []);

  const handleRole = useCallback(async () => {
    const newErrors = validateRolesAndPermissions(
      formState.rolesAndPermissions
    );

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      const rolesData = prepareRoleData(formState.rolesAndPermissions);
      formData.append("roles", JSON.stringify(rolesData));
      const response = await CompanyService.AddRoles(formData);
      setRoles(response.data);
      updateFormState("currentStep", formState.currentStep + 1);
      setErrors({});
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Error adding roles";
      toast.error(errorMessage);
      console.error("Error submitting roles:", error);
    } finally {
      setLoading(false);
    }
  }, [
    formState.rolesAndPermissions,
    formState.currentStep,
    prepareRoleData,
    updateFormState,
  ]);

  const handleAddCompanies = useCallback(async () => {
    const newErrors = validateCompanies(formState.companies);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      const companiesData = formState.companies.map((company) => ({
        configuration: {
          address: company.configuration.address,
          phone: company.configuration.phone,
          email: company.configuration.email,
          has_locomotive: company.configuration.has_locomotive,
        },
        name: company.name,
        roles: company.roles.map((role: Role) => Number(role.id)),
      }));

      formData.append("companies", JSON.stringify(companiesData));

      formState.companies.forEach((company) => {
        if (company.logo instanceof File) {
          formData.append("logo", company.logo);
        }
      });

      const response = await CompanyService.AddCompany(formData);

      toast.success(response?.message);

      router.push("/dashboard");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting companies:", error);
    } finally {
      setLoading(false);
    }
  }, [formState.companies]);

  const handleBack = useCallback(() => {
    updateFormState("currentStep", formState.currentStep - 1);
    setErrors({});
  }, [formState.currentStep, updateFormState]);

  return {
    formState,
    errors,
    loading,
    permissions,
    roles,
    updateRolesAndPermissions,
    updateCompanies,
    handleRole,
    handleBack,
    handleAddCompanies,
  };
};
