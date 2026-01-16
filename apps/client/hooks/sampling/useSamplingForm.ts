import { useCallback, useEffect, useState } from "react";
import ProjectService from "@/services/project";
import LocomotiveService from "@/services/locomotive";
import SamplingService from "@/services/sampling";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Project } from "@/types/project";
import { Sampling } from "@/types/Sampling";
import { Locomotive } from "@/types/locomotive";
import { validateSamplingField, validateSamplingForm } from "@/utils/validation/sample";

const INITIAL_SAMPLE: Sampling = {
  locomotive_id: "",
  examination_frequency: "",
  start_date: "",
};

export const useSamplingForm = (id?: number, onclose?: (sample: Sampling[] | Sampling) => void) => {
  const { company } = useCompany();
  const router = useRouter();

  const [samples, setSamples] = useState<Sampling[]>([{ ...INITIAL_SAMPLE }]);
  const [errors, setErrors] = useState<{ [key: string]: { [key: string]: string } }>({});
  const [locomotives, setLocomotives] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setpagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchLocomotives = useCallback(
    async (page = 1, searchTerm = "") => {
      try {
        if (!company?.id) {
          return;
        }

        setIsLoadingProjects(true);

        const response = await LocomotiveService.getAllLocomotives(page, pagination.limit, company.id as number, "ACTIVE");

        if (response?.data) {
          const newProjects = response.data?.data?.map((locomotive: Locomotive) => ({
            id: locomotive.id,
            name: locomotive.name,
          }));

          if (page === 1) {
            setLocomotives(newProjects);
          } else {
            setLocomotives((prev) => [...prev, ...newProjects]);
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
        console.error("Error fetching Locomotives:", error);
      } finally {
        setIsLoadingProjects(false);
      }
    },
    [company, pagination.limit]
  );

  useEffect(() => {
    if (company?.id) {
      fetchLocomotives(1, "");
    }
  }, [company, fetchLocomotives]);

  const handleLoadMoreLocomotives = useCallback(
    (searchTerm = "") => {
      if (pagination.page < pagination.total_pages) {
        fetchLocomotives(pagination.page + 1, searchTerm);
      }
    },
    [fetchLocomotives, pagination]
  );

  const handleSearchLocomotives = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);

      setpagination((prev) => ({
        ...prev,
        page: 1,
      }));

      fetchLocomotives(1, searchTerm);
    },
    [fetchLocomotives]
  );

  const fetchSampleData = useCallback(async () => {
    if (!id) return;
    try {
      const response = await SamplingService.getSamplingById(id);
      const sampleData = response.data;

      setSamples([
        {
          locomotive_id: sampleData.locomotive?.id,
          examination_frequency: sampleData.examination_frequency,
          start_date: sampleData.start_date,
          locomotive: sampleData?.locomotive,
        },
      ]);
    } catch (error) {
      console.error("Error fetching sample:", error);
      toast.error("Failed to fetch sample data");
    }
  }, [id]);

  useEffect(() => {
    fetchSampleData();
  }, []);

  const clearError = (index: number, field: keyof Sampling) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (newErrors[index]) {
        delete newErrors[index][field];
        if (Object.keys(newErrors[index]).length === 0) {
          delete newErrors[index];
        }
      }
      return newErrors;
    });
  };

  const handleInputChange = (index: number, field: keyof Sampling, value: string): void => {
    setSamples((prev) => {
      const newSamples = [...prev];
      newSamples[index] = { ...newSamples[index], [field]: value } as Sampling;
      return newSamples;
    });

    const validation = validateSamplingField(field, value);
    if (!validation.isValid && validation.error) {
      setErrors((prev) => ({
        ...prev,
        [index]: { ...(prev[index] || {}), [field]: validation.error! },
      }));
    } else {
      clearError(index, field);
    }
  };
  const addSampleEntry = () => {
    setSamples((prev) => [...prev, { ...INITIAL_SAMPLE }]);
  };

  const removeSampleEntry = (index: number) => {
    setSamples((prev) => {
      if (prev.length <= 1) {
        return prev;
      }

      const newSamples = [...prev];
      newSamples.splice(index, 1);
      return newSamples;
    });

    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];

      const reindexedErrors: typeof newErrors = {};
      Object.keys(newErrors).forEach((key) => {
        const keyIndex = parseInt(key);
        if (keyIndex > index) {
          if (newErrors[keyIndex]) {
            reindexedErrors[keyIndex - 1] = newErrors[keyIndex];
          }
        } else {
          if (newErrors[keyIndex]) {
            reindexedErrors[keyIndex] = newErrors[keyIndex];
          }
        }
      });

      return reindexedErrors;
    });
  };
  const validateAllSamples = () => {
    let isValid = true;
    const newErrors: { [key: string]: { [key: string]: string } } = {};

    samples.forEach((sample, index) => {
      const validation = validateSamplingForm(sample);
      if (!validation.isValid) {
        newErrors[index] = validation.errors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAllSamples()) {
      return false;
    }

    if (samples.length === 0) {
      toast.error("At least one sample is required");
      return false;
    }

    setLoading(true);
    try {
      const samplesPayload = {
        samples: samples.map((sample) => ({
          locomotive_id: Number(sample.locomotive_id),
          examination_frequency: sample.examination_frequency,
          start_date: sample.start_date,
        })),
      };

      const formData = new FormData();
      if (id) {
        const firstSample = samples[0];
        formData.append("locomotive_id", firstSample?.locomotive_id || "");
        formData.append("examination_frequency", firstSample?.examination_frequency || "");
        formData.append("start_date", firstSample?.start_date || "");
      } else {
        formData.append("samples", JSON.stringify(samplesPayload.samples));
      }

      const response = await (id ? SamplingService.updateSampling(id, formData) : SamplingService.createSampling(formData));

      toast.success(response?.message || "Operation successful");
      if (onclose) {
        onclose(response?.data);
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
    samples,
    errors,
    handleInputChange,
    handleSubmit,
    locomotives,
    loading,
    handleSearchLocomotives,
    handleLoadMoreLocomotives,
    isLoadingProjects,
    pagination,
    fetchLocomotives: () => fetchLocomotives(1, ""),
    addSampleEntry,
    removeSampleEntry,
  };
};
