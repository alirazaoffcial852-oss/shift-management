import React, { useState } from "react";
import { Shift } from "@/types/shift";
import { format } from "date-fns";
import {
  CheckCircle,
  User,
  Briefcase,
  Package,
  MapPin,
  Clock,
  Check,
  Train,
  Ellipsis,
  FileText,
  File,
} from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  ContextMenu,
  ContextMenuTrigger,
} from "@workspace/ui/components/context-menu";
import { ShiftActions } from "./ShiftActions";
import { ViewShift } from "./ViewShift";
import { useConfirmation } from "@/providers/ConfirmationProvider";
import { cn } from "@workspace/ui/lib/utils";
import { updateShiftData } from "@/utils/shiftUpdate";
import { AssignShift } from "../Dialog/ShiftAssignDialog";
import { Product } from "@/types/product";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useStatusIdentifiers } from "@/hooks/shiftStatusList";
import { RoleSelect } from "./RoleSelect";
import { useAuth } from "@/providers/appProvider";
import { Locomotive } from "@/types/locomotive";
import { useRouter } from "next/navigation";
import { BulkShiftActions } from "./BulkShiftActions";

interface ShiftEventProps {
  shift: Shift;
  onShiftsChange: (shifts: Shift[]) => void;
  selectedShifts: Shift[];
  onShiftSelect: (shift: Shift) => void;
  allShifts: Shift[];
  onClick?: (shift: Shift) => void;
  isSelected: boolean;
  onSelect: (shift: Shift) => void;
  products: Product[];
  locomotives: Locomotive[];
}

export const ShiftEvent = ({
  shift,
  isSelected,
  onSelect,
  products,
  allShifts,
  onShiftsChange,
  selectedShifts,
  onShiftSelect,
  locomotives,
}: ShiftEventProps) => {
  const { showConfirmation } = useConfirmation();
  const { isEmployee, user } = useAuth();
  const router = useRouter();
  let employee = user?.employeeId;
  const [isLocomotiveDialogOpen, setIsLocomotiveDialogOpen] = useState(false);
  const [selectedLocomotive, setSelectedLocomotive] = useState<string | null>(
    null
  );
  const [selectedAssignShifts, setSelectedAssignShifts] = useState<Shift[]>([]);
  const [isViewShiftOpen, setIsViewShiftOpen] = useState(false);
  const [assignDialog, setAssignDialog] = useState(false);

  // useEffect(() => {
  //   if (isEmployee && employee && shift.shiftRole) {
  //     const employeeRole = shift.shiftRole.find(
  //       (role) => role.employee_id?.toString() === employee?.toString()
  //     );

  //     if (
  //       employeeRole &&
  //       employeeRole.has_submitted_timesheet &&
  //       shift.status !== "SUBMITTED"
  //     ) {
  //       const updatedShift = {
  //         ...shift,
  //         status: "SUBMITTED" as STATUS,
  //       };

  //       onShiftsChange(
  //         allShifts.map((s: Shift) =>
  //           s.id?.toString() === shift.id?.toString() ? updatedShift : s
  //         )
  //       );

  //       updateShiftData([updatedShift]);
  //     }
  //   }
  // }, []);

  const normalizeProjectFields = (shiftData: Shift): Shift => {
    console.log(shiftData, "shiftData");
    const normalizeValue = (value: any) =>
      value === undefined || value === null || Number(value) === 0
        ? null
        : value;

    return {
      ...shiftData,
      project_id: normalizeValue(shiftData.project_id),
      bv_project_id: normalizeValue(shiftData.bv_project_id),
    };
  };

  const handleEmployeeChange = async (
    employeeId: string,
    shiftRoleId: string,
    shiftData: Shift
  ) => {
    const updatedShift = normalizeProjectFields({
      ...shiftData,
      shiftRole:
        shiftData.shiftRole?.map((role: any) =>
          role.id === shiftRoleId
            ? { ...role, employee_id: Number(employeeId) }
            : role
        ) || [],
    });

    onShiftsChange(
      allShifts.map((s: Shift) =>
        s.id?.toString() === shiftData.id?.toString() ? updatedShift : s
      )
    );

    handleShiftEmployeeUpdate(updatedShift);
  };

  const confirmEmployeeChange = async (updatedShift: Shift) => {
    const success = await updateShiftData([
      normalizeProjectFields(updatedShift),
    ]);
    if (!success) {
      onShiftsChange(
        allShifts.map((s: Shift) =>
          s.id?.toString() === shift.id?.toString() ? shift : s
        )
      );
    }
  };

  const handleLocomotiveChange = (locomotiveId: string) => {
    setSelectedLocomotive(locomotiveId);
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
    const updatedShift = {
      ...shift,
      locomotive_id: locomotiveId,
    };

    onShiftsChange(
      allShifts.map((s: Shift) =>
        s.id?.toString() === shift.id?.toString() ? (updatedShift as Shift) : s
      )
    );

    const success = await updateShiftData([updatedShift as Shift]);
    if (!success) {
      onShiftsChange(
        allShifts.map((s: Shift) =>
          s.id?.toString() === shift.id?.toString() ? shift : s
        )
      );
    }
  };

  const statusList = useStatusIdentifiers();
  const status = statusList.find((s) => s.id === shift.status.toUpperCase());

  const location = shift.shiftDetail?.location || "";

  const hasSelectedShifts = selectedShifts?.length > 0;

  const handleSelect = (checked: boolean) => {
    if (shift) {
      onSelect?.(shift);
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleShiftEmployeeUpdate = (updatedShift: Shift) => {
    showConfirmation({
      title: "Update Shift Employee",
      description:
        "Are you sure you want to change the employee for this shift?",
      confirmText: "Update",
      variant: "default",
      onConfirm: () => confirmEmployeeChange(updatedShift),
    });
  };

  const handleDragStart = (e: React.DragEvent) => {
    if (isEmployee) return;
    e.dataTransfer.setData("shiftId", shift.id?.toString() || "");

    // Add current locomotive ID to drag data if it exists
    if (shift.locomotive_id) {
      e.dataTransfer.setData(
        "currentLocomotiveId",
        shift.locomotive_id.toString()
      );
    }

    const roleIds =
      shift.shiftRole?.map((role) => role.role_id.toString()) || [];
    e.dataTransfer.setData("roleIds", JSON.stringify(roleIds));

    // Add isAssigned flag to drag data
    const isAssigned =
      shift.shiftRole?.some((role) => role.employee_id !== null) || false;
    e.dataTransfer.setData("isAssigned", isAssigned.toString());

    // Add current employee ID to drag data
    const currentEmployeeId = shift.shiftRole?.find(
      (role) => role.employee_id
    )?.employee_id;
    if (currentEmployeeId) {
      e.dataTransfer.setData("currentEmployeeId", currentEmployeeId.toString());
    }
  };

  const renderRoleSelects = () => {
    return shift?.shiftRole?.map((data: any) => (
      <RoleSelect
        key={data.id}
        roleData={data}
        shift={shift}
        onEmployeeChange={handleEmployeeChange}
      />
    ));
  };
  const renderLocomotiveSelect = () => {
    if (!shift?.shiftDetail?.has_locomotive) return null;

    const locomotivesList = locomotives || [];
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

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="relative">
            <div
              draggable={!isEmployee}
              onDragStart={handleDragStart}
              onClick={(e) => {
                router.push(
                  `/shift-management/regular-shifts/monthly/${shift?.id}`
                );
                // if (!(e.target as HTMLElement).closest(".SMSCombobox")) {
                //   setIsViewShiftOpen(true);
                // }
              }}
              className={cn(
                "group relative rounded-md py-2 mb-4 w-[100px]  md:w-[100px] lg:w-[90px] xl:w-[120px] 2xl:w-[150px]   mx-auto h-full",
                isEmployee ? "cursor-pointer" : "cursor-move",
                "hover:opacity-90 transition-all text-xs text-[#000000] font-medium",
                status?.colorCode
              )}
              style={{ boxShadow: "0px 4px 4px 0px rgba(0,0,0,0.25)" }}
            >
              {!shift.shiftDetail.has_note && (
                <span className="flex items-center text-xs px-4 mb-2 mt-2 text-red-600 gap-1">
                  <FileText size={14} className="text-red-600" />
                  No notes
                </span>
              )}
              {shift?.shiftDocument?.length === 0 && (
                <span className="flex items-center text-xs px-4 mb-2 mt-2 text-red-600 gap-1">
                  <File size={14} className="text-red-600" />
                  No documents
                </span>
              )}
              <div className="flex items-start">
                <div
                  onClick={handleCheckboxClick}
                  className={cn(
                    "transition-all duration-200 flex-shrink-0 flex items-start justify-center",
                    selectedShifts?.length > 0
                      ? "opacity-100 w-6 pl-1"
                      : "opacity-0 w-0 pl-1 group-hover:opacity-100 group-hover:w-6"
                  )}
                >
                  <Checkbox
                    id="apply_to_all"
                    tickColor="#FFFFFF"
                    bgColor="#3E8258"
                    checked={isSelected}
                    onCheckedChange={handleSelect}
                    className="min-w-[20px]"
                  />
                </div>

                <div className="flex-1 px-3 overflow-hidden">
                  {shift.status === "BILLED" && (
                    <div className="absolute top-0 right-0 p-1">
                      <CheckCircle size={12} className="text-green-600" />
                    </div>
                  )}

                  <div className="flex items-center">
                    <Clock
                      size={14}
                      className="mr-2 text-[#3E8258] flex-shrink-0"
                    />
                    <span
                      className="truncate"
                      title={`${shift.start_time ? format(new Date(shift.start_time.replace("Z", "")), "HH:mm") : "N/A"} - ${shift.end_time ? format(new Date(shift.end_time.replace("Z", "")), "HH:mm") : "N/A"}`}
                    >
                      {shift.start_time
                        ? format(
                            new Date(shift.start_time.replace("Z", "")),
                            "HH:mm"
                          )
                        : "N/A"}
                    </span>
                    <span className="mx-1">-</span>
                    <span className="truncate">
                      {shift.end_time
                        ? format(
                            new Date(shift.end_time.replace("Z", "")),
                            "HH:mm"
                          )
                        : "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <User
                      size={18}
                      className="mr-2 text-[#3E8258] flex-shrink-0"
                    />
                    <span
                      className="truncate"
                      title={shift.customer?.name || ""}
                    >
                      {shift.customer?.name || ""}
                    </span>
                  </div>

                  {shift.project && (
                    <div className="flex items-center">
                      <Briefcase
                        size={18}
                        className="mr-2 text-[#3E8258] flex-shrink-0"
                      />
                      <span className="truncate" title={shift.project.name}>
                        {shift.project.name}
                      </span>
                    </div>
                  )}

                  {shift.product && (
                    <div className="flex items-center">
                      <Package
                        size={18}
                        className="mr-2 text-[#3E8258] flex-shrink-0"
                      />
                      <span className="truncate" title={shift.product.name}>
                        {shift.product.name}
                      </span>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center">
                      <MapPin
                        size={18}
                        className="mr-2 text-[#3E8258] flex-shrink-0"
                      />
                      <span className="truncate" title={location}>
                        {location?.slice(0, 10)}
                      </span>
                    </div>
                  )}

                  {!isEmployee && (
                    <div className="overflow-hidden">
                      {" "}
                      {renderLocomotiveSelect()}
                      {renderRoleSelects()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        {hasSelectedShifts ? (
          <BulkShiftActions
            selectedShifts={selectedShifts}
            onOpenDialog={() => {
              setAssignDialog(true);
              setSelectedAssignShifts(
                JSON.parse(JSON.stringify(selectedShifts))
              );
            }}
          />
        ) : (
          <ShiftActions
            shift={shift}
            allShifts={allShifts}
            setIsViewShiftOpen={setIsViewShiftOpen}
            setAssignDialog={setAssignDialog}
            setSelectedAssignShifts={(allShifts: Shift[]) => {
              setSelectedAssignShifts(allShifts);
            }}
          />
        )}
      </ContextMenu>

      <ViewShift
        shift={shift}
        isOpen={isViewShiftOpen}
        onClose={() => setIsViewShiftOpen(false)}
      />
      <AssignShift
        open={assignDialog}
        onClose={() => {
          setAssignDialog(false);
          // onShiftSelect();
          setSelectedAssignShifts([]);
        }}
        shifts={allShifts}
        onShiftsChange={onShiftsChange}
        products={products}
        selectedAssignShifts={selectedAssignShifts}
        setSelectedAssignShifts={setSelectedAssignShifts}
      />
    </>
  );
};
