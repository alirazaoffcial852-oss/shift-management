"use client";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type { Company } from "@/types/configuration";
import CompanyService from "@/services/company";
import RoleService from "@/services/role";
import { Role } from "@/types/role";
import { useAuth, useCompany } from "@/providers/appProvider";

export const useCompanyForm = () => {
  const { companies, setCompanies, company } = useCompany();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchAllClientRoles = useCallback(async () => {
    try {
      if (!user || !user.clientId || !company?.id) return;
      const { data } = await RoleService.getAllRoles(
        Number(user.clientId),
        1,
        100,
        Number(company.id)
      );
      setRoles(
        data?.data?.map((role: any) => ({
          id: role.id,
          name: role.name,
        }))
      );
    } catch (error: any) {
      console.error("Error fetching roles:", error);
      if (error?.response?.status === 403) {
        setRoles([]);
      }
    }
  }, [user, company?.id]);

  useEffect(() => {
    fetchAllClientRoles();
  }, [fetchAllClientRoles]);

  const handleAddCompany = async (companyData: Partial<Company>) => {
    try {
      const formData = new FormData();
      const configuration = {
        address: companyData.configuration?.address,
        phone: companyData.configuration?.phone,
        email: companyData.configuration?.email,
        has_locomotive: companyData.configuration?.has_locomotive,
      };
      let data = [
        {
          name: companyData.name as string,
          roles: companyData.roles?.map((role: Role) => role.id),
          configuration: configuration,
        },
      ];

      formData.append("companies", JSON.stringify(data));
      if (companyData.configuration?.logo) {
        formData.append("logo", companyData.configuration.logo as File);
      }
      setLoading(true);
      const response = await CompanyService.AddCompany(formData);

      setCompanies([...companies, ...response.data]);
      toast.success(response.message || "Company added successfully");
    } catch (error) {
      toast.error("Failed to add company");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCompany = async (
    id: number,
    companyData: Partial<Company>
  ) => {
    try {
      const formData = new FormData();
      const configuration = {
        address: companyData.configuration?.address,
        phone: companyData.configuration?.phone,
        email: companyData.configuration?.email,
        has_locomotive: companyData.configuration?.has_locomotive,
      };

      const roles = companyData.roles?.map((role: Role) => role.id);

      formData.append("roles", JSON.stringify(roles));
      formData.append("name", companyData.name as string);
      formData.append("configuration", JSON.stringify(configuration));
      if (companyData.configuration?.logo) {
        formData.append("logo", companyData.configuration.logo as File);
      }

      setLoading(true);
      const response = await CompanyService.UpdateCompany(id, formData);
      setCompanies(
        companies.map((company) =>
          company.id === id
            ? {
                ...response.data,
                roles: response.data?.roles?.map((data: any) => {
                  console.log(data, "data in company roles");
                  return {
                    id: data?.id,
                    act_as: data?.act_as,
                    company_id: data?.company_id,
                    company_role_id: data?.company_role_id,
                    name: data?.name,
                    short_name: data?.short_name,
                  };
                }),
              }
            : company
        )
      );

      toast.success(response.message || "Company updated successfully");
    } catch (error) {
      toast.error("Failed to update company");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCompany = async (id: number) => {
    try {
      setLoading(true);
      await CompanyService.DeleteCompany(id);
      setCompanies(companies.filter((company) => company.id !== id));
      toast.success("Company deleted successfully");
    } catch (error) {
      toast.error("Failed to delete company");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    companies,
    roles,
    loading,
    handleAddCompany,
    handleUpdateCompany,
    handleDeleteCompany,
  };
};
