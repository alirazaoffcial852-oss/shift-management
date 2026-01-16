import { useState, useEffect } from "react";
import { useCompany } from "@/providers/appProvider";
import { useProductTable } from "../product/useProductTable";
import { RouteOption } from "@/types/shared/route";
import LocomotiveService from "@/services/locomotive";
import { FileHandlerService } from "@/services/fileHandler";

export const useBaseShift = () => {
  const { company } = useCompany();
  const { products } = useProductTable();
  const [files, setFiles] = useState<File[]>();
  const [dragActive, setDragActive] = useState(false);
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [errors, setErrors] = useState<
    { [key: string]: string } | Array<{ [key: string]: string }>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        if (!company?.id) return;
        const response = await LocomotiveService.getAllRoute(
          company.id.toString()
        );
        if (response?.data) {
          setRoutes(
            response.data.map((route: any) => ({
              value: route.id.toString(),
              label: route.name,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, [company]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFiles = (newFiles: File[]) => {
    setFiles((prevFiles) =>
      FileHandlerService.handleFiles(prevFiles, newFiles)
    );
  };

  const handleDrop = (e: React.DragEvent) => {
    FileHandlerService.handleDrop(e, handleFiles);
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const removeFile = (index: number) => {
    setFiles(files?.filter((_, i) => i !== index));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setErrors({});
  };
  return {
    company,
    products: products?.filter((product) => product?.show_in_dropdown),
    files,
    setFiles,
    dragActive,
    routes,
    setRoutes,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    currentStep,
    setCurrentStep,
    handleDrag,
    handleDrop,
    handleFileInput,
    removeFile,
    handleBack,
  };
};
