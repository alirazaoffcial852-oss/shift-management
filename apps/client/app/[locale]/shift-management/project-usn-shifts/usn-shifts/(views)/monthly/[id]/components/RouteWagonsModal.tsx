"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { MoreVertical, AlertTriangle } from "lucide-react";
import WagonService from "@/services/wagon.service";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@workspace/ui/components/dropdown-menu";

interface WagonData {
  id: number;
  wagon_id: number;
  action: string;
  wagon: {
    id: number;
    wagon_number: number;
    status: string;
    location: string;
    rail: string;
    position: string;
    wagon_type: string;
    maximun_capacity_of_load_weight: number;
    has_damage: boolean;
  };
}

interface RouteWagonsModalProps {
  isOpen: boolean;
  onClose: () => void;
  firstWagons: WagonData[];
  secondWagons: WagonData[];
  usnShiftRoutePlanningId?: number;
  routeInfo?: {
    startLocation: string;
    endLocation: string;
    trainNo: string;
    purpose: string;
  };
  onWagonPositionUpdate?: () => void;
}

const RouteWagonsModal: React.FC<RouteWagonsModalProps> = ({
  isOpen,
  onClose,
  firstWagons: initialFirstWagons,
  secondWagons: initialSecondWagons,
  usnShiftRoutePlanningId,
  routeInfo,
  onWagonPositionUpdate,
}) => {
  const [allWagons, setAllWagons] = useState<
    (WagonData & { section: "first" | "second"; originalIndex: number })[]
  >([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [positionModalOpen, setPositionModalOpen] = useState(false);
  const [selectedForPosition, setSelectedForPosition] = useState<
    (WagonData & { section: "first" | "second" }) | null
  >(null);
  const [railInput, setRailInput] = useState<string>("");
  const [positionInput, setPositionInput] = useState<string>("");
  const [damageModalOpen, setDamageModalOpen] = useState(false);
  const [selectedForDamage, setSelectedForDamage] = useState<
    (WagonData & { section: "first" | "second" }) | null
  >(null);

  React.useEffect(() => {
    const combined = [
      ...initialFirstWagons.map((w, index) => ({
        ...w,
        section: "first" as const,
        originalIndex: index,
      })),
      ...initialSecondWagons.map((w, index) => ({
        ...w,
        section: "second" as const,
        originalIndex: index + 1000,
      })),
    ];

    const sorted = combined.sort((a, b) => {
      const posA = parseInt(a.wagon.position) || 0;
      const posB = parseInt(b.wagon.position) || 0;

      if (posA !== posB) {
        return posA - posB;
      }

      if (a.section !== b.section) {
        return a.section === "first" ? -1 : 1;
      }

      return a.originalIndex - b.originalIndex;
    });

    setAllWagons(sorted);
  }, [initialFirstWagons, initialSecondWagons]);

  React.useEffect(() => {
    const handleClickOutside = () => {
      if (activeDropdown !== null) {
        setActiveDropdown(null);
        setDropdownPosition(null);
      }
    };

    if (activeDropdown !== null) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeDropdown]);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newWagons = [...allWagons];
    const draggedWagon = newWagons[draggedIndex];

    if (!draggedWagon) {
      setDraggedIndex(null);
      return;
    }

    const targetWagon = newWagons[dropIndex];
    if (targetWagon && targetWagon.section !== draggedWagon.section) {
      setDraggedIndex(null);
      return;
    }

    const draggedItems = newWagons.splice(draggedIndex, 1);
    const draggedItem = draggedItems[0];

    if (draggedItem) {
      newWagons.splice(dropIndex, 0, draggedItem);
      setAllWagons(newWagons);
    }

    if (!usnShiftRoutePlanningId) {
      toast.error("Route planning ID is required");
      setDraggedIndex(null);
      return;
    }

    try {
      toast.loading("Updating wagon order...");

      const firstSection = newWagons.filter((w) => w.section === "first");
      const secondSection = newWagons.filter((w) => w.section === "second");

      // Update first section wagon orders
      await Promise.all(
        firstSection.map(async (wagon, idx) => {
          const wagonOrder = idx + 1;
          await WagonService.updateFirstWagonActionOrder(
            wagon.id, // first_wagon_action_id
            usnShiftRoutePlanningId,
            wagonOrder
          );
        })
      );

      // Update second section wagon orders
      await Promise.all(
        secondSection.map(async (wagon, idx) => {
          const wagonOrder = idx + 1;
          await WagonService.updateSecondWagonActionOrder(
            wagon.id, // second_wagon_action_id
            usnShiftRoutePlanningId,
            wagonOrder
          );
        })
      );

      toast.dismiss();
      toast.success("Wagon order updated successfully");

      if (onWagonPositionUpdate) {
        onWagonPositionUpdate();
      }
    } catch (error: any) {
      console.error("Error updating wagon order:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update wagon order"
      );
      setAllWagons([...allWagons]);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const showDamageDetails = (
    wagon: WagonData & { section: "first" | "second" }
  ) => {
    // Open confirmation modal first; call API on confirm
    setSelectedForDamage(wagon);
    setDamageModalOpen(true);
    setActiveDropdown(null);
    setDropdownPosition(null);
  };

  const handleConfirmDamage = async () => {
    if (!selectedForDamage) return;
    try {
      toast.loading("Updating wagon status to DAMAGED...");
      await WagonService.updateWagonStatus(
        selectedForDamage.wagon.id,
        "DAMAGED"
      );
      toast.dismiss();
      toast.success(
        `Wagon ${selectedForDamage.wagon.wagon_number} marked as DAMAGED`
      );
      setAllWagons((prev) =>
        prev.map((w) =>
          w.wagon.id === selectedForDamage.wagon.id
            ? {
                ...w,
                wagon: { ...w.wagon, status: "DAMAGED", has_damage: true },
              }
            : w
        )
      );
    } catch (error: any) {
      console.error("Failed to update wagon status:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update wagon status"
      );
    } finally {
      setDamageModalOpen(false);
      setSelectedForDamage(null);
    }
  };

  const openChangePosition = (
    wagon: WagonData & { section: "first" | "second" }
  ) => {
    setSelectedForPosition(wagon);
    setRailInput(wagon.wagon.rail || "1");
    setPositionInput(String(wagon.wagon.position || ""));
    setActiveDropdown(null);
    setDropdownPosition(null);
    setPositionModalOpen(true);
  };

  const handleSubmitChangePosition = async () => {
    if (!selectedForPosition) return;
    try {
      const trimmed = String(positionInput).trim();
      if (trimmed === "") {
        toast.error("Position is required");
        return;
      }
      toast.loading("Updating wagon position...");
      await WagonService.updateWagonPosition(
        selectedForPosition.wagon.id,
        railInput,
        trimmed
      );
      toast.dismiss();
      toast.success("Wagon position updated");

      setAllWagons((prev) => {
        const updated = prev.map((w) =>
          w.wagon.id === selectedForPosition.wagon.id
            ? {
                ...w,
                wagon: {
                  ...w.wagon,
                  rail: String(railInput),
                  position: trimmed,
                },
              }
            : w
        );
        return updated.sort(
          (a, b) =>
            (parseInt(a.wagon.position) || 0) -
            (parseInt(b.wagon.position) || 0)
        );
      });

      if (onWagonPositionUpdate) onWagonPositionUpdate();
    } catch (error: any) {
      console.error("Failed to update wagon position:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update wagon position"
      );
    } finally {
      setPositionModalOpen(false);
    }
  };

  const handleDropdownClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    wagonId: number
  ) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const DROPDOWN_WIDTH = 224; // w-56
    const GAP = 4;
    const top = rect.bottom + GAP;
    const maxLeft = window.innerWidth - DROPDOWN_WIDTH - 8;
    const desiredLeft = rect.right - DROPDOWN_WIDTH;
    setDropdownPosition({
      top,
      left: Math.max(8, Math.min(desiredLeft, maxLeft)),
    });
    setActiveDropdown(activeDropdown === wagonId ? null : wagonId);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="max-w-7xl max-h-[85vh] overflow-hidden flex flex-col"
          onInteractOutside={(e) => {
            if (activeDropdown !== null) e.preventDefault();
          }}
          onPointerDownOutside={(e) => {
            if (activeDropdown !== null) e.preventDefault();
          }}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Route Planning - Wagon Actions
            </DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-auto relative">
            {allWagons.length === 0 ? (
              <div className="flex items-center justify-center py-12 text-gray-500">
                <p>No wagon actions found for this route</p>
              </div>
            ) : (
              <div className="space-y-6">
                <h3 className="text-sm font-semibold text-gray-700 px-1">
                  Start Location Wagons
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left"></th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Wagon No
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Next Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Current Location
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Loaded / Empty Location
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Type of Wagon
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Max Capacity
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Rail
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Position
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {allWagons
                        .filter((w) => w.section === "first")
                        .map((wagonAction) => {
                          const index = allWagons.findIndex(
                            (w) =>
                              w.id === wagonAction.id && w.section === "first"
                          );
                          return (
                            <tr
                              key={wagonAction.id}
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragOver={(e) => handleDragOver(e)}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                              className={`hover:bg-gray-50 cursor-move transition-all ${
                                draggedIndex === index
                                  ? "opacity-50 bg-blue-50"
                                  : ""
                              }`}
                            >
                              <td className="border border-gray-300 px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.wagon_number}
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                  {wagonAction.wagon.status.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                  No Changes
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.location}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm"></td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.wagon_type}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {
                                  wagonAction.wagon
                                    .maximun_capacity_of_load_weight
                                }{" "}
                                Tons
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.rail}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.position}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center">
                                <div className="relative">
                                  <button
                                    onClick={(e) =>
                                      handleDropdownClick(e, wagonAction.id)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors inline-flex items-center justify-center"
                                  >
                                    <MoreVertical
                                      size={18}
                                      className="text-gray-600"
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                <h3 className="text-sm font-semibold text-gray-700 px-1">
                  Arrival Location Wagons
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                      <tr>
                        <th className="border border-gray-300 px-4 py-3 text-left"></th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Wagon No
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Next Status
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Current Location
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Loaded / Empty Location
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Type of Wagon
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Max Capacity
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Rail
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-700">
                          Position
                        </th>
                        <th className="border border-gray-300 px-4 py-3 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {allWagons
                        .filter((w) => w.section === "second")
                        .map((wagonAction) => {
                          const index = allWagons.findIndex(
                            (w) =>
                              w.id === wagonAction.id && w.section === "second"
                          );
                          return (
                            <tr
                              key={wagonAction.id}
                              draggable
                              onDragStart={() => handleDragStart(index)}
                              onDragOver={(e) => handleDragOver(e)}
                              onDrop={(e) => handleDrop(e, index)}
                              onDragEnd={handleDragEnd}
                              className={`hover:bg-gray-50 cursor-move transition-all ${
                                draggedIndex === index
                                  ? "opacity-50 bg-blue-50"
                                  : ""
                              }`}
                            >
                              <td className="border border-gray-300 px-4 py-3 text-center">
                                <input
                                  type="checkbox"
                                  className="w-4 h-4 cursor-pointer"
                                />
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.wagon_number}
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                  {wagonAction.wagon.status.replace(/_/g, " ")}
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3">
                                <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                                  No Changes
                                </span>
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.location}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm"></td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.wagon_type}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {
                                  wagonAction.wagon
                                    .maximun_capacity_of_load_weight
                                }{" "}
                                Tons
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.rail}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-sm">
                                {wagonAction.wagon.position}
                              </td>
                              <td className="border border-gray-300 px-4 py-3 text-center">
                                <div className="relative">
                                  <button
                                    onClick={(e) =>
                                      handleDropdownClick(e, wagonAction.id)
                                    }
                                    className="p-2 hover:bg-gray-100 rounded-md transition-colors inline-flex items-center justify-center"
                                  >
                                    <MoreVertical
                                      size={18}
                                      className="text-gray-600"
                                    />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <SMSButton
              onClick={onClose}
              className="bg-[#3E8258] hover:bg-[#3E8258]/90 text-white px-6 py-2 rounded-full"
              text="Close"
              type="button"
            />
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeDropdown !== null && dropdownPosition && (
        <div
          className="fixed bg-white rounded-lg shadow-xl border border-gray-200 !z-[9999] w-56 overflow-hidden"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const wagon = allWagons.find((w) => w.id === activeDropdown);
                if (wagon) showDamageDetails(wagon);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
            >
              <AlertTriangle
                size={16}
                className={
                  allWagons.find((w) => w.id === activeDropdown)?.wagon
                    .has_damage
                    ? "text-red-500"
                    : "text-amber-500"
                }
              />
              <span>Add Damage Status</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                const wagon = allWagons.find((w) => w.id === activeDropdown);
                if (wagon) openChangePosition(wagon);
              }}
              onMouseDown={(e) => e.stopPropagation()}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-blue-500"
              >
                <path d="M12 5v14" />
                <path d="M5 12h14" />
              </svg>
              <span>Change Position</span>
            </button>
          </div>
        </div>
      )}

      {positionModalOpen && (
        <Dialog open={positionModalOpen} onOpenChange={setPositionModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Change Wagon Position
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                Wagon #{selectedForPosition?.wagon.wagon_number}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Rail</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={railInput}
                    onChange={(e) => setRailInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Position
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded px-3 py-2"
                    value={positionInput}
                    min={1}
                    onChange={(e) => setPositionInput(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <SMSButton
                variant="outline"
                onClick={() => setPositionModalOpen(false)}
              >
                Cancel
              </SMSButton>
              <SMSButton
                onClick={handleSubmitChangePosition}
                className="bg-[#3E8258] hover:bg-[#3E8258]/90 text-white"
              >
                Update
              </SMSButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {damageModalOpen && (
        <Dialog open={damageModalOpen} onOpenChange={setDamageModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-lg font-semibold">
                Add Damage Status
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <AlertTriangle size={18} className="mt-0.5 text-amber-500" />
                <div>
                  Mark wagon #{selectedForDamage?.wagon.wagon_number} as
                  <span className="font-medium"> DAMAGED</span>?
                </div>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <SMSButton
                variant="outline"
                onClick={() => setDamageModalOpen(false)}
              >
                Cancel
              </SMSButton>
              <SMSButton
                onClick={handleConfirmDamage}
                className="bg-red-600 hover:bg-red-600/90 text-white"
              >
                Confirm
              </SMSButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default RouteWagonsModal;
