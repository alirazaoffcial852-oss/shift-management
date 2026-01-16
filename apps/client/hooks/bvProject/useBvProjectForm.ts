import { useCallback, useEffect, useState } from "react";
import { validateBvProjectField, validateBvProjectForm } from "@/utils/validation/bvProject";
import ProjectService from "@/services/project";

import BvProjectService from "@/services/bvProject";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { BvProject } from "@/types/bvProject";
import { Project } from "@/types/project";

const INITIAL_FORM_STATE: BvProject = {
  name: "",
  project_id: "",
};

export const useBvProjectForm = (id?: number, onclose?: () => void) => {
  const { company } = useCompany();
  const router = useRouter();

  const [bvProject, setBvProject] = useState<BvProject>(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [pagination, setpagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProject = useCallback(
    async (page = 1, searchTerm = "") => {
      try {
        if (!company?.id) {
          return;
        }

        setIsLoadingProjects(true);

        const response = await ProjectService.getAllProjects(page, pagination.limit, company.id as number, "ACTIVE", searchTerm);

        if (response?.data) {
          const newProjects = response.data?.data?.map((project: any) => ({
            id: project.id,
            name: project.name,
          }));

          if (page === 1) {
            setProjects(newProjects);
          } else {
            setProjects((prev) => [...prev, ...newProjects]);
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
        setIsLoadingProjects(false);
      }
    },
    [company, pagination.limit]
  );

  useEffect(() => {
    if (company?.id) {
      fetchProject(1, "");
    }
  }, [company, fetchProject]);

  const handleLoadMoreProjects = useCallback(
    (searchTerm = "") => {
      if (pagination.page < pagination.total_pages) {
        fetchProject(pagination.page + 1, searchTerm);
      }
    },
    [fetchProject, pagination]
  );

  const handleSearchProjects = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);

      setpagination((prev) => ({
        ...prev,
        page: 1,
      }));

      fetchProject(1, searchTerm);
    },
    [fetchProject]
  );

  const fetchProjectData = useCallback(async () => {
    if (!id) return;
    try {
      const response = await BvProjectService.getBvProjectById(id);
      const bvProjectData = response.data;
      setBvProject({
        name: bvProjectData.name,
        project_id: bvProjectData.project_id,
      });
    } catch (error) {
      console.error("Error fetching bvProject:", error);
      toast.error("Failed to fetch bvProject data");
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, []);

  const clearError = (field: keyof BvProject) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleInputChange = (field: keyof BvProject, value: string): void => {
    setBvProject((prev) => ({ ...prev, [field]: value }));

    const validation = validateBvProjectField(field, value);

    if (!validation.isValid && validation.error) {
      setErrors((prev) => ({ ...prev, [field]: validation.error! }));
    } else {
      clearError(field);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateBvProjectForm(bvProject);
    if (!validation.isValid) {
      return setErrors(validation.errors);
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", bvProject.name);
      formData.append("project_id", bvProject.project_id);
      if (!id) {
        formData.append("company_id", company?.id?.toString() ?? "");
      }

      const response = await (id ? BvProjectService.updateBvProject(id, formData) : BvProjectService.createBvProject(formData));

      toast.success(response?.message || "Operation successful");
      if (onclose) {
        onclose();
      } else {
        router.push("/bv-projects");
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
    bvProject,
    errors,
    handleInputChange,
    handleSubmit,
    projects,
    loading,
    handleSearchProjects,
    handleLoadMoreProjects,
    isLoadingProjects,
    pagination,
    fetchProject: () => fetchProject(1, ""),
  };
};
