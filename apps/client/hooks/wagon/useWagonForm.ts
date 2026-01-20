import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import WagonService from "@/services/wagon.service";
import { useTranslations } from "next-intl";
import {
  WagonFormData,
  WagonBrakeManualDetails,
  WagonBrakeAutoDetails,
  WagonDamageInformations,
  WagonRents,
  WagonFormErrors,
  Wagon,
} from "@/types/wagonTypes";

const sanitizeWagonNumber = (value?: string | number | null) => {
  if (value === undefined || value === null) return "";
  return value.toString().replace(/\D/g, "").slice(0, 12);
};

const normalizeWagonType = (value?: string | null) => {
  if (!value) return "";
  return value.toUpperCase();
};

const sanitizeDateField = (value: unknown): string => {
  if (!value) return "";

  if (value instanceof Date) {
    const [datePart] = value.toISOString().split("T");
    return datePart || "";
  }

  if (typeof value === "string") {
    if (!value.trim()) return "";
    if (!value.includes("T")) {
      return value;
    }
    const [datePart] = value.split("T");
    return datePart || "";
  }

  return "";
};

const INITIAL_WAGON_DATA: WagonFormData = {
  wagon_number: "",
  location_id: 0,
  rail: "",
  position: "",
  has_damage: false,
  wagon_type: "",
  maximun_capacity_of_load_weight: "",
  weight_of_the_wagon_itself: "",
  weight_of_load: "0",
  braking_type: "",
  parking_brake: true,
  has_automatic_brake: false,
  length_over_buffer: "",
  loaded_axles: "0",
  empty_axles: "0",
  last_revision_date: "",
  next_revision_date: "",
  has_rent: false,
};

export const useWagonForm = (id?: number, onClose?: () => void) => {
  const router = useRouter();
  const t = useTranslations("common");
  const [formData, setFormData] = useState<WagonFormData>(INITIAL_WAGON_DATA);
  const [brakeManualDetails, setBrakeManualDetails] =
    useState<WagonBrakeManualDetails>({
      empty_braking_weight: "",
      full_braking_weight: "",
      conversion_weight: "",
    });
  const [brakeAutoDetails, setBrakeAutoDetails] =
    useState<WagonBrakeAutoDetails>({
      maximum_braking_weight: "",
    });
  const [damageInformations, setDamageInformations] =
    useState<WagonDamageInformations>({
      date_when_available_again: "",
      notes: "",
    });
  const [wagonRents, setWagonRents] = useState<WagonRents>({
    from: "",
    to: "",
    amount: "",
  });
  const [errors, setErrors] = useState<WagonFormErrors>({});
  const [loading, setLoading] = useState(false);

  const fetchWagonData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const response = await WagonService.getWagonById(id);
      const wagon = response.data;

      setFormData({
        wagon_number: sanitizeWagonNumber(wagon.wagon_number),
        location_id: wagon.location_id || undefined,
        rail: wagon.rail || "",
        position: wagon.position || "",
        has_damage: wagon.has_damage || false,
        wagon_type: normalizeWagonType(wagon.wagon_type),
        maximun_capacity_of_load_weight:
          wagon.maximun_capacity_of_load_weight?.toString() || "",
        weight_of_the_wagon_itself:
          wagon.weight_of_the_wagon_itself?.toString() || "",
        weight_of_load: wagon.weight_of_load?.toString() || "0",
        braking_type: wagon.braking_type || "",
        parking_brake:
          wagon.parking_brake !== undefined ? wagon.parking_brake : true,
        has_automatic_brake: wagon.has_automatic_brake || false,
        length_over_buffer: wagon.length_over_buffer?.toString() || "",
        loaded_axles: wagon.loaded_axles?.toString() || "0",
        empty_axles: wagon.empty_axles?.toString() || "0",
        last_revision_date: sanitizeDateField(wagon.last_revision_date),
        next_revision_date: sanitizeDateField(wagon.next_revision_date),
        has_rent: wagon.has_rent || false,
      });

      if (
        wagon.wagon_brake_manual_details &&
        wagon.wagon_brake_manual_details.length > 0
      ) {
        const manualDetails = wagon.wagon_brake_manual_details[0];
        setBrakeManualDetails({
          empty_braking_weight: manualDetails.empty_braking_weight || "",
          full_braking_weight: manualDetails.full_braking_weight || "",
          conversion_weight: manualDetails.conversion_weight || "",
        });
      }

      if (
        wagon.wagon_brake_auto_details &&
        wagon.wagon_brake_auto_details.length > 0
      ) {
        const autoDetails = wagon.wagon_brake_auto_details[0];
        setBrakeAutoDetails({
          maximum_braking_weight: autoDetails.maximum_braking_weight || "",
        });
      }

      if (
        wagon.wagons_damage_informations &&
        wagon.wagons_damage_informations.length > 0
      ) {
        const damageInfo = wagon.wagons_damage_informations[0];
        setDamageInformations({
          date_when_available_again: sanitizeDateField(
            damageInfo.date_when_available_again
          ),
          notes: damageInfo.notes || "",
        });
      }

      if (wagon.wagon_rents && wagon.wagon_rents.length > 0) {
        const rentInfo = wagon.wagon_rents[0];
        setWagonRents({
          from: sanitizeDateField(rentInfo.from),
          to: sanitizeDateField(rentInfo.to),
          amount: rentInfo.amount || "",
        });
      }
    } catch (error) {
      console.error("Error fetching wagon:", error);
      toast.error(t("an_error_occurred"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchWagonData();
  }, [fetchWagonData]);

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const { [field]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const handleInputChange = useCallback(
    (field: keyof WagonFormData, value: string | boolean | number) => {
      const nextValue =
        field === "wagon_type" && typeof value === "string"
          ? normalizeWagonType(value)
          : value;

      setFormData((prev) => ({ ...prev, [field]: nextValue }));
      clearError(field);
    },
    [clearError]
  );

  const handleBrakeManualChange = useCallback(
    (field: keyof WagonBrakeManualDetails, value: string) => {
      setBrakeManualDetails((prev) => ({ ...prev, [field]: value }));
      clearError(`brakeManual.${field}`);
    },
    [clearError]
  );

  const handleBrakeAutoChange = useCallback(
    (field: keyof WagonBrakeAutoDetails, value: string) => {
      setBrakeAutoDetails((prev) => ({ ...prev, [field]: value }));
      clearError(`brakeAuto.${field}`);
    },
    [clearError]
  );

  const handleDamageChange = useCallback(
    (field: keyof WagonDamageInformations, value: string) => {
      setDamageInformations((prev) => ({ ...prev, [field]: value }));
      clearError(`damage.${field}`);
    },
    [clearError]
  );

  const handleRentChange = useCallback(
    (field: keyof WagonRents, value: string) => {
      setWagonRents((prev) => ({ ...prev, [field]: value }));
      clearError(`rent.${field}`);
    },
    [clearError]
  );

  const validateForm = (): boolean => {
    const newErrors: WagonFormErrors = {};

    if (!formData.wagon_number?.trim()) {
      newErrors.wagon_number = t("wagon_number_required");
    } else if (formData.wagon_number.replace(/\D/g, "").length !== 12) {
      newErrors.wagon_number = t("wagon_number_must_be_12_digits");
    }

    if (!formData.location_id) {
      newErrors.location_id = t("location_required");
    }

    if (!formData.wagon_type?.trim()) {
      newErrors.wagon_type = t("wagon_type_required");
    }

    if (!formData.maximun_capacity_of_load_weight?.trim()) {
      newErrors.maximun_capacity_of_load_weight = t(
        "maximum_capacity_required"
      );
    }

    if (!formData.weight_of_the_wagon_itself?.trim()) {
      newErrors.weight_of_the_wagon_itself = t("wagon_weight_required");
    }

    if (!formData.braking_type?.trim()) {
      newErrors.braking_type = t("braking_type_required");
    }

    if (formData.last_revision_date && formData.next_revision_date) {
      const lastDate = new Date(formData.last_revision_date);
      const nextDate = new Date(formData.next_revision_date);
      if (nextDate <= lastDate) {
        newErrors.next_revision_date = t("next_revision_date_must_be_greater");
      }
    }

    if (formData.has_damage && !damageInformations.date_when_available_again) {
      newErrors["damage.date_when_available_again"] = t(
        "available_date_required_for_damaged"
      );
    }

    if (formData.has_rent) {
      if (!wagonRents.from) {
        newErrors["rent.from"] = t("rent_from_date_required");
      }
      if (!wagonRents.to) {
        newErrors["rent.to"] = t("rent_to_date_required");
      }
      if (!wagonRents.amount) {
        newErrors["rent.amount"] = t("rent_amount_required");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(
        t("validation.required", { field: "" }) ||
          "Please fix the validation errors"
      );
      return false;
    }

    setLoading(true);
    try {
      const submitData = {
        ...formData,
        wagon_number: sanitizeWagonNumber(formData.wagon_number),
        wagon_type: normalizeWagonType(formData.wagon_type),
      };

      const response = id
        ? await WagonService.updateWagon(
            id,
            submitData,
            !formData.has_automatic_brake ? brakeManualDetails : undefined,
            formData.has_automatic_brake ? brakeAutoDetails : undefined,
            formData.has_damage ? damageInformations : undefined,
            formData.has_rent ? wagonRents : undefined
          )
        : await WagonService.createWagon(
            submitData,
            !formData.has_automatic_brake ? brakeManualDetails : undefined,
            formData.has_automatic_brake ? brakeAutoDetails : undefined,
            formData.has_damage ? damageInformations : undefined,
            formData.has_rent ? wagonRents : undefined
          );

      toast.success(response?.message || t("operation_successful"));

      if (onClose) {
        onClose();
      } else {
        router.push("/wagon");
      }

      return true;
    } catch (error: any) {
      const errorMessage = error?.data?.message || t("an_error_occurred");
      toast.error(errorMessage);

      if (error?.data?.type === "VALIDATION_ERROR" && error?.data?.errors) {
        const apiErrors = error.data.errors;
        setErrors((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(apiErrors).map(([field, messages]) => [
              field,
              Array.isArray(messages) ? messages[0] : messages,
            ])
          ),
        }));
      }

      console.error("Error submitting form:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    brakeManualDetails,
    brakeAutoDetails,
    damageInformations,
    wagonRents,
    errors,
    loading,
    handleInputChange,
    handleBrakeManualChange,
    handleBrakeAutoChange,
    handleDamageChange,
    handleRentChange,
    handleSubmit,
    clearError,
  };
};

export const useWagonTable = (initialPage = 1, initialSearch = "", limit = 20) => {
  const router = useRouter();
  const t = useTranslations("messages");
  const [wagons, setWagons] = useState<Wagon[]>([]);
  
  const [pagination, setPagination] = useState({
    page: initialPage,
    limit: limit,
    total: 0,
    total_pages: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const fetchWagons = useCallback(
    async (page: number = 1, search: string = "") => {
      try {
        setIsLoading(true);
        const response = await WagonService.getAllWagons(
          page,
          pagination.limit,
          search
        );

        if (response.data) {
          setWagons(response.data.data);
          if (response.data.pagination) {
             setPagination({
              page: response.data.pagination.page,
              limit: response.data.pagination.limit,
              total: response.data.pagination.total,
              total_pages: response.data.pagination.total_pages,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching wagons:", error);
        toast.error(t("errorOccurred"));
      } finally {
        setIsLoading(false);
      }
    },
    [t, pagination.limit]
  );

  useEffect(() => {
    fetchWagons(pagination.page, searchTerm);
  }, [pagination.page, searchTerm, fetchWagons]);

  const handleEdit = useCallback(
    (wagon: any) => {
      console.log("Edit wagon:", wagon);
      router.push(`/wagon/${wagon.id}/edit`);
    },
    [router]
  );

  const handleDelete = useCallback(
    (wagon: any) => {
      fetchWagons(pagination.page, searchTerm);
    },
    [pagination.page, searchTerm, fetchWagons]
  );

  const handleView = useCallback(
    (wagon: any) => {
      console.log("View wagon:", wagon);
      router.push(`/wagon/${wagon.id}`);
    },
    [router]
  );

  const handleSearch = useCallback(
    (search: string) => {
      setSearchTerm(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
      // URL update is removed as state handles it, but optionally could keep for deep linking if desired.
      // For consistency with other refactors, relying on internal state.
    },
    []
  );

  const handleFilter = useCallback((filterValue: string) => {
    console.log("Filter value:", filterValue);
  }, []);

  const transformWagonData = useCallback((wagon: Wagon) => {
    const locationName =
      wagon.location?.name ||
      wagon.location?.location ||
      (wagon.location_id !== undefined ? String(wagon.location_id) : "-");

    const loadedEmptyLocation =
      wagon.location?.location ||
      wagon.location?.name ||
      (wagon.location_id !== undefined ? String(wagon.location_id) : "-");

    return {
      id: wagon.id,
      wagonNumber: wagon.wagon_number,
      status: (wagon.status || "").toString(),
      currentLocation: locationName,
      loadedEmptyLocation,
      wagonType: wagon.wagon_type,
      maxCapacity: `${wagon.maximun_capacity_of_load_weight} Tons`,
      nextRevision: wagon.next_revision_date
        ? new Date(wagon.next_revision_date).toLocaleDateString()
        : "N/A",
    };
  }, []);

  const formattedWagons = wagons.map(transformWagonData);

  return {
    wagons: formattedWagons,
    rawWagons: wagons,
    currentPage: pagination.page,
    totalPages: pagination.total_pages,
    isLoading,
    searchTerm,
    selectedRows,
    setSelectedRows,
    handleEdit,
    handleDelete,
    handleView,
    onPageChange: (page: number) => setPagination((prev) => ({ ...prev, page })),
    handleSearch,
    handleFilter,
    transformWagonData,
    pagination
  };
};
