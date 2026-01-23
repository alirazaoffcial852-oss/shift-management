"use client";
import React from "react";
import { ProjectUSNShift } from "@/types/projectUsn";
import { format } from "date-fns";
import { cn } from "@workspace/ui/lib/utils";
import {
  MapPin,
  Clock,
  Calendar,
  User,
  Package,
  Train,
  CheckCircle,
} from "lucide-react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { ProjectUSNRoleSelect } from "./ProjectUSNRoleSelect";
import { useConfirmation } from "@/providers/ConfirmationProvider";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { toast } from "sonner";
import { useAuth, useCompany } from "@/providers/appProvider";
import { useProjectUsnProduct } from "@/hooks/projectUsnProduct/useProjectUsnProduct";

interface ProjectUSNShiftEventProps {
  shift: ProjectUSNShift;
  onShiftsChange: (shifts: ProjectUSNShift[]) => void;
  onShiftSelect: (shift: ProjectUSNShift) => void;
  allShifts: ProjectUSNShift[];
  onClick?: (shift: ProjectUSNShift) => void;
  isSelected: boolean;
  onSelect: (shift: ProjectUSNShift) => void;
  onDragStart?: (shift: ProjectUSNShift) => void;
  onDragEnd?: () => void;
  isDragging?: boolean;
  currentView?: string;
  locomotives?: any[];
}

export function ProjectUSNShiftEvent({
  shift,
  onShiftsChange,
  onShiftSelect,
  allShifts,
  onClick,
  isSelected,
  onSelect,
  onDragStart,
  onDragEnd,
  isDragging = false,
  currentView = "monthly",
  locomotives = [],
}: ProjectUSNShiftEventProps) {
  const { showConfirmation } = useConfirmation();
  const { locomotives: allLocomotives } = useLocomotiveTable();
  const { isEmployee } = useAuth();
  const { products: rawProducts } = useProjectUsnProduct();
  const { company } = useCompany();

  const handleEmployeeChange = async (
    employeeId: string,
    roleId: string,
    shiftData: ProjectUSNShift
  ) => {
    showConfirmation({
      title: "Update Employee Assignment",
      description:
        "Are you sure you want to change the employee for this role?",
      confirmText: "Update",
      variant: "default",
      onConfirm: () => confirmEmployeeChange(employeeId, roleId, shiftData),
    });
  };

  const confirmEmployeeChange = async (
    employeeId: string,
    roleId: string,
    shiftData: ProjectUSNShift
  ) => {
    try {
      toast.loading("Updating employee assignment...");

      const response = await ProjectUSNShiftsService.getProjectUSNShift(
        shiftData.id
      );
      const fullShiftData = response.data || response;

      const formatTimeOnly = (time: string) => {
        if (!time) return "00:00";
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
          return time.substring(0, 5);
        }
        try {
          const date = new Date(time);
          return format(date, "HH:mm");
        } catch (e) {
          return time;
        }
      };

      const updatePayload: any = {
        date: shiftData.date,
        start_time: formatTimeOnly(fullShiftData.start_time),
        end_time: formatTimeOnly(fullShiftData.end_time),
        product_usn_id: fullShiftData.product_usn_id,
        company_id: fullShiftData.company_id,
        has_locomotive: fullShiftData.has_locomotive ? "true" : "false",
        has_note: fullShiftData.has_note ? "true" : "false",
        note: fullShiftData.note || "",
        has_document: fullShiftData.has_document ? "true" : "false",
        has_route_planning: fullShiftData.has_route_planning ? "true" : "false",
      };

      // Get product to access all roles
      const product = rawProducts.find(
        (p) => p.id?.toString() === fullShiftData.product_usn_id?.toString()
      );
      const allProductRoles = product?.product_usn_personnel_roles || [];

      // Create a map of existing shift roles by role_id
      const existingRolesMap = new Map();
      if (fullShiftData.usn_shift_roles && fullShiftData.usn_shift_roles.length > 0) {
        fullShiftData.usn_shift_roles.forEach((role: any) => {
          existingRolesMap.set(role.role_id, role);
        });
      }

      // Build shiftRole array from all product roles
      updatePayload.shiftRole = allProductRoles
        .map((productRole: any) => {
          const productRoleId = productRole.personnel?.role_id;
          const existingRole = existingRolesMap.get(productRoleId);
          
          let currentEmployeeId: number | null;
          if (productRoleId.toString() === roleId) {
            // This is the role being updated
            const parsedId = employeeId ? Number(employeeId) : null;
            currentEmployeeId = parsedId && parsedId > 0 ? parsedId : null;
          } else if (existingRole) {
            // Use existing employee from shift
            const existingEmployeeId = existingRole.usn_shift_personnels?.[0]?.employee_id;
            currentEmployeeId = existingEmployeeId && existingEmployeeId > 0 ? existingEmployeeId : null;
          } else {
            // New role, no employee yet
            currentEmployeeId = null;
          }

          return {
            role_id: productRoleId,
            employee_id: currentEmployeeId,
            proximity: existingRole?.proximity || "NEARBY",
            break_duration: existingRole?.break_duration || "0",
            start_day: existingRole?.start_day || "NO",
          };
        })
        .filter((role: any) => {
          // Only include roles with valid employee_id (greater than 0)
          return role.employee_id && role.employee_id > 0;
        });

      if (fullShiftData.locomotive_id) {
        updatePayload.locomotive_id = fullShiftData.locomotive_id;
      } else if (fullShiftData.locomotive?.id) {
        updatePayload.locomotive_id = fullShiftData.locomotive.id;
      }

      if (fullShiftData.warehouse_location_id) {
        updatePayload.warehouse_location_id =
          fullShiftData.warehouse_location_id;
      } else if (fullShiftData.location_id) {
        updatePayload.warehouse_location_id = fullShiftData.location_id;
      } else if (
        fullShiftData.usn_shift_warehouse_locations?.[0]?.location_id
      ) {
        updatePayload.warehouse_location_id =
          fullShiftData.usn_shift_warehouse_locations[0].location_id;
      }

      if (fullShiftData.has_route_planning) {
        const routePlanningData =
          fullShiftData.usn_shift_route_planning ||
          fullShiftData.usn_shift_route_plannings ||
          [];

        if (routePlanningData.length > 0) {
          updatePayload.routePlanning = routePlanningData.map((rp: any) => {
            const routeData: any = {
              start_location_id: rp.start_location_id,
              end_location_id: rp.end_location_id,
              purpose: rp.purpose,
              first_wagon_action: (
                rp.usn_shift_first_wagon_action ||
                rp.first_wagon_action ||
                []
              ).map((wagon: any) => ({
                wagon_id: wagon.wagon_id,
                action: wagon.action,
              })),
              second_wagon_action: (
                rp.usn_shift_second_wagon_action ||
                rp.second_wagon_action ||
                []
              ).map((wagon: any) => ({
                wagon_id: wagon.wagon_id,
                action: wagon.action,
              })),
            };

            if (rp.train_no) {
              routeData.train_no = rp.train_no;
            }

            if (
              rp.usn_shift_route_planning_orders &&
              rp.usn_shift_route_planning_orders.length > 0
            ) {
              routeData.orders = rp.usn_shift_route_planning_orders.map(
                (order: any) => ({
                  order_id: order.order_id,
                })
              );
            }

            return routeData;
          });
        }
      }

      const formData = new FormData();
      formData.append("shift", JSON.stringify(updatePayload));

      await ProjectUSNShiftsService.updateProjectUSNShift(
        shiftData.id,
        formData
      );

      const updatedShift = {
        ...shiftData,
        usn_shift_roles:
          shiftData.usn_shift_roles?.map((role) =>
            role.role_id.toString() === roleId
              ? {
                  ...role,
                  usn_shift_personnels: employeeId && Number(employeeId) > 0
                    ? [
                        {
                          id: Date.now(),
                          usn_shift_role_id: role.id,
                          employee_id: Number(employeeId),
                          employee: { id: Number(employeeId) },
                        },
                      ]
                    : [], // Remove personnel if employee is unselected
                }
              : role
          ) || [],
      };

      onShiftsChange(
        allShifts.map((s) => (s.id === shiftData.id ? updatedShift : s))
      );

      toast.dismiss();
      toast.success("Employee assignment updated successfully");
    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update employee assignment"
      );
    }
  };

  const handleLocomotiveChange = (locomotiveId: string) => {
    showConfirmation({
      title: "Update Shift Locomotive",
      description:
        "Are you sure you want to change the locomotive for this shift?",
      confirmText: "Update",
      variant: "default",
      onConfirm: () => confirmLocomotiveChange(locomotiveId),
    });
  };

  const confirmLocomotiveChange = async (locomotiveId: string) => {
    try {
      toast.loading("Updating locomotive...");

      const response = await ProjectUSNShiftsService.getProjectUSNShift(
        shift.id
      );
      const fullShiftData = response.data || response;

      const formatTimeOnly = (time: string) => {
        if (!time) return "00:00";
        if (/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
          return time.substring(0, 5);
        }
        try {
          const date = new Date(time);
          return format(date, "HH:mm");
        } catch (e) {
          return time;
        }
      };

      const updatePayload: any = {
        date: shift.date,
        start_time: formatTimeOnly(fullShiftData.start_time),
        end_time: formatTimeOnly(fullShiftData.end_time),
        product_usn_id: fullShiftData.product_usn_id,
        company_id: fullShiftData.company_id,
        has_locomotive: fullShiftData.has_locomotive ? "true" : "false",
        has_note: fullShiftData.has_note ? "true" : "false",
        note: fullShiftData.note || "",
        has_document: fullShiftData.has_document ? "true" : "false",
        has_route_planning: fullShiftData.has_route_planning ? "true" : "false",
        locomotive_id: Number(locomotiveId),
      };

      if (
        fullShiftData.usn_shift_roles &&
        fullShiftData.usn_shift_roles.length > 0
      ) {
        updatePayload.shiftRole = fullShiftData.usn_shift_roles.map(
          (role: any) => ({
            role_id: role.role_id,
            employee_id:
              role.usn_shift_personnels?.[0]?.employee_id || role.role_id,
            proximity: role.proximity,
            break_duration: role.break_duration,
            start_day: role.start_day,
          })
        );
      } else {
        updatePayload.shiftRole = [];
      }

      if (fullShiftData.warehouse_location_id) {
        updatePayload.warehouse_location_id =
          fullShiftData.warehouse_location_id;
      } else if (fullShiftData.location_id) {
        updatePayload.warehouse_location_id = fullShiftData.location_id;
      } else if (
        fullShiftData.usn_shift_warehouse_locations?.[0]?.location_id
      ) {
        updatePayload.warehouse_location_id =
          fullShiftData.usn_shift_warehouse_locations[0].location_id;
      }

      if (fullShiftData.has_route_planning) {
        const routePlanningData =
          fullShiftData.usn_shift_route_planning ||
          fullShiftData.usn_shift_route_plannings ||
          [];

        if (routePlanningData.length > 0) {
          updatePayload.routePlanning = routePlanningData.map((rp: any) => {
            const routeData: any = {
              start_location_id: rp.start_location_id,
              end_location_id: rp.end_location_id,
              purpose: rp.purpose,
              first_wagon_action: (
                rp.usn_shift_first_wagon_action ||
                rp.first_wagon_action ||
                []
              ).map((wagon: any) => ({
                wagon_id: wagon.wagon_id,
                action: wagon.action,
              })),
              second_wagon_action: (
                rp.usn_shift_second_wagon_action ||
                rp.second_wagon_action ||
                []
              ).map((wagon: any) => ({
                wagon_id: wagon.wagon_id,
                action: wagon.action,
              })),
            };

            if (rp.train_no) {
              routeData.train_no = rp.train_no;
            }

            if (
              rp.usn_shift_route_planning_orders &&
              rp.usn_shift_route_planning_orders.length > 0
            ) {
              routeData.orders = rp.usn_shift_route_planning_orders.map(
                (order: any) => ({
                  order_id: order.order_id,
                })
              );
            }

            return routeData;
          });
        }
      }

      const formData = new FormData();
      formData.append("shift", JSON.stringify(updatePayload));

      await ProjectUSNShiftsService.updateProjectUSNShift(shift.id, formData);

      const updatedShift = {
        ...shift,
        locomotive_id: Number(locomotiveId),
      };

      onShiftsChange(
        allShifts.map((s) => (s.id === shift.id ? updatedShift : s))
      );

      toast.dismiss();
      toast.success("Locomotive updated successfully");
    } catch (error: any) {
      console.error("Error updating locomotive:", error);
      toast.dismiss();
      toast.error(
        error?.response?.data?.message || "Failed to update locomotive"
      );
    }
  };

  const renderRoleSelects = () => {
    // Get the product for this shift to access all roles
    const product = rawProducts.find(
      (p) => p.id?.toString() === shift.product_usn_id?.toString()
    );

    // Get all roles from the product
    const allProductRoles = product?.product_usn_personnel_roles || [];
    
    // Create a map of existing shift roles by role_id for quick lookup
    const existingRolesMap = new Map();
    shift?.usn_shift_roles?.forEach((role) => {
      existingRolesMap.set(role.role_id, role);
    });

    // Render all product roles, creating placeholder roles for ones that don't exist in the shift
    return allProductRoles.map((productRole: any) => {
      const roleId = productRole.personnel?.role_id;
      const existingRole = existingRolesMap.get(roleId);
      
      // Get role info from company roles
      const roleFromCompany = company?.roles?.find(
        (r: any) => r.id === roleId
      );

      // If role exists in shift, use it; otherwise create a placeholder
      if (existingRole) {
        return (
          <ProjectUSNRoleSelect
            key={existingRole.id}
            role={existingRole}
            shift={shift}
            onEmployeeChange={handleEmployeeChange}
          />
        );
      } else {
        // Create a placeholder role object for roles that don't exist in the shift yet
        const placeholderRole = {
          id: `placeholder-${roleId}`,
          usn_shift_id: shift.id,
          role_id: roleId,
          proximity: "NEARBY" as const,
          break_duration: "0",
          start_day: "NO" as const,
          usn_shift_personnels: [],
          role: {
            id: roleId,
            name: roleFromCompany?.name || `Role ${roleId}`,
            short_name: (roleFromCompany as any)?.short_name || (roleFromCompany?.name?.substring(0, 3).toUpperCase() || `R${roleId}`),
          },
        };

        return (
          <ProjectUSNRoleSelect
            key={placeholderRole.id}
            role={placeholderRole}
            shift={shift}
            onEmployeeChange={handleEmployeeChange}
          />
        );
      }
    });
  };

  const renderLocomotiveSelect = () => {
    if (!shift.has_locomotive) return null;

    const locomotivesList = allLocomotives || [];
    const currentLocomotive = locomotivesList.find(
      (loco) => loco.id?.toString() === shift.locomotive_id?.toString()
    );
    const locomotiveName = currentLocomotive?.name || "Select loc";

    return (
      <div
        className="flex items-center justify-start mt-1 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="flex items-center flex-shrink-0 mr-1">
          <Train size={18} className="mr-2 text-[#3E8258] flex-shrink-0" />
        </span>
        <div title={locomotiveName}>
          <SMSCombobox
            label=""
            placeholder="Select Locomotive"
            searchPlaceholder="Search loc..."
            value={shift.locomotive_id?.toString() || ""}
            onValueChange={(value) => handleLocomotiveChange(value)}
            options={locomotivesList.map((loco) => ({
              value: loco.id?.toString() || "",
              label: loco.name || "",
            }))}
            required
            className="w-fit h-2 min-h-3 m-0 text-[10px] bg-transparent border-none rounded-sm py-0 flex items-center hover:bg-transparent whitespace-nowrap overflow-hidden text-ellipsis px-0"
          />
        </div>
      </div>
    );
  };

  const handleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const isCheckboxClick =
      target instanceof HTMLInputElement && target.type === "checkbox";

    if (isCheckboxClick) {
      e.stopPropagation();
      onSelect(shift);
      return;
    }

    e.stopPropagation();
    if (onClick) {
      onClick(shift);
    }
  };

  const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    onSelect(shift);
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragStart) {
      onDragStart(shift);
    }
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.stopPropagation();
    if (onDragEnd) {
      onDragEnd();
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "OPEN":
        return "border-dashed border-2 border-gray-400 bg-white";
      case "OFFER":
        return "border-dashed border-2 border-gray-400 bg-white";
      case "PICK_UP_OFFER":
        return "border-dashed border-2 border-purple-400 bg-purple-50";
      case "PLANNED":
        return "bg-gray-200";
      case "FIXED":
        return "bg-blue-50";
      case "SUBMITTED":
        return "bg-orange-100";
      case "APPROVED":
        return "bg-yellow-100";
      case "BILLED":
        return "bg-green-100";
      case "REJECTED":
        return "bg-red-100";
      default:
        return "border-dashed border-2 border-gray-400 bg-white";
    }
  };

  const customerName =
    shift.product_usn?.customer?.name ||
    `Customer #${shift.product_usn?.customer_id || "N/A"}`;

  const formatTimeValue = (time: string | null | undefined) => {
    if (!time) return "00:00";
    const trimmed = time.toString().trim();
    if (/^\d{2}:\d{2}(:\d{2})?$/.test(trimmed)) {
      return trimmed.substring(0, 5);
    }
    if (!Number.isNaN(Date.parse(trimmed))) {
      return format(new Date(trimmed), "HH:mm");
    }
    return trimmed;
  };

  const formattedStart = formatTimeValue(shift.start_time);
  const formattedEnd = formatTimeValue(shift.end_time);

  const assistantStart = shift.assistantShift?.start_time
    ? formatTimeValue(shift.assistantShift.start_time)
    : null;
  const assistantEnd = shift.assistantShift?.end_time
    ? formatTimeValue(shift.assistantShift.end_time)
    : null;

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={handleClick}
      className={cn(
        "rounded-md py-2 mb-4 mx-auto cursor-pointer transition-all hover:opacity-90 text-xs text-[#000000] font-medium",
        "w-[100px] md:w-[100px] lg:w-[90px] xl:w-[120px] 2xl:w-[150px]",
        getStatusColor(shift.status),
        isSelected && "ring-2 ring-blue-500 ring-offset-1",
        isDragging && "opacity-50"
      )}
      style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 flex items-start justify-center w-6 pl-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 px-2 overflow-hidden space-y-1 text-xs">
          <div className="flex items-center">
            <Clock size={14} className="mr-2 text-[#3E8258] flex-shrink-0" />
            <span className="truncate">
              {assistantStart && assistantEnd
                ? `${assistantStart} - ${assistantEnd}`
                : `${formattedStart} - ${formattedEnd}`}
            </span>
          </div>

          {customerName && (
            <div className="flex items-center">
              <User size={18} className="mr-2 text-[#3E8258] flex-shrink-0" />
              <span className="truncate" title={customerName}>
                {customerName}
              </span>
            </div>
          )}

          {shift.product_usn && (
            <div className="flex items-center">
              <Package
                size={18}
                className="mr-2 text-[#3E8258] flex-shrink-0"
              />
              <span
                className="truncate"
                title={`Product USN #${shift.product_usn_id}`}
              >
                Product USN #{shift.product_usn_id}
              </span>
            </div>
          )}

          {shift.warehouse_location_id && (
            <div className="flex items-center">
              <MapPin size={18} className="mr-2 text-[#3E8258] flex-shrink-0" />
              <span
                className="truncate"
                title={`Warehouse #${shift.warehouse_location_id}`}
              >
                Warehouse #{shift.warehouse_location_id}
              </span>
            </div>
          )}

          {shift.has_locomotive && shift.locomotive && (
            <div className="flex items-center">
              <Train size={18} className="mr-2 text-[#3E8258] flex-shrink-0" />
              <span className="truncate" title={shift.locomotive.name}>
                {shift.locomotive.name}
              </span>
            </div>
          )}

          {!isEmployee && (
            <div className="overflow-hidden mt-1">
              {renderLocomotiveSelect()}
              {renderRoleSelects()}
            </div>
          )}

          <div className="flex items-center">
            <Calendar size={14} className="mr-2 text-[#3E8258] flex-shrink-0" />
            <span className="truncate">
              {format(new Date(shift.date), "dd/MM/yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
