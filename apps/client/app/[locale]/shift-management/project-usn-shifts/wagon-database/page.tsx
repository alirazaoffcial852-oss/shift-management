"use client";

import React, { useState, useEffect, useCallback } from "react";
import WagonService from "@/services/wagon.service";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { toast } from "sonner";
import { WagonFilters } from "@/types/projectUsn";
import TableView from "./components/TableView";
import RailView from "./components/RailView";

interface WagonData {
  id: number;
  wagon_number: number;
  status: string;
  location_id: number;
  location_name?: string;
  rail: string;
  position: string;
  wagon_type: string;
  maximun_capacity_of_load_weight: number;
  has_damage: boolean;
  nextStatus?: string;
  loadedEmptyLocation?: string;
  currentLocation?: string;
}

const WagonDatabasePage = () => {
  const { locations } = useLocationsList();
  const [view, setView] = useState<"table" | "rail">("table");
  const [wagons, setWagons] = useState<WagonData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<WagonFilters>({
    location: "",
    status: "",
    wagonType: "",
    loadedLocation: "",
    rail: "",
    nextStatus: "",
    date: "",
  });

  const fetchWagons = useCallback(async () => {
    setLoading(true);
    try {
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
          apiFilters.location = filters.location;
        }
      }
      if (filters.date && filters.date.trim() !== "") {
        apiFilters.date = filters.date;
      }
      if (filters.nextStatus && filters.nextStatus !== "No Changes") {
        apiFilters.nextStatus = filters.nextStatus;
      }
      if (filters.loadedLocation) {
        apiFilters.loadedLocation = filters.loadedLocation;
      }

      const response = await WagonService.getAllWagons(
        1,
        1000,
        undefined,
        apiFilters
      );

      if (response?.data?.data) {
        const wagonData: WagonData[] = response.data.data.map((wagon: any) => {
          const location = locations.find(
            (loc) => loc.id === wagon.location_id
          );
          const locationName = location?.name || "N/A";

          return {
            id: wagon.id,
            wagon_number: wagon.wagon_number,
            status: wagon.status || "EMPTY",
            location_id: wagon.location_id,
            location_name: locationName,
            rail: wagon.rail || "1",
            position: wagon.position || "1",
            wagon_type: wagon.wagon_type || "FAS",
            maximun_capacity_of_load_weight:
              wagon.maximun_capacity_of_load_weight || 0,
            has_damage: wagon.has_damage || false,
            nextStatus: "No Changes",
            currentLocation: locationName,
            loadedEmptyLocation: locationName,
          };
        });

        setWagons(wagonData);
      }
    } catch (error) {
      console.error("Error fetching wagons:", error);
      toast.error("Failed to fetch wagons");
    } finally {
      setLoading(false);
    }
  }, [filters, locations]);

  useEffect(() => {
    fetchWagons();
  }, [
    filters.date,
    filters.status,
    filters.wagonType,
    filters.rail,
    filters.location,
    filters.nextStatus,
    filters.loadedLocation,
    fetchWagons,
  ]);

  const filteredWagons = wagons;

  const handleFilterChange = (field: keyof WagonFilters, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Wagon Database</h1>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setView("table")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === "table"
                ? "bg-[#4CD04C1A] text-green-800 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Table View
          </button>
          <button
            onClick={() => setView("rail")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              view === "rail"
                ? "bg-[#4CD04C1A] text-green-800 font-medium"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Rail View
          </button>
        </div>
      </div>

      {view === "table" ? (
        <TableView
          wagons={filteredWagons}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      ) : (
        <RailView
          wagons={filteredWagons}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}
    </div>
  );
};

export default WagonDatabasePage;
