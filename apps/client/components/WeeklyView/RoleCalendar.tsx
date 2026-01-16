import React from "react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { DayCell } from "@/components/Calendar/DayCell";
import { Shift } from "@/types/shift";
import { RoleFormData } from "@/types/role";
import { groupShiftsByDate } from "@/utils/calendar";
import StatusLegend from "../Calendar/StatusLegend";
import WeekSelector from "../Calendar/WeekSelector";
import { useTranslations } from "next-intl";
import { Locomotive } from "@/types/locomotive";

interface RoleCalendarProps {
  role: RoleFormData;
  currentDate: Date;
  weekDays: Date[];
  shifts: Shift[];
  allShifts: Shift[];
  selectedShifts: Shift[];
  onDateChange: (date: Date) => void;
  onShiftClick: (shift: Shift) => void;
  onShiftSelect: (shift: Shift) => void;
  onShiftsChange: (shifts: Shift[]) => void;
  products: any[];
  locomotives: Locomotive[];
}

export const RoleCalendar: React.FC<RoleCalendarProps> = ({
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
  products,
  locomotives,
}) => {
  const groupedShifts = groupShiftsByDate(shifts);
  const t = useTranslations("pages.calandar.days");
  const getRoleShifts = (date: Date, employeeId: number | null = null) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayShifts = groupedShifts[dateKey] || [];

    if (employeeId === null) {
      // For open shifts: has role but no employee
      return dayShifts.filter((shift) => shift.shiftRole?.some((sr) => Number(sr.role_id) === role.id && !sr.employee_id));
    }

    // For assigned employee shifts
    return dayShifts.filter((shift) => shift.shiftRole?.some((sr) => Number(sr.role_id) === role.id && sr.employee_id?.toString() === employeeId.toString()));
  };

  const isShiftAssigned = (shift: Shift) => {
    return shift.shiftRole?.some((sr) => sr.employee_id !== null);
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
        {" "}
        <div className="flex items-center space-x-4">
          <button onClick={handlePreviousWeek} className="font-medium text-[48px]">
            «
          </button>
          <WeekSelector currentDate={currentDate} onDateChange={onDateChange} />
          <button onClick={handleNextWeek} className="font-medium text-[48px]">
            »
          </button>
        </div>
        <StatusLegend />
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
          {/* Open Shifts Row */}
          <tr className="border-b hover:bg-gray-50">
            <td className="p-4 font-medium capitalize">Open {role.name} Shifts</td>
            {weekDays.map((date) => (
              <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                <DayCell
                  date={date}
                  shifts={getRoleShifts(date, null)}
                  allShifts={allShifts}
                  selectedShifts={selectedShifts}
                  onShiftClick={onShiftClick}
                  onShiftSelect={onShiftSelect}
                  onShiftsChange={onShiftsChange}
                  products={products}
                  employeeId={null}
                  disableUpdate={false}
                  calendarKey={`role_${role.id}_open`}
                  isOpenShiftCell={true}
                  locomotives={locomotives}
                />
              </td>
            ))}
          </tr>

          {/* Employee Rows */}
          {role.employees?.map((employee) => (
            <tr key={employee.id}>
              <td className="p-4 capitalize">{employee?.user?.name}</td>
              {weekDays.map((date) => (
                <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                  <DayCell
                    date={date}
                    shifts={getRoleShifts(date, employee.id)}
                    allShifts={allShifts}
                    selectedShifts={selectedShifts}
                    onShiftClick={onShiftClick}
                    onShiftSelect={onShiftSelect}
                    onShiftsChange={onShiftsChange}
                    products={products}
                    employeeId={employee.id}
                    disableUpdate={false}
                    calendarKey={`role_${role.id}`}
                    isOpenShiftCell={false}
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
