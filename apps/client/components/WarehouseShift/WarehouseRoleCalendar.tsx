import React from "react";
import { format, addWeeks, subWeeks } from "date-fns";
import { ProjectUSNShiftDayCell } from "../ProjectUSNCalendar/ProjectUSNShiftDayCell";
import { ProjectUSNShift } from "@/types/projectUsn";
import { RoleFormData } from "@/types/role";
import { groupShiftsByDate } from "@/utils/projectUsnCalendar";
import WarehouseShiftStatusLegend from "../ProjectUSNCalendar/WarehouseShiftStatusLegend";
import WeekSelector from "../../app/[locale]/shift-management/project-usn-shifts/warehouse-shifts/(views)/weekly/components/WeekSelector";
import { useTranslations } from "next-intl";
import { Locomotive } from "@/types/locomotive";

interface WarehouseRoleCalendarProps {
  role: RoleFormData;
  currentDate: Date;
  weekDays: Date[];
  shifts: ProjectUSNShift[];
  allShifts: ProjectUSNShift[];
  selectedShifts: ProjectUSNShift[];
  onDateChange: (date: Date) => void;
  onShiftClick: (shift: ProjectUSNShift) => void;
  onShiftSelect: (shift: ProjectUSNShift) => void;
  onShiftsChange: (shifts: ProjectUSNShift[]) => void;
  onDragStart?: (shift: ProjectUSNShift) => void;
  onDragEnd?: () => void;
  onDrop?: (date: Date) => void;
  draggedShift?: ProjectUSNShift | null;
  onDeleteShift?: (shiftId: number) => void;
  locomotives: Locomotive[];
}

export const WarehouseRoleCalendar: React.FC<WarehouseRoleCalendarProps> = ({
  role,
  currentDate,
  weekDays,
  shifts,
  allShifts,
  selectedShifts,
  onDateChange,
  onShiftClick,
  onShiftSelect,
  onShiftsChange,
  onDragStart,
  onDragEnd,
  onDrop,
  draggedShift,
  onDeleteShift,
  locomotives,
}) => {
  const groupedShifts = groupShiftsByDate(shifts);
  const t = useTranslations("pages.calandar.days");

  const getRoleShifts = (date: Date, employeeId: number | null = null) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayShifts = groupedShifts[dateKey] || [];

    if (employeeId === null) {
      return dayShifts.filter((shift) =>
        shift.usn_shift_roles?.some(
          (sr) =>
            Number(sr.role_id) === role.id &&
            (!sr.usn_shift_personnels || sr.usn_shift_personnels.length === 0)
        )
      );
    }

    return dayShifts.filter((shift) =>
      shift.usn_shift_roles?.some(
        (sr) =>
          Number(sr.role_id) === role.id &&
          sr.usn_shift_personnels?.some(
            (personnel: { employee_id: { toString: () => string } }) =>
              personnel.employee_id?.toString() === employeeId.toString()
          )
      )
    );
  };

  const handlePreviousWeek = () => {
    onDateChange(subWeeks(currentDate, 1));
  };

  const handleNextWeek = () => {
    onDateChange(addWeeks(currentDate, 1));
  };

  return (
    <div className="w-full max-w-full bg-white shadow-2xl rounded-[32px] overflow-x-auto px-[60px] py-[32px]">
      <div className="flex justify-between mb-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousWeek}
            className="font-medium text-[48px]"
          >
            «
          </button>
          <WeekSelector currentDate={currentDate} onDateChange={onDateChange} />
          <button onClick={handleNextWeek} className="font-medium text-[48px]">
            »
          </button>
        </div>
        <WarehouseShiftStatusLegend />
      </div>
      <div className="py-2 flex justify-between items-center">
        <h3 className="text-xl font-bold capitalize">{role.name}</h3>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="p-4 text-left min-w-[200px]">Employees</th>
            {weekDays.map((date) => (
              <th key={format(date, "yyyy-MM-dd")} className="p-2">
                {t(format(date, "EEEE"))}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b hover:bg-gray-50">
            <td className="p-4 font-medium capitalize">
              Open {role.name} Shifts
            </td>
            {weekDays.map((date) => (
              <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                <ProjectUSNShiftDayCell
                  date={date}
                  shifts={getRoleShifts(date, null)}
                  allShifts={allShifts}
                  selectedShifts={selectedShifts}
                  onShiftClick={onShiftClick}
                  onShiftSelect={onShiftSelect}
                  onShiftsChange={onShiftsChange}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onDrop={onDrop}
                  draggedShift={draggedShift}
                  onDeleteShift={onDeleteShift}
                  locomotives={locomotives}
                />
              </td>
            ))}
          </tr>

          {role.employees?.map((employee) => (
            <tr key={employee.id}>
              <td className="p-4 capitalize">{employee?.user?.name}</td>
              {weekDays.map((date) => (
                <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                  <ProjectUSNShiftDayCell
                    date={date}
                    shifts={getRoleShifts(date, employee.id)}
                    allShifts={allShifts}
                    selectedShifts={selectedShifts}
                    onShiftClick={onShiftClick}
                    onShiftSelect={onShiftSelect}
                    onShiftsChange={onShiftsChange}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDrop={onDrop}
                    draggedShift={draggedShift}
                    onDeleteShift={onDeleteShift}
                    locomotives={locomotives}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
