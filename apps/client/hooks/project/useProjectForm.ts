import { useCallback, useEffect, useState } from "react";
import { Project } from "@/types/project";
import { validateProjectField, validateProjectForm } from "@/utils/validation/project";
import { Customer } from "@/types/customer";
import CustomerService from "@/services/customer";
import ProjectService from "@/services/project";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const INITIAL_FORM_STATE: Project = {
  name: "",
  customer_id: "",
};

export const useProjectForm = (id?: number, onclose?: () => void) => {
  const { company } = useCompany();
  const router = useRouter();

  const [project, setProject] = useState<Project>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setpagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = useCallback(
    async (page = 1, searchTerm = "") => {
      try {
        if (!company?.id) {
          return;
        }

        setIsLoadingCustomers(true);

        const response = await CustomerService.getAllCustomers(page, pagination.limit, company.id as number, "ACTIVE", searchTerm);

        if (response?.data) {
          const newCustomers = response.data?.data;

          if (page === 1) {
            setCustomers(newCustomers);
          } else {
            setCustomers((prev) => [...prev, ...newCustomers]);
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
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoadingCustomers(false);
      }
    },
    [company, pagination.limit]
  );

  useEffect(() => {
    if (company?.id) {
      fetchCustomers(1, "");
    }
  }, [company, fetchCustomers]);

  const handleLoadMoreCustomers = useCallback(
    (searchTerm = "") => {
      if (pagination.page < pagination.total_pages) {
        fetchCustomers(pagination.page + 1, searchTerm);
      }
    },
    [fetchCustomers, pagination]
  );

  const handleSearchCustomers = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);

      setpagination((prev) => ({
        ...prev,
        page: 1,
      }));

      fetchCustomers(1, searchTerm);
    },
    [fetchCustomers]
  );

  const fetchProjectData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await ProjectService.getProjectById(id);
      const projectData = response.data;
      setProject({
        name: projectData.name,
        customer_id: projectData.customer_id,
      });
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to fetch project data");
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const clearError = (field: keyof Project) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleInputChange = (field: keyof Project, value: string): void => {
    setProject((prev) => ({ ...prev, [field]: value }));

    const validation = validateProjectField(field, value);

    if (!validation.isValid && validation.error) {
      setErrors((prev) => ({ ...prev, [field]: validation.error! }));
    } else {
      clearError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateProjectForm(project);
    if (!validation.isValid) {
      return setErrors(validation.errors);
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", project.name);
      formData.append("customer_id", project.customer_id);
      if (!id) {
        formData.append("company_id", company?.id?.toString() ?? "");
      }

      const response = await (id ? ProjectService.updateProject(id, formData) : ProjectService.createProject(formData));
      toast.success(response?.message || "Operation successful");
      if (onclose) {
        onclose();
      } else {
        router.push("/projects");
      }
      return true;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    project,
    errors,
    handleInputChange,
    handleSubmit,
    customers,
    loading,
    pagination,
    isLoadingCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
    searchQuery,
    fetchCustomers: () => fetchCustomers(1, ""),
  };
};
