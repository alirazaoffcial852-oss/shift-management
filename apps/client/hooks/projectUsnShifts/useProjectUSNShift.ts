import React, { useState, useCallback, useEffect, useMemo, useRef } from "react";
import {
  ProjectUSNFormData,
  ProjectUSNFormErrors,
  RoutePlanningRow,
  WagonFilters,
} from "@/types/projectUsn";
import WagonService from "@/services/wagon.service";
import { WagonOption, LocomotiveOption } from "@/types/projectUsn";
import { Product } from "@/types/product";
import { useOrderTable } from "../order/userOrderTable";
import { useLocationsList } from "../location/useLocationsList";
import LocationService from "@/services/location";
import { useLocomotiveTable } from "../locomotive/useLocomotiveTable";
import { useCompany } from "@/providers/appProvider";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { toast } from "sonner";
import { Location, LocationType } from "@/types/location";
import { useProjectUsnProduct } from "../projectUsnProduct/useProjectUsnProduct";
import { useRouter } from "next/navigation";
import { format, parseISO, addDays } from "date-fns";
import { pdf } from "@react-pdf/renderer";
import { RouteLocationPDF } from "@/app/[locale]/shift-management/project-usn-shifts/usn-shifts/(views)/monthly/[id]/components/RouteLocationPDF";
import { useTranslations } from "next-intl";

export const useProjectUSNShift = (
  returnTo?: string,
  editMode: boolean = false,
  shiftId?: number,
  existingShift?: any
) => {
  const router = useRouter();
  const { products: rawProducts } = useProjectUsnProduct();
  const { orders } = useOrderTable();
  const { locations, handleFilter } = useLocationsList();
  const {
    locomotives: formattedLocomotives,
    rawLocomotives,
    isLoading: isLoadingLocomotives,
    pagination: locomotivePagination,
    setCurrentPage: setLocomotivePage,
    handleSearch: handleSearchLocomotives,
  } = useLocomotiveTable();
  
  const [locomotiveSearchTerm, setLocomotiveSearchTerm] = useState<string>("");
  const { company } = useCompany();
  const tPdf = useTranslations("pdf");

  const products: Product[] = rawProducts.map((product: any) => ({
    id: product.id,
    name: `${product.supplier.name} - ${product.customer.name}`,
    customer_id: product.customer_id.toString(),
    company_id: product.company_id?.toString() || "",
    is_locomotive: false,
    has_toll_cost: false,
    toll_cost: 0,
    toll_cost_type: "FLAT" as const,
    has_flat_price: false,
    flat_price: 0,
    shift_flat_rate: null,
    show_in_dropdown: true,
    status: "ACTIVE" as const,
    productPersonnelPricings:
      product.product_usn_personnel_roles?.map((roleObj: any) => {
        const roleFromCompany = company?.roles?.find(
          (role: any) => role.id === roleObj.personnel.role_id
        );

        return {
          id: roleObj.id,
          product_id: product.id,
          company_role_id: roleObj.personnel.role_id,
          company_personnel_id: roleObj.company_personnel_id,
          far_away_hourly_rate: 0,
          nearby_hourly_rate: 0,
          flat_price: 0,
          included_in_flat_price: false,
          costing_terms: "HOURLY" as const,
          personnel: {
            id: roleObj.personnel.id,
            company_id: roleObj.personnel.company_id,
            role_id: roleObj.personnel.role_id,
            role: {
              id: roleObj.personnel.role_id,
              name:
                roleFromCompany?.name || `Role ${roleObj.personnel.role_id}`,
              company_id: roleObj.personnel.company_id,
              act_as: "STAFF" as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            created_at: roleObj.personnel.created_at,
            updated_at: roleObj.personnel.updated_at,
          },
        };
      }) || [],
  }));

  const [formData, setFormData] = useState<ProjectUSNFormData>({
    startDate: "",
    endDate: "",
    endTime: "",
    startTime: "",
    productId: "",
    warehouseLocation: "",
    routePlanningEnabled: false,
    routePlanning: [
      {
        id: "1",
        startLocation: "",
        selectWagon: [],
        selectSecondWagon: [],
        selectPurpose: "",
        orders: [],
        arrivalLocation: "",
        currentShiftProject: [],
        countingLocation: "1798",
        endingLocation: "",
        pickup_date: "",
      },
    ],
    showDetails: true,
    shiftRole: [],
    documents: [],
    locomotiveId: "",
    hasNote: false,
    note: "",
  });

  const [existingDocuments, setExistingDocuments] = useState<
    Array<{ id: number; document: string }>
  >([]);
  const [removedDocumentIds, setRemovedDocumentIds] = useState<number[]>([]);
  const [additionalLocations, setAdditionalLocations] = useState<Location[]>([]);

  const [errors, setErrors] = useState<ProjectUSNFormErrors>({});
  const [wagons, setWagons] = useState<WagonOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const [loading, setLoading] = useState({
    wagons: false,
    projects: false,
    locomotives: false,
  });

  const [wagonModalOpen, setWagonModalOpen] = useState(false);
  const [selectedWagonModalType, setSelectedWagonModalType] = useState<
    "add" | "remove"
  >("add");
  const [selectedWagonType, setSelectedWagonType] = useState<
    "first" | "second"
  >("first");
  const [currentRowId, setCurrentRowId] = useState<string>("");
  const [wagonFilters, setWagonFilters] = useState<WagonFilters>({
    location: "",
    status: "",
    wagonType: "",
    loadedLocation: "",
    rail: "",
    nextStatus: "",
    date: "",
  });

  const [locomotiveOptions, setLocomotiveOptions] = useState<LocomotiveOption[]>([]);
  const lastLocomotivePageRef = useRef<number>(1);
  const lastLocomotiveSearchRef = useRef<string>("");
  const lastLocomotiveIdsRef = useRef<string>("");

  const handleInputChange = useCallback(
    (field: keyof ProjectUSNFormData, value: any) => {
      setFormData((prev) => {
        let processedValue = value;
        if (
          (field === "startDate" || field === "endDate") &&
          value instanceof Date
        ) {
          processedValue = format(value, "yyyy-MM-dd");
        } else if (
          (field === "startDate" || field === "endDate") &&
          value === null
        ) {
          processedValue = "";
        }

        const updated = { ...prev, [field]: processedValue };

        if (field === "startDate") {
          const dateValue = processedValue as string;
          if (typeof dateValue === "string" && dateValue) {
            const startDate = new Date(dateValue);
            if (!isNaN(startDate.getTime())) {
              const sameDayFormatted = format(startDate, "yyyy-MM-dd");
              updated.endDate = sameDayFormatted;
            }
          }
        }

        return updated;
      });

      if (errors[field as keyof ProjectUSNFormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleProductChange = useCallback(
    (productId: string) => {
      const product = products.find((p) => p.id?.toString() === productId);
      setSelectedProduct(product || null);
      handleInputChange("productId", productId);
    },
    [products, handleInputChange]
  );

  const addRoutePlanningRow = useCallback(() => {
    setFormData((prev) => {
      const lastRow = prev.routePlanning[prev.routePlanning.length - 1];
      const newStartLocation = lastRow?.arrivalLocation || "";
      const carriedForwardWagons = lastRow?.selectSecondWagon || [];
      const newRow: RoutePlanningRow = {
        id: Date.now().toString(),
        startLocation: newStartLocation,
        selectWagon: carriedForwardWagons,
        selectSecondWagon: carriedForwardWagons,
        selectPurpose: "",
        orders: [],
        arrivalLocation: "",
        currentShiftProject: [],
        countingLocation: "",
        endingLocation: "",
        pickup_date: "",
      };

      return {
        ...prev,
        routePlanning: [...prev.routePlanning, newRow],
      };
    });
  }, []);

  const updateRoutePlanningRow = useCallback(
    (rowId: string, field: keyof RoutePlanningRow, value: any) => {
      setFormData((prev) => {
        const updatedRoutePlanning = prev.routePlanning.map((row) =>
          row.id === rowId ? { ...row, [field]: value } : row
        );

        if (field === "arrivalLocation") {
          const currentRowIndex = updatedRoutePlanning.findIndex(
            (row) => row.id === rowId
          );
          if (
            currentRowIndex !== -1 &&
            currentRowIndex < updatedRoutePlanning.length - 1
          ) {
            const nextRow = updatedRoutePlanning[currentRowIndex + 1];
            updatedRoutePlanning[currentRowIndex + 1] = {
              ...nextRow,
              startLocation: value,
            } as RoutePlanningRow;
          }
        }

        if (field === "selectSecondWagon" || field === "selectWagon") {
          const currentRowIndex = updatedRoutePlanning.findIndex(
            (row) => row.id === rowId
          );

          if (
            currentRowIndex !== -1 &&
            currentRowIndex < updatedRoutePlanning.length - 1
          ) {
            const currentRow = updatedRoutePlanning[currentRowIndex];
            const nextRow = updatedRoutePlanning[currentRowIndex + 1];

            if (currentRow && nextRow) {
              const carriedForwardWagons = currentRow.selectSecondWagon || [];

              updatedRoutePlanning[currentRowIndex + 1] = {
                ...nextRow,
                selectWagon: carriedForwardWagons,
                selectSecondWagon: carriedForwardWagons,
              } as RoutePlanningRow;
            }
          }
        }

        return {
          ...prev,
          routePlanning: updatedRoutePlanning,
        };
      });

      if (
        field === "startLocation" ||
        field === "arrivalLocation" ||
        field === "train_no"
      ) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          if (newErrors.routePlanningErrors?.[rowId]) {
            const updatedRowErrors = {
              ...newErrors.routePlanningErrors[rowId],
            };
            delete updatedRowErrors[field as keyof typeof updatedRowErrors];
            if (Object.keys(updatedRowErrors).length === 0) {
              const updatedRoutePlanningErrors = {
                ...newErrors.routePlanningErrors,
              };
              delete updatedRoutePlanningErrors[rowId];
              if (Object.keys(updatedRoutePlanningErrors).length === 0) {
                delete newErrors.routePlanningErrors;
              } else {
                newErrors.routePlanningErrors = updatedRoutePlanningErrors;
              }
            } else {
              newErrors.routePlanningErrors = {
                ...newErrors.routePlanningErrors,
                [rowId]: updatedRowErrors,
              };
            }
          }
          return newErrors;
        });
      }
    },
    []
  );


  const removeRoutePlanningRow = useCallback((rowId: string) => {
    setFormData((prev) => ({
      ...prev,
      routePlanning: prev.routePlanning.filter((row) => row.id !== rowId),
    }));
  }, []);

  const handleShiftHandover = useCallback(
    (shift: any) => {
      const routePlannings = shift.usn_shift_route_planning || [];
      if (routePlannings.length === 0) {
        toast.error("Selected shift has no route planning");
        return;
      }

      const lastRoutePlanning = routePlannings[routePlannings.length - 1];
      const arrivalLocationId = lastRoutePlanning.end_location_id;

      if (!arrivalLocationId) {
        toast.error("Last route planning has no arrival location");
        return;
      }

      const location = locations.find((loc) => loc.id === arrivalLocationId);
      if (!location) {
        toast.error("Arrival location not found");
        return;
      }

      setFormData((prev) => {
        const updatedRoutePlanning = [...prev.routePlanning];

        const emptyRouteIndex = updatedRoutePlanning.findIndex(
          (route) => !route.startLocation || route.startLocation.trim() === ""
        );

        if (emptyRouteIndex !== -1) {
          updatedRoutePlanning[emptyRouteIndex] = {
            ...updatedRoutePlanning[emptyRouteIndex],
            startLocation: location.name,
            selectSecondWagon:
              updatedRoutePlanning[emptyRouteIndex]?.selectSecondWagon ?? [],
          } as RoutePlanningRow;

          toast.success(
            `Start location set to ${location.name} in Route ${emptyRouteIndex + 1} from shift handover`
          );
        } else {
          updatedRoutePlanning[0] = {
            ...updatedRoutePlanning[0],
            startLocation: location.name,
            selectSecondWagon: updatedRoutePlanning[0]?.selectSecondWagon ?? [],
          } as RoutePlanningRow;

          toast.success(
            `Start location set to ${location.name} in Route 1 from shift handover (overwritten)`
          );
        }

        return {
          ...prev,
          routePlanning: updatedRoutePlanning,
        };
      });
    },
    [locations]
  );

  const openWagonModal = useCallback(
    (type: "add" | "remove", rowId: string, wagonType: "first" | "second") => {
      const row = formData.routePlanning.find((r) => r.id === rowId);

      let locationFilterValue = "";

      if (row?.startLocation) {
        const normalizedStartLocation = String(row.startLocation).trim();
        
        const locationId = parseInt(normalizedStartLocation, 10);
        const isLocationId = !isNaN(locationId) && locationId > 0;
        
        if (isLocationId) {
          locationFilterValue = String(locationId);
        } else {
          const startLocationEntity = locations.find(
            (loc) => loc.name === normalizedStartLocation
          );
          locationFilterValue = startLocationEntity
            ? String(startLocationEntity.id)
            : "";
        }
      }

      setWagonFilters({
        location: locationFilterValue,
        status: "",
        wagonType: "",
        loadedLocation: "",
        rail: "",
        nextStatus: "",
        date: formData.startDate || "",
      });

      setSelectedWagonModalType(type);
      setSelectedWagonType(wagonType);
      setCurrentRowId(rowId);
      setWagonModalOpen(true);
    },
    [formData.routePlanning, formData.startDate, locations]
  );

  const closeWagonModal = useCallback(() => {
    setWagonModalOpen(false);
    setCurrentRowId("");
    setSelectedWagonType("first");
  }, []);

  const handleWagonSelection = useCallback(
    (wagonId: string) => {
      if (!currentRowId) return;

      const row = formData.routePlanning.find((r) => r.id === currentRowId);
      if (!row) return;

      if (selectedWagonType === "first") {
        const currentWagons = row.selectWagon;
        const currentSecondWagons = row.selectSecondWagon || [];
        let newWagons: string[];

        if (selectedWagonModalType === "add") {
          const isAdding = !currentWagons.includes(wagonId);
          newWagons = currentWagons.includes(wagonId)
            ? currentWagons.filter((id: string) => id !== wagonId)
            : [...currentWagons, wagonId];

          updateRoutePlanningRow(currentRowId, "selectWagon", newWagons);
          if (isAdding && !currentSecondWagons.includes(wagonId)) {
            updateRoutePlanningRow(currentRowId, "selectSecondWagon", [
              ...currentSecondWagons,
              wagonId,
            ]);
          }
        } else {
          newWagons = currentWagons.filter((id: string) => id !== wagonId);
          updateRoutePlanningRow(currentRowId, "selectWagon", newWagons);
          const newSecondWagons = currentSecondWagons.filter(
            (id: string) => id !== wagonId
          );
          updateRoutePlanningRow(
            currentRowId,
            "selectSecondWagon",
            newSecondWagons
          );
        }
      } else if (selectedWagonType === "second") {
        const secondWagons = row.selectSecondWagon || [];

        let newSecondWagons: string[];

        if (selectedWagonModalType === "add") {
          newSecondWagons = secondWagons.includes(wagonId)
            ? secondWagons.filter((id: string) => id !== wagonId)
            : [...secondWagons, wagonId];
        } else {
          newSecondWagons = secondWagons.filter((id: string) => id !== wagonId);
        }

        updateRoutePlanningRow(
          currentRowId,
          "selectSecondWagon",
          newSecondWagons
        );
      }
    },
    [
      currentRowId,
      selectedWagonModalType,
      selectedWagonType,
      formData.routePlanning,
      updateRoutePlanningRow,
    ]
  );

  const handleWagonFilterChange = useCallback(
    (field: keyof WagonFilters, value: string) => {
      setWagonFilters((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const resetWagonFilters = useCallback(() => {
    setWagonFilters({
      location: "",
      status: "",
      wagonType: "",
      loadedLocation: "",
      rail: "",
      nextStatus: "",
      date: "",
    });
  }, []);

  const fetchWagons = useCallback(
    async (searchTerm?: string) => {
      setLoading((prev) => ({ ...prev, wagons: true }));
      try {
        const apiFilters: any = {};
        if (wagonFilters.status) {
          apiFilters.status = wagonFilters.status;
        }
        if (wagonFilters.wagonType) {
          const normalizedWagonType = wagonFilters.wagonType
            .trim()
            .toUpperCase();
          const wagonTypeMap: Record<string, string> = {
            "FAC (S)": "FACS",
            "FAC(S)": "FACS",
            FACS: "FACS",
            FAS: "FAS",
          };
          apiFilters.wagon_type =
            wagonTypeMap[normalizedWagonType] || normalizedWagonType;
        }
        if (wagonFilters.rail) {
          apiFilters.rail = wagonFilters.rail;
        }
        if (wagonFilters.location) {
          const wagonTypeValues = ["Fac (s)", "Fas", "FACS", "FAS"];
          if (!wagonTypeValues.includes(wagonFilters.location)) {
            apiFilters.location_id = wagonFilters.location;
          }
        }
        if (wagonFilters?.date) {
          const dateValue = wagonFilters.date as unknown;
          if (typeof dateValue === "string" && dateValue.trim() !== "") {
            apiFilters.date = dateValue;
          } else if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
            apiFilters.date = format(dateValue, "yyyy-MM-dd");
          }
        }
        if (
          wagonFilters.nextStatus &&
          wagonFilters.nextStatus !== "No Changes"
        ) {
          apiFilters.next_status = wagonFilters.nextStatus;
        }
        if (wagonFilters.loadedLocation) {
          apiFilters.loaded_location = wagonFilters.loadedLocation;
        }

        const response = await WagonService.getWagonFilters(
          1,
          20,
          apiFilters
        );
        
        const wagonOptions: WagonOption[] = response.data.data.map(
          (wagonFilter: any) => {
            const wagon = wagonFilter.wagon || {};
            const currentLocationObj = wagonFilter.current_location || wagon.location;
            const arrivalLocationObj = wagonFilter.arrival_location;
            const plannedCurrentLocationObj = wagonFilter.planned_current_location;

            const formatLoc = (loc: any): string | undefined => {
              if (!loc) return undefined;
              if (typeof loc !== "object") return String(loc);
              const parts = [
                loc.name,
                loc.location,
                loc.type?.replace(/_/g, " ").toLowerCase(),
              ]
                .filter(Boolean)
                .map((part) => (typeof part === "string" ? part.trim() : part));
              return parts.length > 0 ? parts.join(" - ") : undefined;
            };

            const currentLocation = formatLoc(currentLocationObj) ?? "Warehouse";
            const arrivalLocation = formatLoc(arrivalLocationObj);
            const plannedCurrentLocation = formatLoc(plannedCurrentLocationObj);

            return {
              value: wagon.id?.toString() || wagonFilter.wagon_id?.toString() || "",
              label: `Wagon ${wagon.wagon_number || ""}`,
              id: wagon.id || wagonFilter.wagon_id,
              name: `Wagon ${wagon.wagon_number || ""}`,
              wagonNo: `Wagon ${wagon.wagon_number || ""}`,
              status: wagonFilter.status || wagon.status || "EMPTY",
              nextStatus: wagonFilter.next_status || wagon.next_status || "No Changes",
              currentLocation,
              plannedCurrentLocation,
              arrivalLocation,
              loadedEmptyLocation: "",
              typeOfWagon: wagonFilter.wagon_type || wagon.wagon_type || "FAS",
              maxCapacity: `${wagon.maximun_capacity_of_load_weight || 0} Tons`,
              rail: wagonFilter.rail || wagon.rail || "1",
              position: wagon.position || "1",
            };
          }
        );

        setWagons(wagonOptions);
        return wagonOptions;
      } catch (error) {
        console.error("Error fetching wagons:", error);
        return [];
      } finally {
        setLoading((prev) => ({ ...prev, wagons: false }));
      }
    },
    [wagonFilters]
  );

  useEffect(() => {
    if (wagonModalOpen) {
      fetchWagons();
    }
  }, [
    wagonFilters.date,
    wagonFilters.status,
    wagonFilters.wagonType,
    wagonFilters.rail,
    wagonFilters.location,
    wagonFilters.nextStatus,
    wagonFilters.loadedLocation,
    wagonModalOpen,
    fetchWagons,
  ]);

  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...fileArray],
      }));
    }
  }, []);

  const removeDocument = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }));
  }, []);

  const removeExistingDocument = useCallback((documentId: number) => {
    setExistingDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    setRemovedDocumentIds((prev) => [...prev, documentId]);
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: ProjectUSNFormErrors = {};

    if (!formData.startDate) newErrors.startDate = "Start Date is required";
    if (!formData.endDate) newErrors.endDate = "End Date is required";

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays < 0) {
        newErrors.endDate = "End date cannot be before start date";
      }
    }

    if (!formData.startTime) newErrors.startTime = "Start Time is required";
    if (!formData.endTime) newErrors.endTime = "End Time is required";
    if (!formData.productId) newErrors.productId = "Product is required";
    if (!formData.locomotiveId)
      newErrors.locomotiveId = "Locomotive is required";

    if (formData.routePlanningEnabled && formData.routePlanning.length === 0) {
      newErrors.routePlanning = "At least one route planning row is required";
    }

    if (formData.hasNote && !formData.note?.trim()) {
      newErrors.note = "Note is required when enabled";
    }

    if (formData.productId) {
      if (!formData.shiftRole || formData.shiftRole.length === 0) {
        newErrors.shiftRole = "At least one personnel role is required";
      } else {
        const activeRoles = formData.shiftRole.filter(
          (role) => !role.isDisabled
        );

        
          activeRoles.forEach((role) => {
            // if (!role.employee_id || role.employee_id.trim() === "") {
            //   (newErrors as any)[`shiftRole[${role.role_id}].employee_id`] =
            //     "Employee is required";
            // }
            if (!role.proximity) {
              (newErrors as any)[`shiftRole[${role.role_id}].proximity`] =
                "Proximity is required";
            }
            if (!role.break_duration || role.break_duration.trim() === "") {
              (newErrors as any)[`shiftRole[${role.role_id}].break_duration`] =
                "Break duration is required";
            }
          });
        }
    }

    if (formData.routePlanningEnabled && formData.routePlanning.length > 0) {
      const routePlanningErrors: Record<string, any> = {};
      formData.routePlanning.forEach((row) => {
        const rowErrors: any = {};
        if (!row.startLocation || row.startLocation.trim() === "") {
          rowErrors.startLocation = "Start Location is required";
        }
        if (!row.arrivalLocation || row.arrivalLocation.trim() === "") {
          rowErrors.arrivalLocation = "Arrival Location is required";
        }
        if (!row.train_no || row.train_no.trim() === "") {
          rowErrors.train_no = "Train No is required";
        }
        if (row.selectPurpose === "Supplying") {
          if (!row.orders || row.orders.length === 0) {
            rowErrors.orders = "Orders are required when purpose is Supplying";
          }
        }
        if (Object.keys(rowErrors).length > 0) {
          routePlanningErrors[row.id] = rowErrors;
        }
      });
      if (Object.keys(routePlanningErrors).length > 0) {
        newErrors.routePlanningErrors = routePlanningErrors;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const generateDateRange = useCallback(
    (startDate: string, endDate: string) => {
      const dates = [];
      const start = new Date(startDate);
      const end = new Date(endDate);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split("T")[0]);
      }

      return dates;
    },
    []
  );

  const resetForm = useCallback(() => {
    setFormData({
      startDate: "2024-06-08",
      endDate: "2024-06-08",
      startTime: "08:00",
      endTime: "16:00",
      productId: "",
      warehouseLocation: "",
      routePlanningEnabled: true,
      routePlanning: [
        {
          id: "1",
          startLocation: "",
          selectWagon: [],
          selectSecondWagon: [],
          selectPurpose: "",
          orders: [],
          arrivalLocation: "",
          currentShiftProject: [],
          countingLocation: "1798",
          endingLocation: "",
          pickup_date: "",
        },
      ],
      showDetails: true,
      shiftRole: [],
      documents: [],
      locomotiveId: "",
      hasNote: false,
      note: "",
    });
    setSelectedProduct(null);
    setErrors({});
  }, []);

  const formatRoutePlanningForSubmit = useCallback(
    (routePlanningData: RoutePlanningRow[]) => {
      return routePlanningData.map((row, index) => {
        const normalizedStartLocation = row.startLocation?.trim() || "";
        const normalizedEndLocation = row.arrivalLocation?.trim() || "";
        
        // Try to parse as location ID first (if it's a number string)
        const startLocationId = normalizedStartLocation ? parseInt(normalizedStartLocation) : null;
        const endLocationId = normalizedEndLocation ? parseInt(normalizedEndLocation) : null;
        
        let startLocation: Location | undefined;
        let endLocation: Location | undefined;
        
        // If it's a valid number, treat it as location ID
        if (startLocationId && !isNaN(startLocationId) && startLocationId > 0) {
          startLocation = locations.find((loc) => loc.id === startLocationId);
          // If not found in locations, create a location object with just the ID
          // This handles cases where location was loaded via pagination
          // The ID is what matters for submission, name is just for object structure
          if (!startLocation) {
            startLocation = { id: startLocationId, name: "" } as Location;
          }
        } else {
          // Otherwise, treat it as location name (backward compatibility)
          startLocation = locations.find(
            (loc) => loc.name?.trim().toLowerCase() === normalizedStartLocation.toLowerCase()
          );
        }
        
        if (endLocationId && !isNaN(endLocationId) && endLocationId > 0) {
          endLocation = locations.find((loc) => loc.id === endLocationId);
          // If not found in locations, create a location object with just the ID
          // This handles cases where location was loaded via pagination
          // The ID is what matters for submission, name is just for object structure
          if (!endLocation) {
            endLocation = { id: endLocationId, name: "" } as Location;
          }
        } else {
          endLocation = locations.find(
            (loc) => loc.name?.trim().toLowerCase() === normalizedEndLocation.toLowerCase()
          );
        }

        if (editMode && existingShift?.usn_shift_route_planning) {
          const existingRoutePlanning = existingShift.usn_shift_route_planning[index];
          if (existingRoutePlanning) {
            if (!startLocation && existingRoutePlanning.start_location_id) {
              const originalStartLoc = locations.find(
                (loc) => loc.id === existingRoutePlanning.start_location_id
              );
              if (originalStartLoc) {
                startLocation = originalStartLoc;
              } else {
                const startLocationId = existingRoutePlanning.start_location_id;
                if (startLocationId && startLocationId > 0) {
                  startLocation = { id: startLocationId, name: normalizedStartLocation } as any;
                }
              }
            }
            
            if (!endLocation && existingRoutePlanning.end_location_id) {
              const originalEndLoc = locations.find(
                (loc) => loc.id === existingRoutePlanning.end_location_id
              );
              if (originalEndLoc) {
                endLocation = originalEndLoc;
              } else {
                const endLocationId = existingRoutePlanning.end_location_id;
                if (endLocationId && endLocationId > 0) {
                  endLocation = { id: endLocationId, name: normalizedEndLocation } as any;
                }
              }
            }
          }
        }

        const firstWagonActions = (row.selectWagon || []).map((wagonId) => ({
          wagon_id: parseInt(wagonId),
          action: "ADD",
        }));

        const keptWagonIds = (row.selectWagon || []).filter((id) =>
          (row.selectSecondWagon || []).includes(id)
        );
        const secondWagonActions = keptWagonIds.map((wagonId) => ({
          wagon_id: parseInt(wagonId),
          action: "ADD",
        }));

        const orders = (row.orders || []).map((orderId) => ({
          order_id: parseInt(orderId),
        }));

        const routeData: any = {
          start_location_id: startLocation?.id || 0,
          end_location_id: endLocation?.id || 0,
          purpose: row.selectPurpose.toUpperCase().replace(/-/g, "_"),
          train_no: row.train_no || "",
          first_wagon_action: firstWagonActions,
          second_wagon_action: secondWagonActions,
          orders: orders.length > 0 ? orders : undefined,
        };

        if (row.selectPurpose === "Supplying" && row.pickup_date) {
          try {
            const dateValue = String(row.pickup_date);
            const date = new Date(dateValue);

            if (!isNaN(date.getTime())) {
              routeData.pickup_date = format(date, "yyyy-MM-dd");
            }
          } catch (error) {
            console.error("Error formatting pickup_date:", error);
          }
        }

        return routeData;
      });
    },
    [locations, editMode, existingShift]
  );

  const generateRouteLocationPDF = useCallback(
    async (
      row: RoutePlanningRow,
      locationType: "start" | "end"
    ): Promise<Blob | null> => {
      try {
        const firstIds = row.selectWagon || [];
        const secondIds = row.selectSecondWagon || [];

        const makeWagonData = (ids: string[], actionLabel: string) =>
          ids
            .map((wagonId: string) => {
              const wagon = wagons.find((w) => w.value === wagonId);
              if (!wagon) return null;

              return {
                id: parseInt(wagonId),
                wagon_id: parseInt(wagonId),
                action: actionLabel,
                wagon: {
                  wagon_number: parseInt(
                    wagon.wagonNo?.replace("Wagon ", "") || "0"
                  ),
                  status: wagon.status || "EMPTY",
                  location: wagon.currentLocation || "N/A",
                  wagon_type: wagon.typeOfWagon || "FAS",
                  maximun_capacity_of_load_weight: parseFloat(
                    wagon.maxCapacity?.replace(" Tons", "") || "0"
                  ),
                  rail: wagon.rail || "1",
                  position: wagon.position || "1",
                  has_damage: false,
                },
              };
            })
            .filter((w): w is any => w !== null);

        const droppedIds = firstIds.filter((id) => !secondIds.includes(id));
        const droppedData = makeWagonData(
          droppedIds,
          row.selectPurpose || "N/A"
        );
        const leftData = makeWagonData(secondIds, "LEFT");

        const locationName =
          locationType === "start" ? row.startLocation : row.arrivalLocation;

        if (!locationName) {
          return null;
        }

        if (locationType === "start") {
          if (firstIds.length === 0) {
            return null;
          }
        } else {
          if (firstIds.length === 0 && secondIds.length === 0) {
            return null;
          }
        }

        const pdfElement = React.createElement(RouteLocationPDF, {
          locationType: locationType,
          locationName: locationName,
          wagons:
            locationType === "start"
              ? makeWagonData(firstIds, row.selectPurpose || "N/A")
              : droppedData,
          droppedWagons: locationType === "end" ? droppedData : undefined,
          leftWagons: locationType === "end" ? leftData : undefined,
          routeInfo: {
            trainNo: row.train_no || "N/A",
            purpose: row.selectPurpose || "N/A",
            startLocation: row.startLocation || "N/A",
            endLocation: row.arrivalLocation || "N/A",
          },
          t: tPdf,
        });

        const blob = await pdf(pdfElement as any).toBlob();

        return blob;
      } catch (error) {
        console.error("Error generating PDF:", error);
        return null;
      }
    },
    [wagons, tPdf]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) {
        toast.error("Please fill in all required fields");
        return;
      }

      if (e.target !== e.currentTarget) {
        return;
      }

      if (!company?.id) {
        toast.error("Company not selected");
        return;
      }

      if (formData.startDate && formData.endDate) {
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);

        const diffTime = end.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
          toast.error("End date cannot be before start date");
          setIsSubmitting(false);
          return;
        }
      }

      if (formData.routePlanningEnabled) {
        const missingOrdersRow = formData.routePlanning.find((row) => {
          if (row.selectPurpose === "Supplying") {
            return !row.orders || row.orders.length === 0;
          }
          return false;
        });

        if (missingOrdersRow) {
          toast.error("Orders are required when purpose is Supplying");
          setIsSubmitting(false);
          return;
        }

        try {
          const violatingRow = formData.routePlanning.find((row, idx) => {
            const purpose = row.selectPurpose || "";
            const mustDropAll = ["Storaging", "Supplying", "Loading"].includes(
              purpose
            );
            if (!mustDropAll) return false;
            const secondCount = (row.selectSecondWagon || []).length;
            return secondCount > 0;
          });
        } catch {
          toast.error("Please fill in all required fields");
          setIsSubmitting(false);
          return;
        }
      }

      setIsSubmitting(true);

      try {
        const baseShiftData: any = {
          start_time: formData.startTime,
          end_time: formData.endTime,
          product_usn_id: parseInt(formData.productId),
          company_id: company.id,
          has_locomotive: "true",
          has_note: formData.hasNote ? "true" : "false",
          note: formData.hasNote ? formData.note : undefined,
          has_document: formData.documents.length > 0 ? "true" : "false",
          has_route_planning: formData.routePlanningEnabled ? "true" : "false",
          locomotive_id: parseInt(formData.locomotiveId!),
          shiftRole: formData.shiftRole
            .filter((role) => {
              if (role.isDisabled) return false;
              
              const employeeId = role.employee_id;
              const parsedEmployeeId = employeeId 
                ? (typeof employeeId === 'string' ? parseInt(employeeId) : employeeId)
                : null;
              
              return parsedEmployeeId && parsedEmployeeId > 0;
            })
            .map((role) => ({
              role_id: parseInt(role.role_id),
              employee_id: typeof role.employee_id === 'string' 
                ? parseInt(role.employee_id) 
                : role.employee_id,
              proximity: role.proximity,
              break_duration: role.break_duration,
              start_day: role.start_day,
            })),
        };

        if (formData.routePlanningEnabled) {
          baseShiftData.routePlanning = formatRoutePlanningForSubmit(
            formData.routePlanning
          );
        } else {
          baseShiftData.warehouse_location_id = parseInt(
            formData.warehouseLocation!
          );
        }

        const blobToFile = (blob: Blob, fileName: string): File => {
          return new File([blob], fileName, {
            type: blob.type || "application/pdf",
          });
        };

        let routePlanningToUse = formData.routePlanning;
        if (
          formData.routePlanningEnabled &&
          formData.routePlanning.length > 0
        ) {
          const updatedRoutePlanning = [...formData.routePlanning];

          // Commented out: Location document generation
          // for (let i = 0; i < updatedRoutePlanning.length; i++) {
          //   let row = updatedRoutePlanning[i];
          //   if (!row) continue;

          //   if (!row.starting_location_document) {
          //     try {
          //       const startPdf = await generateRouteLocationPDF(row, "start");
          //       if (startPdf) {
          //         row = {
          //           ...row,
          //           starting_location_document: startPdf,
          //         } as RoutePlanningRow;
          //         updatedRoutePlanning[i] = row;
          //       } else {
          //         console.warn(`Failed to generate start PDF for route ${i}`);
          //       }
          //     } catch (error) {
          //       console.error(
          //         `Error generating start PDF for route ${i}:`,
          //         error
          //       );
          //     }
          //   }

          //   if (!row.ending_location_document) {
          //     try {
          //       const endPdf = await generateRouteLocationPDF(row, "end");
          //       if (endPdf) {
          //         row = {
          //           ...row,
          //           ending_location_document: endPdf,
          //         } as RoutePlanningRow;
          //         updatedRoutePlanning[i] = row;
          //       } else {
          //         console.warn(`Failed to generate end PDF for route ${i}`);
          //       }
          //     } catch (error) {
          //       console.error(
          //         `Error generating end PDF for route ${i}:`,
          //         error
          //       );
          //     }
          //   }
          // }

          setFormData((prev) => ({
            ...prev,
            routePlanning: updatedRoutePlanning,
          }));

          routePlanningToUse = updatedRoutePlanning;

          toast.dismiss();
        }

        if (editMode && shiftId) {
          const shiftData = {
            ...baseShiftData,
            date: formData.startDate,
          };

          const formDataToSend = new FormData();
          formDataToSend.append("shift", JSON.stringify(shiftData));

          formData.documents.forEach((file) => {
            formDataToSend.append("documents", file);
          });

          // Commented out: Location documents not sent in body (edit mode)
          // if (formData.routePlanningEnabled && routePlanningToUse.length > 0) {
          //   routePlanningToUse.forEach((row, index) => {
          //     if (row.starting_location_document) {
          //       const file = blobToFile(
          //         row.starting_location_document,
          //         `starting_location_document_${row.train_no || index}.pdf`
          //       );
          //       formDataToSend.append("starting_location_document", file);
          //       console.log(
          //         `Added starting_location_document for route ${index}`
          //       );
          //     } else {
          //       console.warn(
          //         `No starting_location_document for route ${index}`
          //       );
          //     }
          //     if (row.ending_location_document) {
          //       const file = blobToFile(
          //         row.ending_location_document,
          //         `ending_location_document_${row.train_no || index}.pdf`
          //       );
          //       formDataToSend.append("ending_location_document", file);
          //       console.log(
          //         `Added ending_location_document for route ${index}`
          //       );
          //     } else {
          //       console.warn(`No ending_location_document for route ${index}`);
          //     }
          //   });
          // }

          await ProjectUSNShiftsService.updateProjectUSNShift(
            shiftId,
            formDataToSend
          );
          toast.success(
            `${formData.routePlanningEnabled ? "USN" : "Warehouse"} Shift updated successfully!`
          );

          const shiftType = formData.routePlanningEnabled
            ? "usn-shifts"
            : "warehouse-shifts";
          const returnPath = returnTo
            ? `/shift-management/project-usn-shifts/${shiftType}/${returnTo}`
            : `/shift-management/project-usn-shifts/${shiftType}/monthly`;

          router.push(returnPath);
        } else {
          const dates = generateDateRange(formData.startDate, formData.endDate);

          const shiftsData = dates.map((date) => ({
            ...baseShiftData,
            date,
          }));

          const formDataToSend = new FormData();
          formDataToSend.append("shifts", JSON.stringify(shiftsData));

          formData.documents.forEach((file) => {
            formDataToSend.append("documents", file);
          });

          // Commented out: Location documents not sent in body (create mode)
          // if (formData.routePlanningEnabled && routePlanningToUse.length > 0) {
          //   routePlanningToUse.forEach((row, index) => {
          //     if (row.starting_location_document) {
          //       const file = blobToFile(
          //         row.starting_location_document,
          //         `starting_location_document_${row.train_no || index}.pdf`
          //       );
          //       formDataToSend.append("starting_location_document", file);
          //       console.log(
          //         `Added starting_location_document for route ${index}`
          //       );
          //     } else {
          //       console.warn(
          //         `No starting_location_document for route ${index}`
          //       );
          //     }
          //     if (row.ending_location_document) {
          //       const file = blobToFile(
          //         row.ending_location_document,
          //         `ending_location_document_${row.train_no || index}.pdf`
          //       );
          //       formDataToSend.append("ending_location_document", file);
          //       console.log(
          //         `Added ending_location_document for route ${index}`
          //       );
          //     } else {
          //       console.warn(`No ending_location_document for route ${index}`);
          //     }
          //   });
          // }

          await ProjectUSNShiftsService.createProjectUSNShift(formDataToSend);
          toast.success(
            `${formData.routePlanningEnabled ? "USN" : "Warehouse"} Shifts created successfully!`
          );

          const shiftType = formData.routePlanningEnabled
            ? "usn-shifts"
            : "warehouse-shifts";
          const returnPath = returnTo
            ? `/shift-management/project-usn-shifts/${shiftType}/${returnTo}`
            : `/shift-management/project-usn-shifts/${shiftType}/monthly`;

          router.push(returnPath);
          resetForm();
        }
      } catch (error) {
        console.error(
          `Error ${editMode ? "updating" : "creating"} shifts:`,
          error
        );
        toast.error(`Failed to ${editMode ? "update" : "create"} shifts`);
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      validateForm,
      company?.id,
      generateDateRange,
      editMode,
      shiftId,
      returnTo,
      router,
      resetForm,
      formatRoutePlanningForSubmit,
    ]
  );

  const getCurrentRowWagons = (rowId: string) => {
    const row = formData.routePlanning.find((r) => r.id === rowId);
    if (!row) return [];
    if (selectedWagonType === "first") {
      return row.selectWagon;
    } else if (selectedWagonType === "second") {
      return row.selectSecondWagon || [];
    }
    return [];
  };

  const handleProductSearch = (searchQuery: string) => {};

  const personalDetailErrors = Object.entries(errors).reduce(
    (acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value : "";
      return acc;
    },
    {} as { [key: string]: string }
  );

  useEffect(() => {
    handleFilter(LocationType.WAREHOUSE);
  }, [handleFilter]);

  const currentLocomotiveIds = useMemo(
    () => rawLocomotives.map((loco: any) => loco.id).join(","),
    [rawLocomotives]
  );

  useEffect(() => {
    const isSearchChange = lastLocomotiveSearchRef.current !== locomotiveSearchTerm;
    const isPageIncrement = locomotivePagination.page > lastLocomotivePageRef.current;
    const isDataChange = lastLocomotiveIdsRef.current !== currentLocomotiveIds;
    
    if (isSearchChange) {
      lastLocomotiveSearchRef.current = locomotiveSearchTerm;
      lastLocomotivePageRef.current = 1;
      lastLocomotiveIdsRef.current = "";
      setLocomotiveOptions([]);
      return;
    }
    
    if (!rawLocomotives || rawLocomotives.length === 0 || !isDataChange) {
      return;
    }
    
    const mapped: LocomotiveOption[] = rawLocomotives
      .filter((locomotive: any) => locomotive.id !== undefined)
      .map((locomotive: any) => ({
        value: locomotive.id!.toString(),
        label: locomotive.name,
        id: locomotive.id as number,
        name: locomotive.name,
      }));

    setLocomotiveOptions((prev) => {
      const shouldAppend = isPageIncrement && locomotivePagination.page > 1;
      
      if (shouldAppend) {
        const existingIds = new Set(prev.map((loco) => loco.id));
        const newOnes = mapped.filter((loco) => !existingIds.has(loco.id));
        lastLocomotivePageRef.current = locomotivePagination.page;
        lastLocomotiveIdsRef.current = currentLocomotiveIds;
        return [...prev, ...newOnes];
      }
      
      lastLocomotivePageRef.current = locomotivePagination.page;
      lastLocomotiveIdsRef.current = currentLocomotiveIds;
      return mapped;
    });
  }, [locomotivePagination.page, locomotiveSearchTerm, currentLocomotiveIds]);

  const hasMoreLocomotives =
    locomotivePagination.page < locomotivePagination.total_pages;

  const handleLoadMoreLocomotives = useCallback(() => {
    if (hasMoreLocomotives && !isLoadingLocomotives) {
      setLocomotivePage(locomotivePagination.page + 1);
    }
  }, [hasMoreLocomotives, isLoadingLocomotives, setLocomotivePage, locomotivePagination.page]);

  const handleLocomotiveSearch = useCallback((searchTerm: string) => {
    setLocomotiveSearchTerm(searchTerm);
    handleSearchLocomotives(searchTerm);
  }, [handleSearchLocomotives]);

  useEffect(() => {
    if (editMode && existingShift && !isInitialized && products.length > 0) {
      const formatDate = (dateStr: string): string => {
        if (!dateStr) return "";
        try {
          const date = new Date(dateStr);
          return date.toISOString().split("T")[0] || "";
        } catch {
          return "";
        }
      };

      const formatTime = (timeStr: string) => {
        if (!timeStr) return "";
        try {
          const date = new Date(timeStr);
          const timeString = date.toTimeString().split(" ")[0];
          return timeString ? timeString.substring(0, 5) : "";
        } catch {
          return "";
        }
      };


      const shiftRoles =
        existingShift.usn_shift_roles?.map((role: any) => {
          const firstPersonnel = role.usn_shift_personnels?.find(
            (personnel: any) => personnel?.employee_id
          );
          const employeeId = firstPersonnel?.employee_id?.toString() || "";

          return {
            role_id: role.role_id.toString(),
            employee_id: employeeId,
            proximity: role.proximity || "NEARBY",
            break_duration: role.break_duration || "0",
            start_day: role.start_day || "NO",
            isDisabled: false,
          };
        }) || [];

        console.log(shiftRoles,'shiftRoles')

      const parseRoutePlanning = async () => {
        if (!existingShift.has_route_planning) {
          return [
            {
              id: "1",
              startLocation: "",
              selectWagon: [],
              selectSecondWagon: [],
              selectPurpose: "",
              orders: [],
              arrivalLocation: "",
              currentShiftProject: [],
              countingLocation: "1798",
              endingLocation: "",
              pickup_date: "",
            },
          ];
        }

        const routePlanningData =
          existingShift.usn_shift_route_planning ||
          existingShift.usn_shift_route_plannings;

          console.log(routePlanningData,"routePlanningData");

        if (routePlanningData && routePlanningData.length > 0) {
          const locationIds = new Set<number>();
          routePlanningData.forEach((rp: any) => {
            if (rp.start_location_id) locationIds.add(rp.start_location_id);
            if (rp.end_location_id) locationIds.add(rp.end_location_id);
          });

          const locationMap = new Map<number, Location>();
          
          locations.forEach((loc: any) => {
            const locationId = loc.id;
            if (locationId && locationIds.has(locationId)) {
              locationMap.set(locationId, loc as Location);
            }
          });

          const missingLocationIds = Array.from(locationIds).filter(
            (id) => !locationMap.has(id)
          );

          if (missingLocationIds.length > 0) {
            try {
              const locationPromises = missingLocationIds.map((id) =>
                LocationService.getLocationById(id)
                  .then((response) => {
                    const location = response.data?.data || response.data;
                    return location;
                  })
                  .catch((error) => {
                    console.error(`Failed to fetch location ${id}:`, error);
                    return null;
                  })
              );

              const fetchedLocations = await Promise.all(locationPromises);
              const validLocations: Location[] = [];
              fetchedLocations.forEach((loc) => {
                if (loc) {
                  locationMap.set(loc.id, loc);
                  validLocations.push(loc);
                }
              });
              
              if (validLocations.length > 0) {
                setAdditionalLocations((prev) => {
                  const existingIds = new Set(prev.map(l => l.id));
                  const newLocations = validLocations.filter(l => !existingIds.has(l.id));
                  return [...prev, ...newLocations];
                });
              }
            } catch (error) {
              console.error("Error fetching locations:", error);
            }
          }

          return routePlanningData.map((rp: any, index: number) => {
            const startLocation = locationMap.get(rp.start_location_id);
            const endLocation = locationMap.get(rp.end_location_id);

            const firstWagonIds =
              (rp.usn_shift_first_wagon_action || rp.first_wagon_action)?.map(
                (action: any) => action.wagon_id.toString()
              ) || [];
            const secondWagonIds =
              (rp.usn_shift_second_wagon_action || rp.second_wagon_action)?.map(
                (action: any) => action.wagon_id.toString()
              ) || [];

            const orderIds =
              (rp.usn_shift_route_planning_orders || rp.orders)?.map(
                (order: any) => (order.order_id || order.id).toString()
              ) || [];

            const formatPurpose = (purpose: string) => {
              if (!purpose) return "Loading";
              return (
                purpose.charAt(0).toUpperCase() + purpose.slice(1).toLowerCase()
              );
            };

            const startingLocationDoc = 
              rp.route_planning_starting_location_documents?.[0]?.document ||
              rp.usn_shift_route_planning_starting_location_documents?.[0]?.document ||
              null;

            const endingLocationDoc = 
              rp.route_planning_ending_location_documents?.[0]?.document ||
              rp.usn_shift_route_planning_ending_location_documents?.[0]?.document ||
              null;

            return {
              id: (index + 1).toString(),
              startLocation: startLocation?.id?.toString() || "",
              selectWagon: firstWagonIds,
              selectSecondWagon: secondWagonIds,
              selectPurpose: formatPurpose(rp.purpose) || "",
              orders: orderIds,
              arrivalLocation: endLocation?.id?.toString() || "",
              train_no: rp.train_no || "",
              pickup_date: rp.pickup_date || "",
              currentShiftProject: [],
              countingLocation: "",
              endingLocation: "",
              starting_location_document_url: startingLocationDoc || undefined,
              ending_location_document_url: endingLocationDoc || undefined,
            };
          });
        }

        return [
          {
            id: "1",
            startLocation: "",
            selectWagon: [],
            selectSecondWagon: [],
            selectPurpose: "",
            orders: [],
            arrivalLocation: "",
            currentShiftProject: [],
            countingLocation: "1798",
            endingLocation: "",
            pickup_date: "",
          },
        ];
      };

      const getLocomotiveId = () => {
        if (existingShift.locomotive_id) {
          return existingShift.locomotive_id.toString();
        }
        if (existingShift.usn_shift_locomotives?.[0]?.locomotive_id) {
          return existingShift.usn_shift_locomotives[0].locomotive_id.toString();
        }
        return "";
      };

      const getWarehouseLocationId = () => {
        if (existingShift.warehouse_location_id) {
          return existingShift.warehouse_location_id.toString();
        }
        if (existingShift.usn_shift_warehouse_locations?.[0]?.location_id) {
          return existingShift.usn_shift_warehouse_locations[0].location_id.toString();
        }
        if (existingShift.location_id) {
          return existingShift.location_id.toString();
        }
        return "";
      };

      parseRoutePlanning()
        .then((parsedRoutePlanning) => {
          setFormData({
            startDate: formatDate(existingShift.date) || "",
            endDate: formatDate(existingShift.date) || "",
            startTime: formatTime(existingShift.start_time) || "",
            endTime: formatTime(existingShift.end_time) || "",
            productId: existingShift.product_usn_id.toString(),
            warehouseLocation: getWarehouseLocationId(),
            routePlanningEnabled: existingShift.has_route_planning || false,
            routePlanning: parsedRoutePlanning,
            showDetails: true,
            shiftRole: shiftRoles,
            documents: [],
            locomotiveId: getLocomotiveId(),
            hasNote: existingShift.has_note || false,
            note: existingShift.note || "",
          });
        })
        .catch((error) => {
          console.error("Error parsing route planning:", error);
          setFormData({
            startDate: formatDate(existingShift.date) || "",
            endDate: formatDate(existingShift.date) || "",
            startTime: formatTime(existingShift.start_time) || "",
            endTime: formatTime(existingShift.end_time) || "",
            productId: existingShift.product_usn_id.toString(),
            warehouseLocation: getWarehouseLocationId(),
            routePlanningEnabled: existingShift.has_route_planning || false,
            routePlanning: [
              {
                id: "1",
                startLocation: "",
                selectWagon: [],
                selectSecondWagon: [],
                selectPurpose: "",
                orders: [],
                arrivalLocation: "",
                currentShiftProject: [],
                countingLocation: "",
                endingLocation: "",
                pickup_date: "",
              },
            ],
            showDetails: true,
            shiftRole: shiftRoles,
            documents: [],
            locomotiveId: getLocomotiveId(),
            hasNote: existingShift.has_note || false,
            note: existingShift.note || "",
          });
        });

      const product = products.find(
        (p) => p.id?.toString() === existingShift.product_usn_id.toString()
      );
      setSelectedProduct(product || null);

      if (existingShift.usn_shift_documents) {
        setExistingDocuments(
          existingShift.usn_shift_documents.map(
            (doc: { id: number; document: string }) => ({
              id: doc.id,
              document: doc.document,
            })
          )
        );
      }

      setIsInitialized(true);
    }
  }, [editMode, existingShift, products, isInitialized, locations]);

  useEffect(() => {
    if (editMode && isInitialized && additionalLocations.length > 0 && formData.routePlanning.length > 0) {
      const routePlanningData =
        existingShift?.usn_shift_route_planning ||
        existingShift?.usn_shift_route_plannings;

      if (routePlanningData && routePlanningData.length > 0) {
        const updatedRoutePlanning = formData.routePlanning.map((row, index) => {
          const rp = routePlanningData[index];
          if (!rp) return row;

          const allLocationsMap = new Map<number, Location>();
          locations.forEach((loc) => allLocationsMap.set(loc.id, loc));
          additionalLocations.forEach((loc) => allLocationsMap.set(loc.id, loc));

          const startLocation = allLocationsMap.get(rp.start_location_id);
          const endLocation = allLocationsMap.get(rp.end_location_id);

          return {
            ...row,
            startLocation: startLocation?.name || row.startLocation,
            arrivalLocation: endLocation?.name || row.arrivalLocation,
          };
        });

        const hasChanges = updatedRoutePlanning.some((updated, index) => {
          const original = formData.routePlanning[index];
          if (!original) return false;
          const startChanged = updated.startLocation !== original.startLocation;
          const arrivalChanged = updated.arrivalLocation !== original.arrivalLocation;
          return startChanged || arrivalChanged;
        });

        if (hasChanges) {
          setFormData((prev) => ({
            ...prev,
            routePlanning: updatedRoutePlanning,
          }));
        }
      }
    }
  }, [additionalLocations, editMode, isInitialized, locations, existingShift]);

  const mergedLocations = useMemo(() => {
    const locationMap = new Map<number, Location>();
    
    locations.forEach((loc) => {
      locationMap.set(loc.id, loc);
    });
    
    additionalLocations.forEach((loc) => {
      if (!locationMap.has(loc.id)) {
        locationMap.set(loc.id, loc);
      }
    });
    
    return Array.from(locationMap.values());
  }, [locations, additionalLocations]);

  return {
    formData,
    errors,
    wagons,
    products,
    locomotives: locomotiveOptions,
    selectedProduct,
    wagonModalOpen,
    selectedWagonModalType,
    selectedWagonType,
    currentRowId,
    wagonFilters,
    loading,
    isSubmitting,
    handleInputChange,
    addRoutePlanningRow,
    updateRoutePlanningRow,
    removeRoutePlanningRow,
    handleShiftHandover,
    openWagonModal,
    closeWagonModal,
    handleWagonSelection,
    handleWagonFilterChange,
    resetWagonFilters,
    fetchWagons,
    handleProductChange,
    handleFileUpload,
    removeDocument,
    removeExistingDocument,
    existingDocuments,
    validateForm,
    handleSubmit,
    resetForm,
    orders,
    locations: mergedLocations,
    getCurrentRowWagons,
    handleProductSearch,
    personalDetailErrors,
    warehouseLocations: mergedLocations,
    formatRoutePlanningForSubmit,
    hasMoreLocomotives,
    handleLoadMoreLocomotives,
    handleSearchLocomotives: handleLocomotiveSearch,
    isLoadingLocomotives,
  };
};
