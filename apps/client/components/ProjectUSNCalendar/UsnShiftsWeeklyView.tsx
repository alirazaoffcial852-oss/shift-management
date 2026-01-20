"use client";
import React from "react";
import { format } from "date-fns";
import { getWeekDays } from "@/utils/projectUsnCalendar";
import { useProjectUSNCalendar } from "@/hooks/projectUsnShifts/useProjectUSNCalendar";
import { ProjectUSNShift } from "@/types/projectUsn";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useRoleManager } from "@/hooks/role/useRole";
import { ProjectUSNShiftDayCell } from "./ProjectUSNShiftDayCell";
import { groupShiftsByDate } from "@/utils/projectUsnCalendar";
import WeekSelector from "../../app/[locale]/shift-management/project-usn-shifts/usn-shifts/(views)/weekly/components/WeekSelector";
import { useTranslations } from "next-intl";
import UsnShiftStatusLegend from "./UsnShiftStatusLegend";

export default function UsnShiftsWeeklyView() {
  const {
    currentDate,
    selectedShifts,
    shifts,
    setShifts,
    handleShiftClick,
    handleShiftSelect,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteShift,
    draggedShift,
    handlePreviousWeek,
    handleNextWeek,
    handleWeekDateChange,
  } = useProjectUSNCalendar("weekly");

  const { locomotives } = useLocomotiveTable();
  const { existingRoles } = useRoleManager({
    actAs: "EMPLOYEE",
    withSearch: true,
    forDropdown: true,
    initialLimit: 20,
  });

  const handleWeekChange = (date: Date) => {
    if (handleWeekDateChange) {
      handleWeekDateChange(date);
    }
  };

  const t = useTranslations("pages.calandar.days");
  const weekDays = getWeekDays(currentDate);

  const usnShifts = shifts.filter((shift) => shift.has_route_planning);
  const groupedShifts = groupShiftsByDate(usnShifts || []);

  const getLocomotiveShifts = (
    date: Date,
    locomotiveId: number | null = null
  ) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayShifts = groupedShifts[dateKey] || [];

    if (locomotiveId === null) {
      return dayShifts.filter(
        (shift: ProjectUSNShift) => shift.has_locomotive && !shift.locomotive_id
      );
    }

    return dayShifts.filter(
      (shift) =>
        shift.locomotive_id !== undefined &&
        Number(shift.locomotive_id) === locomotiveId
    );
  };

  const getRoleShifts = (
    date: Date,
    roleId: number | null = null,
    employeeId: number | null = null
  ) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const dayShifts = groupedShifts[dateKey] || [];

    if (roleId === null) {
      return dayShifts.filter(
        (shift) =>
          shift.usn_shift_roles?.some((role) => !role.role_id) ||
          (shift.usn_shift_roles && shift.usn_shift_roles.length === 0)
      );
    }

    return dayShifts.filter((shift) =>
      shift.usn_shift_roles?.some((role) => {
        if (Number(role.role_id) !== roleId) return false;

        if (employeeId !== null) {
          return role.usn_shift_personnels?.some(
            (personnel: { employee_id: any; }) => Number(personnel.employee_id) === employeeId
          );
        }

        return (
          !role.usn_shift_personnels || role.usn_shift_personnels.length === 0
        );
      })
    );
  };

  return (
    <div className="w-full">
      {locomotives && locomotives.length > 0 && (
        <div className="mb-8">
          <div className="w-full max-w-full bg-white shadow-2xl rounded-[32px] overflow-x-auto px-[50px] py-[32px]">
            <div className="py-2 flex justify-between items-center">
              <div className="flex items-center">
                <button
                  onClick={handlePreviousWeek}
                  className="font-medium text-[48px]"
                >
                  «
                </button>
                <WeekSelector
                  currentDate={currentDate}
                  onDateChange={handleWeekChange}
                />
                <button
                  onClick={handleNextWeek}
                  className="font-medium text-[48px]"
                >
                  »
                </button>
              </div>
              <UsnShiftStatusLegend />
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left min-w-[200px]">Locomotives</th>
                  {weekDays.map((date) => (
                    <th
                      key={format(date, "yyyy-MM-dd")}
                      className="p-2 w-[100px] md:w-[100px] lg:w-[90px] xl:w-[150px] 2xl:w-[200px] mx-auto"
                    >
                      {t(format(date, "EEEE"))}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 overflow-x-auto">
                  <td className="p-4 font-medium">Open Locomotive Shifts</td>
                  {weekDays.map((date) => (
                    <td key={format(date, "yyyy-MM-dd")} className="p-0 border">
                      <ProjectUSNShiftDayCell
                        date={date}
                        shifts={getLocomotiveShifts(date, null)}
                        allShifts={usnShifts}
                        selectedShifts={selectedShifts}
                        onShiftsChange={setShifts}
                        onShiftClick={handleShiftClick}
                        onShiftSelect={handleShiftSelect}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        draggedShift={draggedShift}
                        onDeleteShift={handleDeleteShift}
                        locomotives={locomotives}
                        locomotiveId={null}
                      />
                    </td>
                  ))}
                </tr>

                {locomotives.map((locomotive) => (
                  <tr
                    key={locomotive.id}
                    className="border-b hover:bg-gray-50 overflow-x-auto"
                  >
                    <td className="p-4">{locomotive.name}</td>
                    {weekDays.map((date) => (
                      <td
                        key={format(date, "yyyy-MM-dd")}
                        className="p-0 border"
                      >
                        <ProjectUSNShiftDayCell
                          date={date}
                          shifts={getLocomotiveShifts(date, locomotive.id ?? 0)}
                          allShifts={usnShifts}
                          selectedShifts={selectedShifts}
                          onShiftsChange={setShifts}
                          onShiftClick={handleShiftClick}
                          onShiftSelect={handleShiftSelect}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop}
                          draggedShift={draggedShift}
                          onDeleteShift={handleDeleteShift}
                          locomotives={locomotives}
                          locomotiveId={locomotive.id ?? null}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {existingRoles?.map((role) => (
        <div key={role.id} className="mb-8">
          <div className="w-full max-w-full bg-white shadow-2xl rounded-[32px] overflow-x-auto px-[30px] py-[32px]">
            <div className="flex justify-between mb-4">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handlePreviousWeek}
                  className="font-medium text-[48px]"
                >
                  «
                </button>
                <WeekSelector
                  currentDate={currentDate}
                  onDateChange={handleWeekChange}
                />
                <button
                  onClick={handleNextWeek}
                  className="font-medium text-[48px]"
                >
                  »
                </button>
              </div>
              <UsnShiftStatusLegend />
            </div>
            <div className="py-2 flex justify-between items-center">
              <h3 className="text-xl font-bold capitalize">{role.name}</h3>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left min-w-[200px]">Employees</th>
                  {weekDays.map((date) => (
                    <th
                      key={format(date, "yyyy-MM-dd")}
                      className="p-2 w-[100px] md:w-[100px] lg:w-[90px] xl:w-[150px] 2xl:w-[200px] mx-auto"
                    >
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
                        shifts={getRoleShifts(date, role.id ?? null, null)}
                        allShifts={usnShifts}
                        selectedShifts={selectedShifts}
                        onShiftsChange={setShifts}
                        onShiftClick={handleShiftClick}
                        onShiftSelect={handleShiftSelect}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        draggedShift={draggedShift}
                        onDeleteShift={handleDeleteShift}
                        locomotives={locomotives}
                        roleId={role.id ?? null}
                        employeeId={null}
                      />
                    </td>
                  ))}
                </tr>

                {role.employees?.map((employee) => (
                  <tr key={employee.id}>
                    <td className="p-4 capitalize">{employee?.user?.name}</td>
                    {weekDays.map((date) => (
                      <td
                        key={format(date, "yyyy-MM-dd")}
                        className="p-0 border"
                      >
                        <ProjectUSNShiftDayCell
                          date={date}
                          shifts={getRoleShifts(
                            date,
                            role.id ?? null,
                            employee.id ?? null
                          )}
                          allShifts={usnShifts}
                          selectedShifts={selectedShifts}
                          onShiftsChange={setShifts}
                          onShiftClick={handleShiftClick}
                          onShiftSelect={handleShiftSelect}
                          onDragStart={handleDragStart}
                          onDragEnd={handleDragEnd}
                          onDrop={handleDrop}
                          draggedShift={draggedShift}
                          onDeleteShift={handleDeleteShift}
                          locomotives={locomotives}
                          roleId={role.id ?? null}
                          employeeId={employee.id ?? null}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
