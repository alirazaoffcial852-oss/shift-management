import { useCallback, useEffect, useState } from "react";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { SampleExamine } from "@/types/Sampling";
import SamplingExamineService from "@/services/SamplingExamineService";
import SamplingService from "@/services/sampling";

export const useSampleExamineForm = (id?: number, onClose?: (Sample: SampleExamine) => void) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sampleExamine, setSampleExamine] = useState<SampleExamine>({
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>({});

  const [file, setFile] = useState<File>();
  const [dragActive, setDragActive] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  const fetchSampleExamineData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await SamplingService.getSamplingById(id);
      const data = response.data;
      console.log(data?.sampleExamine?.image_url, "data?.sampleExamin?.image_url");
      if (data?.sampleExamine && data?.sampleExamine !== null) {
        setSampleExamine({
          id: data?.sampleExamine?.id,
          notes: data?.sampleExamine?.note,
        });
        if (data?.sampleExamine?.image_url) {
          setImageUrl(data?.sampleExamine?.image_url);
        }
      }
    } catch (error) {
      console.error("Error fetching Sample Examine:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchSampleExamineData();
  }, [fetchSampleExamineData]);

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const validateField = (field: string, value: string) => {
    if (value === "") {
      setErrors((prev) => ({
        ...prev,
        [field]: [`${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`],
      }));
      return false;
    }
    clearError(field);
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setSampleExamine((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFiles = (newFile: File) => {
    if (newFile.type.startsWith("image/") || newFile.type === "application/pdf") {
      setFile(newFile);
      setImageUrl("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files[0] as File);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files[0] as File);
    }
  };

  const removeFile = () => {
    setFile(undefined);
  };

  const removeExistingImage = () => {
    setImageUrl("");
  };

  const validateForm = () => {
    let isValid = true;
    Object.entries(sampleExamine).forEach(([key, value]) => {
      if (!validateField(key, value)) {
        isValid = false;
      }
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("note", sampleExamine.notes);

      if (file) {
        formData.append("image_url", file);
      }
      formData?.append("sample_id", id?.toString() || "");

      const response = await (sampleExamine?.id
        ? SamplingExamineService.updateSamplingExamine(sampleExamine?.id, formData)
        : SamplingExamineService.createSamplingExamine(formData));

      toast.success(response?.message || "Operation successful");
      if (onClose) {
        onClose(response?.data);
      }
    } catch (error: any) {
      const errorMessage = error?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sampleExamine,
    errors,
    isLoading,
    file,
    imageUrl,
    dragActive,
    handleInputChange,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    removeExistingImage,
    handleSubmit,
  };
};
