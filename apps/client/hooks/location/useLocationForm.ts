import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LocationService from "@/services/location";
import { LocationFormData, LocationType } from "@/types/location";
import { useTranslations } from "next-intl";

export const useLocationForm = (id?: number, onclose?: () => void) => {
  const router = useRouter();
  const t = useTranslations("pages.locations");

  const [location, setLocation] = useState<LocationFormData>({
    name: "",
    location: "",
    type: LocationType.WAREHOUSE,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const fetchLocationData = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await LocationService.getLocationById(id);
      const data = response.data;
      setLocation({
        name: data.name,
        location: data.location,
        type: data.type,
      });
    } catch (error) {
      console.error("Error fetching location:", error);
      toast.error(t("failedToFetchLocationData"));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    if (id) {
      fetchLocationData();
    }
  }, [fetchLocationData]);

  const validateLocationForm = (data: LocationFormData) => {
    const newErrors: Record<string, string> = {};

    if (!data.name.trim()) {
      newErrors.name = t("locationNameIsRequired");
    }

    if (!data.location.trim()) {
      newErrors.location = t("locationIsRequired");
    }

    if (!data.type) {
      newErrors.type = t("typeOfLocationIsRequired");
    }

    return {
      isValid: Object.keys(newErrors).length === 0,
      errors: newErrors,
    };
  };

  const handleInputChange = (field: keyof LocationFormData, value: string) => {
    setLocation((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = validateLocationForm(location);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", location.name);
      formData.append("location", location.location);
      formData.append("type", location.type);

      const response = await (id
        ? LocationService.updateLocation(id, formData)
        : LocationService.createLocation(formData));

      toast.success(response?.message || t("operationSuccessful"));

      if (onclose) {
        onclose();
      } else {
        router.push("/locations");
      }

      return true;
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("anErrorOccurred");
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    location,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    setLocation,
    setErrors,
  };
};
