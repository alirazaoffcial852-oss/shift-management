import { useCompany } from "@/providers/appProvider";
import { Locomotive } from "@/types/locomotive";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import LocomotiveService from "@/services/locomotive";

export const useLocomotiveForm = (id?: number) => {
  const router = useRouter();
  const { company } = useCompany();
  const [isLoading, setIsLoading] = useState(false);
  const [locomotive, setLocomotive] = useState<Locomotive>({
    name: "",
    model_type: "",
    engine: "",
    year: "",
    company_id: company?.id || null,
  });
  const [errors, setErrors] = useState<Record<string, string[]> | undefined>(
    {}
  );

  const [file, setFile] = useState<File>();
  const [dragActive, setDragActive] = useState(false);

  const [imageUrl, setImageUrl] = useState<string>("");

  const fetchLocomotiveData = useCallback(async () => {
    if (!id) return;

    try {
      const response = await LocomotiveService.getLocomotiveById(id);
      const locomotiveData = {
        name: response.data.name,
        model_type: response.data.model_type,
        engine: response.data.engine,
        year: response.data.year,
        company_id: response.data.company_id,
      };

      setLocomotive(locomotiveData);

      if (response.data.image) {
        setImageUrl(response.data.image);
      }
    } catch (error) {
      console.error("Error fetching Locomotive:", error);
    }
  }, [id]);

  useEffect(() => {
    fetchLocomotiveData();
  }, [fetchLocomotiveData]);

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
        [field]: [
          `${field.charAt(0).toUpperCase() + field.slice(1).replace(/_/g, " ")} is required`,
        ],
      }));
      return false;
    }
    clearError(field);
    return true;
  };

  const handleInputChange = (field: string, value: string) => {
    setLocomotive((prev) => ({ ...prev, [field]: value }));
    validateField(field, value);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFiles = (newFile: File) => {
    if (
      newFile.type.startsWith("image/") ||
      newFile.type === "application/pdf"
    ) {
      setFile(newFile);
      setImageUrl("");
      clearError("image");
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
    clearError("image");
  };

  const removeExistingImage = () => {
    setImageUrl("");
    clearError("image");
  };

  const validateForm = () => {
    let isValid = true;
    Object.entries(locomotive).forEach(([key, value]) => {
      if (!validateField(key, value)) {
        isValid = false;
      }
    });

    if (!id) {
      if (!file) {
        setErrors((prev) => ({
          ...prev,
          image: ["Image is required"],
        }));
        isValid = false;
      } else {
        clearError("image");
      }
    } else {
      if (!imageUrl && !file) {
        setErrors((prev) => ({
          ...prev,
          image: [
            "Image is required. Please upload a new image or keep the existing one.",
          ],
        }));
        isValid = false;
      } else {
        clearError("image");
      }
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const formData = new FormData();

        formData.append("name", locomotive.name);
        formData.append("model_type", locomotive.model_type);
        formData.append("engine", locomotive.engine);
        formData.append("year", locomotive.year.toString());
        formData.append("company_id", company?.id?.toString() || "");

        if (file) {
          formData.append("image", file);
        }

        if (id && imageUrl === "" && !file) {
          formData.append("remove_image", "true");
        }

        const response = await (id
          ? LocomotiveService.updateLocomotive(id, formData)
          : LocomotiveService.addLocomotive(formData));

        toast.success(response?.message || "Operation successful");
        router.push("/locomotives");
        return true;
      } catch (error: any) {
        const errorMessage = error?.data?.message || "An error occurred";
        toast.error(errorMessage);
        console.error("Error submitting form:", error);
        return false;
      } finally {
        setIsLoading(false);
      }
    }
  };

  return {
    locomotive,
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
