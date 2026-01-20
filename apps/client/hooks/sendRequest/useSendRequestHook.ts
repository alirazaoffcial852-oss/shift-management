import { Company } from "@/types/configuration";
import {
  SendRequest,
  SendRequestErrors,
  SendRequestFormData,
  SendRequestData,
  ReceiveRequestFilters,
} from "@/types/request";
import { Pagination } from "@/types/pagination";
import { useState, useEffect } from "react";
import CompanyService from "@/services/company";
import RequestService from "@/services/request";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";

export const useSendRequestForm = (
  id?: number,
  onClose?: (request: SendRequest) => void
) => {
  const { company } = useCompany();
  const [formData, setFormData] = useState<SendRequestFormData>({
    requester_company_id: company?.id || null,
    target_company_id: null,
    no_of_employee: "",
    note: "",
  });

  const [sendRequests, setSendRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    total_pages: 1,
    limit: 20,
    total: 0,
  });

  const [errors, setErrors] = useState<SendRequestErrors>({});
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<number | null>(null);

  const [filters, setFilters] = useState<ReceiveRequestFilters>({
    status: "",
    search: "",
  });

  const [companiesPagination, setCompaniesPagination] = useState<Pagination>({
    page: 1,
    total_pages: 1,
    limit: 10,
    total: 0,
  });

  useEffect(() => {
    loadCompanies();
  }, [id]);

  useEffect(() => {
    if (id && sendRequests.length > 0) {
      const requestToEdit = sendRequests.find((request) => request.id === id);
      if (requestToEdit) {
        setFormData({
          requester_company_id: requestToEdit.requester_company_id,
          target_company_id: requestToEdit.target_company_id,
          no_of_employee: requestToEdit.no_of_employee.toString(),
          note: requestToEdit.note || "",
        });
        setIsEditMode(true);
        setEditingRequestId(id);
      }
    }
  }, [id, sendRequests]);

  useEffect(() => {
    if (company?.id && !isEditMode) {
      setFormData((prev) => ({
        ...prev,
        requester_company_id: company.id,
      }));
    }
  }, [company, isEditMode]);

  useEffect(() => {
    if (company?.id) {
      loadSendRequests(company.id, pagination.page, pagination.limit);
    }
  }, [company?.id, filters.status]);

  const loadCompanies = async () => {
    setIsLoadingCompanies(true);
    try {
      const response = await CompanyService.getAllCompanies();
      const data = response.data;
      setCompanies(data);
    } catch (error) {
      console.error("Failed to fetch companies:", error);
    } finally {
      setIsLoadingCompanies(false);
    }
  };

  const handleInputChange = (
    field: keyof SendRequestFormData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]:
        field === "requester_company_id" || field === "target_company_id"
          ? Number(value)
          : value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: SendRequestErrors = {};

    if (!formData.requester_company_id) {
      newErrors.requester_company_id = "Requester company is required";
    }

    if (!formData.target_company_id) {
      newErrors.target_company_id = "Target company is required";
    }

    if (!formData.no_of_employee.trim()) {
      newErrors.no_of_employee = "Number of employees is required";
    } else if (!/^\d+$/.test(formData.no_of_employee)) {
      newErrors.no_of_employee = "Number of employees must be a valid number";
    } else if (parseInt(formData.no_of_employee) <= 0) {
      newErrors.no_of_employee = "Number of employees must be greater than 0";
    }

    if (!formData.note) {
      newErrors.note = "Please Enter Note";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const requestData: SendRequestData = {
        requester_company_id: formData.requester_company_id!,
        target_company_id: formData.target_company_id!,
        no_of_employee: parseInt(formData.no_of_employee),
        note: formData.note,
      };

      let response;
      if (isEditMode && editingRequestId) {
        response = await RequestService.updateRequest({
          ...requestData,
          id: editingRequestId,
        } as any);
        toast.success("Request updated successfully");
      } else {
        response = await RequestService.sendRequest(requestData);
        toast.success(response.message);
      }

      if (response.data) {
        onClose?.(response.data);
        resetForm();
      }
    } catch (error: any) {
      console.error("Error submitting form:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          target_company_id: `Failed to ${isEditMode ? "update" : "send"} request. Please try again.`,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      requester_company_id: company?.id || null,
      target_company_id: null,
      no_of_employee: "",
      note: "",
    });
    setIsEditMode(false);
    setEditingRequestId(null);
    setErrors({});
  };

  const loadSendRequests = async (
    companyId: number | undefined,
    page: number = 1,
    limit: number = 20
  ) => {
    if (!companyId) {
      console.error("Company ID is required to load send requests");
      return;
    }

    setLoading(true);
    try {
      const response = await RequestService.getSendRequests(
        companyId,
        page,
        limit,
        filters.status
      );
      setSendRequests(response.data.data || []);
      setPagination({
        page: response.data.pagination?.page || page,
        total_pages: response.data.pagination?.total_pages || 1,
        limit: response.data.pagination?.limit || limit,
        total: response.data.pagination?.total || 0,
      });
    } catch (error) {
      console.error("Failed to fetch send requests:", error);
      setSendRequests([]);
      setPagination({
        page: 1,
        total_pages: 1,
        limit: 20,
        total: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteRequest = async (requestId: number) => {
    try {
      setLoading(true);
      await RequestService.deleteRequest(requestId);
      if (company?.id) {
        await loadSendRequests(company.id, pagination.page, pagination.limit);
      }
      return true;
    } catch (error) {
      console.error("Failed to delete request:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const initializeEditMode = (requestId: number) => {
    const requestToEdit = sendRequests.find(
      (request) => request.id === requestId
    );
    if (requestToEdit) {
      setFormData({
        requester_company_id: requestToEdit.requester_company_id,
        target_company_id: requestToEdit.target_company_id,
        no_of_employee: requestToEdit.no_of_employee.toString(),
        note: requestToEdit.note || "",
      });
      setIsEditMode(true);
      setEditingRequestId(requestId);
    }
  };

  const handleStatusFilter = (status: ReceiveRequestFilters["status"]) => {
    setFilters((prev) => ({ ...prev, status }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    formData,
    errors,
    handleInputChange,
    handleSubmit,
    companies: companies?.filter((data) => data.id !== company?.id) || [],
    loading,
    isLoadingCompanies,
    companiesPagination,
    sendRequests,
    pagination,
    loadSendRequests,
    deleteRequest,
    isEditMode,
    editingRequestId,
    initializeEditMode,
    resetForm,
    handleStatusFilter,
    filters,
  };
};
