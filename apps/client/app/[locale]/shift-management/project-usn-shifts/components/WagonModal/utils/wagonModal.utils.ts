import { WagonFilters, WagonOption } from "@/types/projectUsn";


export const buildApiFilters = (filters: WagonFilters) => {
  const apiFilters: any = {};
  
  if (filters.status) {
    apiFilters.status = filters.status;
  }
  
  if (filters.wagonType) {
    const normalizedWagonType = filters.wagonType.trim().toUpperCase();
    const wagonTypeMap: Record<string, string> = {
      "FAC (S)": "FACS",
      "FAC(S)": "FACS",
      FACS: "FACS",
      FAS: "FAS",
    };
    apiFilters.wagon_type =
      wagonTypeMap[normalizedWagonType] || normalizedWagonType;
  }
  
  if (filters.rail) {
    apiFilters.rail = filters.rail;
  }
  
  if (filters.location) {
    const wagonTypeValues = ["Fac (s)", "Fas", "FACS", "FAS"];
    if (!wagonTypeValues.includes(filters.location)) {
      apiFilters.location_id = filters.location;
    }
  }
  
  if (filters?.date) {
    const dateValue = filters.date as unknown;
    if (typeof dateValue === "string" && dateValue.trim() !== "") {
      apiFilters.date = dateValue;
    }
  }
  
  if (filters.nextStatus && filters.nextStatus !== "No Changes") {
    apiFilters.nextStatus = filters.nextStatus;
  }
  
  return apiFilters;
};

/**
 * Formats location object or string to display string
 */
export const formatLocation = (
  location: unknown,
  unknownText: string = "N/A"
): string => {
  if (!location) {
    return unknownText;
  }

  if (typeof location === "string") {
    return location;
  }

  if (typeof location === "object") {
    const {
      name,
      location: locName,
      type,
    } = location as {
      name?: string;
      location?: string;
      type?: string;
    };

    const parts = [name, locName, type?.replace(/_/g, " ").toLowerCase()]
      .filter(Boolean)
      .map((part) => (typeof part === "string" ? part.trim() : part));

    return parts.length ? parts.join(" - ") : unknownText;
  }

  return String(location);
};


const formatLocationFromObject = (location: any): string | undefined => {
  if (!location) return undefined;
  
  const parts = [
    location.name,
    location.location,
    location.type?.replace(/_/g, " ").toLowerCase(),
  ]
    .filter(Boolean)
    .map((part) => (typeof part === "string" ? part.trim() : part));
  
  return parts.length > 0 ? parts.join(" - ") : undefined;
};


export const transformWagonFilterToOption = (wagonFilter: any): WagonOption => {
  const wagon = wagonFilter.wagon || {};
  const currentLocation = formatLocationFromObject(wagonFilter.current_location);
  const arrivalLocation = formatLocationFromObject(wagonFilter.arrival_location);
  const plannedCurrentLocation = formatLocationFromObject(wagonFilter.planned_current_location);
  
  return {
    value: wagon.id?.toString() || wagonFilter.wagon_id?.toString() || "",
    label: `Wagon ${wagon.wagon_number || ""}`,
    id: wagon.id || wagonFilter.wagon_id,
    name: `Wagon ${wagon.wagon_number || ""}`,
    wagonNo: `Wagon ${wagon.wagon_number || ""}`,
    status: wagonFilter.status || wagon.status || "EMPTY",
    nextStatus: wagonFilter.next_status || wagon.next_status || "No Changes",
    currentLocation: currentLocation || formatLocationFromObject(wagon.location) || "Warehouse",
    plannedCurrentLocation: plannedCurrentLocation,
    arrivalLocation: arrivalLocation,
    loadedEmptyLocation: "",
    typeOfWagon: wagonFilter.wagon_type || wagon.wagon_type || "FAS",
    maxCapacity: `${wagon.maximun_capacity_of_load_weight || 0} Tons`,
    rail: wagonFilter.rail || wagon.rail || "1",
    position: wagon.position || "1",
  };
};


export const transformWagonToOption = (wagon: any): WagonOption => {
  if (wagon.wagon) {
    return transformWagonFilterToOption(wagon);
  }

  let arrivalLocation: string | undefined;
  if (wagon.wagon_histories && wagon.wagon_histories.length > 0) {
    const historyWithArrival = wagon.wagon_histories
      .filter((h: any) => h.arrival_location)
      .sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0];

    if (historyWithArrival?.arrival_location) {
      const arrival = historyWithArrival.arrival_location;
      arrivalLocation = [
        arrival.name,
        arrival.location,
        arrival.type?.replace(/_/g, " ").toLowerCase(),
      ]
        .filter(Boolean)
        .map((part) => (typeof part === "string" ? part.trim() : part))
        .join(" - ");
    }
  }

  const plannedCurrentLocation =
    wagon.planned_current_location != null
      ? typeof wagon.planned_current_location === "object"
        ? formatLocationFromObject(wagon.planned_current_location)
        : String(wagon.planned_current_location)
      : undefined;

  return {
    value: wagon.id.toString(),
    label: `Wagon ${wagon.wagon_number}`,
    id: wagon.id,
    name: `Wagon ${wagon.wagon_number}`,
    wagonNo: `Wagon ${wagon.wagon_number}`,
    status: wagon.status || "EMPTY",
    nextStatus: wagon.next_status || "No Changes",
    currentLocation: wagon.location || "Warehouse",
    plannedCurrentLocation,
    arrivalLocation: arrivalLocation,
    loadedEmptyLocation: "",
    typeOfWagon: wagon.wagon_type || "FAS",
    maxCapacity: `${wagon.maximun_capacity_of_load_weight} Tons`,
    rail: wagon.rail || "1",
    position: wagon.position || "1",
  };
};

/**
 * Gets CSS classes for status badge based on status value
 */
export const getStatusBadgeClass = (status: string): string => {
  if (status === "EMPTY") {
    return "bg-gray-100 text-gray-600";
  }
  
  if (
    status === "PLANNED_TO_BE_LOADED" ||
    status === "SHOULD_BE_LOADED" ||
    status === "PLANNED_TO_BE_EMPTY" ||
    status === "SHOULD_BE_EMPTY"
  ) {
    return "bg-yellow-100 text-yellow-800";
  }
  
  if (status === "LOADED") {
    return "bg-green-100 text-green-800";
  }
  
  if (status === "DAMAGED") {
    return "bg-red-100 text-red-800";
  }
  
  return "bg-gray-100 text-gray-600";
};

export const getFilteredWagons = (
  wagons: WagonOption[],
  modalType: "add" | "remove",
  selectedWagonIds: string[]
): WagonOption[] => {
  if (modalType === "remove") {
    return wagons.filter((wagon) => selectedWagonIds.includes(wagon.value));
  }
  return wagons;
};
