import React from "react";
import { CheckCircle } from "lucide-react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useRoleEmployees } from "@/hooks/employee/useRoleEmployees";
import { cn } from "@workspace/ui/lib/utils";
import { Shift } from "@/types/shift";
import { Employee } from "@/types/employee";

interface RoleSelectProps {
  roleData: any;
  shift: Shift;
  onEmployeeChange: (employeeId: string, shiftRoleId: string, shiftData: Shift) => void;
}

export const RoleSelect: React.FC<RoleSelectProps> = ({
  roleData,
  shift,
  onEmployeeChange,
}) => {
  const {
    employees: availableEmployees,
    isLoading,
    pagination,
    handleSearch,
    handleLoadMore,
    initialize,
  } = useRoleEmployees(roleData?.role?.id, roleData.employee);

  let employeeList = [...availableEmployees];

  if (roleData?.employee) {
    const employeeExists = employeeList.some(
      (emp) => emp.id?.toString() === roleData.employee?.id?.toString()
    );
    if (!employeeExists) {
      employeeList = [roleData.employee, ...employeeList];
    }
  }

  const employeeName =
    employeeList.find(
      (employee) =>
        employee.id?.toString() === roleData?.employee_id?.toString()
    )?.name || "Select employee";

  return (
    <div
      key={roleData.id}
      className="flex items-center justify-start mt-1 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <CheckCircle
        size={14}
        className={cn(
          "mr-1",
          roleData?.has_submitted_timesheet ? "text-green-600" : "text-gray-400"
        )}
      />

      <span
        className={cn(
          "flex items-center flex-shrink-0 mr-1",
          !roleData?.employee_id && "text-red-500"
        )}
        title={roleData?.role?.short_name || ""}
      >
        {roleData?.role?.short_name || ""}:
      </span>

      <div title={employeeName}>
        <SMSCombobox
          label=""
          placeholder="Select Emp"
          searchPlaceholder="Search employee..."
          value={roleData?.employee_id?.toString()}
          onValueChange={(value) =>
            onEmployeeChange(value, roleData?.id, shift)
          }
          options={employeeList.map((employee) => ({
            value: employee.id?.toString() || "",
            label: employee.name || "",
          }))}
          required
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoading}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
          onOpen={initialize}
          className="w-fit h-2 min-h-3  m-0 text-[10px] bg-transparent border-none rounded-sm py-0 flex items-center hover:bg-transparent whitespace-nowrap overflow-hidden text-ellipsis px-0"
        />
      </div>
    </div>
  );
};
