import {
  ReceiveRequestData,
  ReceiveRequestErrors,
  ReceiveRequestFilters,
  ReceiveRequestFormData,
  SendRequest,
} from "@/types/request";
import { useState, useEffect, useCallback } from "react";
import { useAuth, useCompany } from "@/providers/appProvider";
import EmployeeService from "@/services/employee";
import { Employee } from "@/types/employee";
import RoleService from "@/services/role";
import RequestService from "@/services/request";

interface Pagination {
  page: number;
  total_pages: number;
  per_page: number;
  total: number;
}

export const useReceiveRequestForm = (
  id?: number,
  onClose?: (request: SendRequest) => void,
  roleId?: number
) => {
  const { company } = useCompany();
  const { user } = useAuth();

  const [receiveRequest, setReceiveRequest] = useState<ReceiveRequestData[]>(
    []
  );
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const [filters, setFilters] = useState<ReceiveRequestFilters>({
    status: "",
    search: "",
  });

  const [formData, setFormData] = useState<ReceiveRequestFormData>({
    role_id: 0,
    customer_id: 0,
    project_id: 0,
    product_id: 0,
    bv_project_id: 0,
    shiftRole: [],
    employee_id: "",
  });

  const [errors, setErrors] = useState<ReceiveRequestErrors>({
    customer_id: "",
    project_id: "",
    product_id: "",
    bv_project_id: "",
    employee_id: "",
  });

  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [requestDetails, setRequestDetails] = useState<SendRequest | null>(
    null
  );
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(false);
  const [isLoadingRoles, setIsLoadingRoles] = useState(false);

  const [employeePagination, setEmployeePagination] = useState<Pagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const [rolesPagination, setRolesPagination] = useState<Pagination>({
    page: 1,
    total_pages: 1,
    per_page: 20,
    total: 0,
  });

  const fetchEmployees = useCallback(
    async (page = 1, searchTerm = "") => {
      if (!company?.id) {
        return;
      }

      setIsLoadingEmployees(true);
      try {
        const response = await EmployeeService.getAllEmployees(
          page,
          20,
          company.id,
          "ACTIVE",
          roleId ? String(roleId) : undefined,
          searchTerm
        );

        if (response?.data) {
          const newEmployees = response.data.data;
          setEmployees((prev) =>
            page === 1 ? newEmployees : [...prev, ...newEmployees]
          );
          if (response.data.pagination) {
            setEmployeePagination(response.data.pagination);
          }
        }
      } catch (error) {
        console.error("Error fetching employees:", error);
      } finally {
        setIsLoadingEmployees(false);
      }
    },
    [company?.id, roleId, employeePagination.per_page]
  );

  const fetchRoles = useCallback(
    async (page = 1, searchTerm = "") => {
      if (!user?.clientId || !company?.id) return;

      setIsLoadingRoles(true);
      try {
        const response = await RoleService.getAllRoles(
          Number(user.clientId),
          page,
          rolesPagination.per_page,
          Number(company.id),
          undefined,
          searchTerm
        );

        if (response?.data) {
          const rolesData = response.data?.data;

          if (page === 1) {
            setRoles(rolesData);
          } else {
            setRoles((prev) => [...prev, ...rolesData]);
          }

          if (response.data.pagination) {
            setRolesPagination({
              page: response.data.pagination.page,
              per_page: response.data.pagination.limit,
              total: response.data.pagination.total,
              total_pages: response.data.pagination.total_pages,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching roles:", error);
      } finally {
        setIsLoadingRoles(false);
      }
    },
    [user?.clientId, company?.id, rolesPagination.per_page]
  );

  useEffect(() => {
    if (company?.id) {
      fetchEmployees(1, "");
    }
  }, [company?.id, roleId]);

  useEffect(() => {
    if (user?.clientId) {
      fetchRoles(1, "");
    }
  }, [user?.clientId]);

  const handleInputChange = (
    field: keyof ReceiveRequestFormData,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof ReceiveRequestErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field as keyof ReceiveRequestErrors]: undefined,
      }));
    }
  };

  const handleApprove = async () => {
    setLoading(true);
  };

  const handleReject = async () => {
    setLoading(true);
  };

  const loadRecevieRequests = useCallback(async () => {
    if (!company?.id) return;

    setLoading(true);
    try {
      const response = await RequestService.getReceivedRequests(
        company.id,
        pagination.page,
        pagination.per_page,
        filters.status || undefined
      );
      setReceiveRequest(response.data.data || []);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Failed to fetch received requests:", error);
      setReceiveRequest([]);
    } finally {
      setLoading(false);
    }
  }, [company?.id, pagination.page, pagination.per_page, filters.status]);

  const handleSearch = (searchTerm: string) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleStatusFilter = (status: ReceiveRequestFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const filteredRequests = receiveRequest.filter((request) => {
    const matchesSearch =
      !filters.search ||
      request.requester_company.name
        .toLowerCase()
        .includes(filters.search.toLowerCase()) ||
      request.note?.toLowerCase().includes(filters.search.toLowerCase());

    return matchesSearch;
  });

  useEffect(() => {
    loadRecevieRequests();
  }, [loadRecevieRequests]);

  return {
    handleSearch,
    handleStatusFilter,
    handlePageChange,
    filteredRequests,
    formData,
    errors,
    requestDetails,
    handleInputChange,
    handleApprove,
    handleReject,
    employees,
    roles,
    loading,
    isLoadingEmployees,
    isLoadingRoles,
    employeePagination,
    rolesPagination,
    fetchEmployees,
    fetchRoles,
    receiveRequest,
    pagination,
    loadRecevieRequests,
  };
};
