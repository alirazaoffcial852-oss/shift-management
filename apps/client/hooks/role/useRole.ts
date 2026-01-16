// useRoleManager.ts
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Role, RoleFormData, RoleValidationErrors } from "@/types/role";
import { useAuth, useCompany } from "@/providers/appProvider";
import PermissionService from "@/services/permissions";
import RoleService from "@/services/role";
import CompanyService from "@/services/company";
import { validateRole } from "@/utils/validation/rolePermission";
import { Permissions } from "@/types/permissions";
import { Company } from "@/types/configuration";
import { usePermission } from "@/hooks/usePermission";

type ExtendedCompany = Company & { id: number };

type UseRoleManagerOptions = {
  actAs?: "EMPLOYEE" | "STAFF" | undefined;
  withSearch?: boolean;
  forDropdown?: boolean;
  initialLimit?: number;
};

export const useRoleManager = (options: UseRoleManagerOptions = {}) => {
  const {
    actAs,
    withSearch = false,
    forDropdown = false,
    initialLimit = 20,
  } = options;

  const { user } = useAuth();
  const { companies, setCompanies, company, setCompany } = useCompany();
  const { hasPermission } = usePermission();

  const [errors, setErrors] = useState<Record<number, RoleValidationErrors>>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [roles, setRoles] = useState<RoleFormData[]>([
    {
      name: "",
      short_name: "",
      permissions: [],
      act_as_Employee: false,
      companies: [],
      has_train_driver: false,
    },
  ]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: initialLimit,
    total: 0,
    total_pages: 0,
  });

  const [existingRoles, setExistingRoles] = useState<RoleFormData[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const formatPermissionName = (name: string): string => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const fetchPermissions = useCallback(async () => {
    try {
      const permissionsData = await PermissionService.getAllPermissions();
      setPermissions(
        permissionsData.data.map((p: Permissions) => ({
          ...p,
          originalName: p.name,
          name: formatPermissionName(p.name),
        }))
      );
    } catch (error) {
      console.error("Error fetching permissions:", error);
    }
  }, []);

  const fetchRoles = useCallback(
    async (page = 1, searchTerm = "") => {
      if (!user?.clientId || !company?.id || !hasPermission("settings.role")) {
        setExistingRoles([]);
        setPagination({
          page: 1,
          limit: pagination.limit,
          total: 0,
          total_pages: 0,
        });
        return;
      }

      setIsLoadingRoles(true);
      try {
        const clientId = Number(user.clientId);
        const response = await RoleService.getAllRoles(
          clientId,
          page,
          pagination.limit,
          Number(company.id),
          actAs,
          searchTerm
        );

        if (response?.data) {
          const rolesData = response.data?.data?.map((role: any) => ({
            ...role,
            has_train_driver: role.has_train_driver ?? false,
          }));

          if (page === 1) {
            setExistingRoles(rolesData);
          } else {
            setExistingRoles((prev) => [...prev, ...rolesData]);
          }

          if (response.data.pagination) {
            setPagination({
              page: response.data.pagination.page,
              limit: response.data.pagination.limit,
              total: response.data.pagination.total,
              total_pages: response.data.pagination.total_pages,
            });
          }
        }
      } catch (error: any) {
        console.error("Error fetching roles:", error);
        if (error?.response?.status === 403) {
          setExistingRoles([]);
          setPagination({
            page: 1,
            limit: pagination.limit,
            total: 0,
            total_pages: 0,
          });
        }
      } finally {
        setIsLoadingRoles(false);
      }
    },
    [
      user?.clientId,
      company?.id,
      pagination.limit,
      actAs,
      forDropdown,
      hasPermission,
    ]
  );

  useEffect(() => {
    const initializeData = async () => {
      await fetchPermissions();
      await fetchRoles(1, searchQuery);
    };

    if (user?.clientId) {
      initializeData();
    }
  }, [user?.clientId, company?.id]);

  const validateRoles = useCallback(() => {
    const newErrors: Record<number, RoleValidationErrors> = {};
    let isValid = true;

    roles.forEach((role, index) => {
      const roleErrors = validateRole(role);
      if (Object.keys(roleErrors).length > 0) {
        newErrors[index] = roleErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [roles]);

  const removeRole = useCallback(
    (roleId: number) => {
      setExistingRoles((prevRoles) =>
        prevRoles.filter((role) => role.id !== roleId)
      );

      if (company) {
        const updatedCompany: ExtendedCompany = {
          ...company,
          roles: company.roles.filter(
            (role: Role) => role.id?.toString() !== roleId.toString()
          ),
        };
        setCompany(updatedCompany);
        setCompanies(
          companies.map((c: ExtendedCompany) =>
            c.id === company.id ? updatedCompany : c
          )
        );
      }
    },
    [company]
  );

  const prepareRoleData = useCallback((roles: RoleFormData[]) => {
    return roles.map((role) => {
      const roleData: any = {
        name: role.name,
        permissions: role.permissions.map(Number),
        short_name: role.short_name,
        act_as: role.act_as_Employee ? "EMPLOYEE" : "STAFF",
        has_train_driver: role.has_train_driver ?? false,
      };
      if (role.id) {
        roleData.id = role.id;
      }
      return roleData;
    });
  }, []);

  const handleSubmit = async (id?: number) => {
    if (!validateRoles()) {
      return false;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (id) {
        const currentRole = roles[0];
        if (!currentRole) {
          throw new Error("No role data provided for update");
        }

        formData.append("short_name", currentRole.short_name);
        formData.append("name", currentRole.name);
        formData.append(
          "act_as",
          currentRole.act_as_Employee ? "EMPLOYEE" : "STAFF"
        );
        formData.append("permissions", JSON.stringify(currentRole.permissions));
        formData.append(
          "has_train_driver",
          String(currentRole.has_train_driver ?? false)
        );
        await CompanyService.updateRoles(id, formData);
        const companiesWithRole = companies.filter((company) =>
          company.roles.some((r) => r.id === id)
        );
        const companyIdsToUpdate = new Set([
          ...companiesWithRole.map((c) => c.id),
          ...currentRole.companies,
        ]);
        const companyUpdates = Array.from(companyIdsToUpdate).map((companyId) =>
          updateCompanyRoles(companyId, {
            ...currentRole,
            id,
            companies: currentRole.companies,
          })
        );
        await Promise.all(companyUpdates);
        await fetchRoles(1, searchQuery);
      } else {
        formData.append("roles", JSON.stringify(prepareRoleData(roles)));
        const roleResponse = await CompanyService.AddRoles(formData);
        const companyUpdates = roles.flatMap((role, index) =>
          role.companies.map((companyId) => {
            const roleId = roleResponse.data[index]?.id;
            return updateCompanyRoles(companyId, {
              ...role,
              id: roleId,
              companies: [companyId],
            });
          })
        );

        await Promise.all(companyUpdates);

        const newRolesWithDefaults = roleResponse.data.map((role: any) => ({
          ...role,
          has_train_driver: role.has_train_driver ?? false,
        }));
        setExistingRoles((prev) => [...prev, ...newRolesWithDefaults]);
      }

      resetForm();
      toast.success(
        id ? "Role updated successfully" : "Roles created successfully"
      );
      return true;
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error(id ? "Failed to update role" : "Failed to create roles");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyRoles = async (companyId: number, role: RoleFormData) => {
    const companyData = companies.find((c) => c.id === companyId);
    if (!companyData) return;

    try {
      const formData = new FormData();
      const configuration = {
        address: companyData.configuration?.address,
        phone: companyData.configuration?.phone,
        email: companyData.configuration?.email,
        has_locomotive: companyData.configuration?.has_locomotive,
      };

      const roleExistsInCompany = companyData.roles.some(
        (existingRole: Role) => existingRole.id === role.id
      );

      if (!role.companies.includes(companyId) && roleExistsInCompany) {
        const updatedRoles = companyData.roles.filter(
          (existingRole: Role) => existingRole.id !== role.id
        );

        formData.append("roles", JSON.stringify(updatedRoles.map((r) => r.id)));
      } else if (role.companies.includes(companyId) && !roleExistsInCompany) {
        const updatedRoles = [...companyData.roles, role] as Role[];
        formData.append("roles", JSON.stringify(updatedRoles.map((r) => r.id)));
      } else {
        return;
      }

      formData.append("name", companyData.name as string);
      formData.append("configuration", JSON.stringify(configuration));
      if (companyData.configuration?.logo) {
        formData.append("logo", companyData.configuration.logo as File);
      }
      await CompanyService.UpdateCompany(companyId, formData);
      const updatedCompanies = companies.map((c) => {
        if (c.id === companyId) {
          const updatedRoles = role.companies.includes(companyId)
            ? [
                ...c.roles,
                { ...role, has_train_driver: role.has_train_driver ?? false },
              ]
            : c.roles.filter((r: Role) => r.id !== role.id);
          return { ...c, roles: updatedRoles };
        }
        return c;
      }) as ExtendedCompany[];

      const foundCompany = updatedCompanies?.find(
        (c) => c.id.toString() === companyId.toString()
      );
      const currentSelectedCompany =
        companyData?.id?.toString() === companyId.toString()
          ? foundCompany
          : company;

      if (foundCompany) {
        if (company && currentSelectedCompany) {
          setCompany(foundCompany);
        }
      }
      console.log("Updated company roles:", updatedCompanies);
      setCompanies(updatedCompanies);
    } catch (error) {
      console.error(`Failed to update company ${companyId}:`, error);
      throw error;
    }
  };

  const resetForm = () => {
    setRoles([
      {
        name: "",
        short_name: "",
        permissions: [],
        act_as_Employee: false,
        companies: [],
        has_train_driver: false,
      },
    ]);
    setErrors({});
  };

  const handleLoadMore = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      fetchRoles(pagination.page + 1, searchQuery);
    }
  }, [fetchRoles, pagination, searchQuery]);

  const handleSearch = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchRoles(1, searchTerm);
    },
    [fetchRoles]
  );

  return {
    roles,
    setRoles,
    permissions,
    loading,
    roleErrors: errors,
    existingRoles,
    handlerAddRoles: handleSubmit,
    removeRole,
    validateRoles,
    pagination,
    handleLoadMore,
    isLoadingRoles,
    searchQuery,
    handleSearch,
    companies,
    resetForm,
    fetchRoles: (page = 1, search = "") => fetchRoles(page, search),
  };
};
