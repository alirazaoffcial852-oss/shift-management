import React from "react";
import { CheckCircle } from "lucide-react";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useRoleEmployees } from "@/hooks/employee/useRoleEmployees";
import { cn } from "@workspace/ui/lib/utils";
import { ProjectUSNShift } from "@/types/projectUsn";

interface ProjectUSNRoleSelectProps {
  role: any;
  shift: ProjectUSNShift;
  onEmployeeChange: (employeeId: string, roleId: string, shiftData: ProjectUSNShift) => void;
}

export const ProjectUSNRoleSelect: React.FC<ProjectUSNRoleSelectProps> = ({
  role,
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
  } = useRoleEmployees(
    role.role_id.toString(),
    role.usn_shift_personnels?.[0]?.employee
  );

  let employeeList = [...availableEmployees];

  if (role.usn_shift_personnels?.[0]?.employee) {
    const employeeExists = employeeList.some(
      (emp) =>
        emp.id?.toString() ===
        role.usn_shift_personnels[0].employee?.id?.toString()
    );
    if (!employeeExists) {
      employeeList = [
        role.usn_shift_personnels[0].employee,
        ...employeeList,
      ];
    }
  }

  const employeeName = role.usn_shift_personnels?.[0]?.employee_id
    ? `Employee #${role.usn_shift_personnels[0].employee_id}`
    : "Select employee";

  return (
    <div
      key={role.id}
      className="flex items-center justify-start mt-1 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      <CheckCircle
        size={14}
        className={cn(
          "mr-1",
          role.usn_shift_personnels?.[0]?.employee_id
            ? "text-green-600"
            : "text-gray-400"
        )}
      />

      <span
        className={cn(
          "flex items-center flex-shrink-0 mr-1",
          !role.usn_shift_personnels?.[0]?.employee_id && "text-red-500"
        )}
        title={role.role?.short_name || ""}
      >
        {role.role?.short_name || ""}:
      </span>

      <div title={employeeName}>
        <SMSCombobox
          label=""
          placeholder="Select Emp"
          searchPlaceholder="Search employee..."
          value={
            role.usn_shift_personnels?.[0]?.employee_id?.toString() || ""
          }
          onValueChange={(value) =>
            onEmployeeChange(value, role.role_id.toString(), shift)
          }
          options={employeeList.map((employee) => ({
            value: employee.id?.toString() || "",
            label: employee.name || `Emp #${employee.id}`,
          }))}
          required
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoading}
          onLoadMore={handleLoadMore}
          onSearch={handleSearch}
          onOpen={initialize}
          className="w-fit h-2 min-h-3 m-0 text-[10px] bg-transparent border-none rounded-sm py-0 flex items-center hover:bg-transparent whitespace-nowrap overflow-hidden text-ellipsis px-0"
        />
      </div>
    </div>
  );
};
