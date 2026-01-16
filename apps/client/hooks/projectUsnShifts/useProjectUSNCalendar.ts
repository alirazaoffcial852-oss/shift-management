import { useState, useEffect, useCallback } from "react";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  addWeeks,
  subWeeks,
  startOfWeek,
  endOfWeek,
  format,
} from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ProjectUSNShift } from "@/types/projectUsn";
import { useRouter, useSearchParams } from "next/navigation";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { useCompany } from "@/providers/appProvider";
import { toast } from "sonner";

export const useProjectUSNCalendar = (
  view?: "weekly" | "monthly",
  shiftType?: "usn" | "warehouse"
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { company } = useCompany();

  const initializeDate = () => {
    const yearParam = searchParams.get("year");
    const monthParam = searchParams.get("month");

    if (yearParam && monthParam) {
      const year = parseInt(yearParam);
      const month = parseInt(monthParam) - 1;
      return new Date(year, month, 1);
    }
    return new Date();
  };

  const [currentDate, setCurrentDate] = useState<Date>(initializeDate);
  const [totalDays, setTotalDays] = useState<number[]>([]);
  const [skipDays, setSkipDays] = useState<number[]>([]);
  const [currentMonth, setCurrentMonth] = useState<string>("");
  const [selectedShifts, setSelectedShifts] = useState<ProjectUSNShift[]>([]);
  const [shifts, setShifts] = useState<ProjectUSNShift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [draggedShift, setDraggedShift] = useState<ProjectUSNShift | null>(
    null
  );

  const fetchShifts = useCallback(async () => {
    setIsLoading(true);
    try {
      const monthStart = startOfMonth(currentDate);
      const from = format(monthStart, "yyyy-MM-dd");
      const toDate = new Date(
        monthStart.getFullYear(),
        monthStart.getMonth() + 1,
        0
      );
      const to = format(toDate, "yyyy-MM-dd");

      const response =
        await ProjectUSNShiftsService.getAllProjectUSNShiftsByDate(
          from,
          to,
          company?.id
        );
      if (response?.data && Array.isArray(response.data)) {
        const filteredShifts = response.data.filter((shift: any) => {
          if (shiftType === "usn") {
            return (
              shift.has_route_planning === true ||
              shift.status === "PICK_UP_OFFER"
            );
          } else if (shiftType === "warehouse") {
            return (
              shift.has_route_planning === false &&
              shift.status !== "PICK_UP_OFFER"
            );
          }
          return true;
        });

        const formattedShifts = filteredShifts.map((shift: any) => {
          const shiftDate = new Date(shift.date);
          const assistantShift =
            shift.assistant_shift || shift.assistantShift || null;

          const formattedAssistantShift = assistantShift
            ? {
                start_time: assistantShift.start_time
                  ? formatInTimeZone(
                      assistantShift.start_time,
                      "UTC",
                      "HH:mm"
                    )
                  : undefined,
                end_time: assistantShift.end_time
                  ? formatInTimeZone(assistantShift.end_time, "UTC", "HH:mm")
                  : undefined,
              }
            : undefined;

          return {
            ...shift,
            assistantShift: formattedAssistantShift,
            date: format(shiftDate, "yyyy-MM-dd"),
            start_time: shift.start_time
              ? formatInTimeZone(shift.start_time, "UTC", "HH:mm")
              : "00:00",
            end_time: shift.end_time
              ? formatInTimeZone(shift.end_time, "UTC", "HH:mm")
              : "00:00",
          };
        });

        setShifts(formattedShifts);
      }
    } catch (error) {
      console.error("Error fetching USN shifts:", error);
      toast.error("Failed to fetch USN shifts");
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, currentDate, shiftType]);

  const updateUrlWithDate = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth() + 1;

      const params = new URLSearchParams(searchParams.toString());
      params.set("year", year.toString());
      params.set("month", month.toString());

      setTimeout(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      }, 0);
    },
    [router, searchParams]
  );

  const handlePreviousMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() - 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextMonth = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(
        prevDate.getFullYear(),
        prevDate.getMonth() + 1,
        1
      );
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handlePreviousWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = subWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleNextWeek = useCallback(() => {
    setCurrentDate((prevDate) => {
      const newDate = addWeeks(prevDate, 1);
      updateUrlWithDate(newDate);
      return newDate;
    });
  }, [updateUrlWithDate]);

  const handleMonthYearSelect = useCallback(
    (year: number, month: number) => {
      const newDate = new Date(year, month, 1);
      setCurrentDate(newDate);
      updateUrlWithDate(newDate);
    },
    [updateUrlWithDate]
  );

  const handleShiftClick = useCallback(
    (shift: ProjectUSNShift) => {
      const currentPath = window.location.pathname;
      let currentView = "monthly";

      if (currentPath.includes("/weekly")) {
        currentView = "weekly";
      }
      const shiftType = shift.has_route_planning
        ? "usn-shifts"
        : "warehouse-shifts";

      router.push(
        `/shift-management/project-usn-shifts/${shiftType}/${currentView}/${shift.id}?returnTo=${currentView}`
      );
    },
    [router]
  );

  const handleShiftSelect = useCallback((shift: ProjectUSNShift) => {
    setSelectedShifts((prev) => {
      const isSelected = prev.some((s) => s.id === shift.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== shift.id);
      } else {
        return [...prev, shift];
      }
    });
  }, []);

  const clearSelectedShifts = useCallback(() => {
    setSelectedShifts([]);
  }, []);

  const handleDragStart = useCallback((shift: ProjectUSNShift) => {
    setDraggedShift(shift);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedShift(null);
  }, []);

  const handleDrop = useCallback(
    async (
      targetDate: Date,
      roleId?: number,
      employeeId?: number,
      locomotiveId?: number
    ) => {
      if (!draggedShift) return;

      const newDate = format(targetDate, "yyyy-MM-dd");
      const oldDate = format(new Date(draggedShift.date), "yyyy-MM-dd");
      const dateChanged = newDate !== oldDate;

      const currentEmployeeId = draggedShift.usn_shift_roles?.find(
        (role) => roleId !== undefined && role.role_id === roleId
      )?.usn_shift_personnels?.[0]?.employee_id;

      const currentLocomotiveId = draggedShift.locomotive_id;

      const employeeChanged =
        employeeId !== undefined &&
        Number(employeeId) !== Number(currentEmployeeId);
      const locomotiveChanged =
        locomotiveId !== undefined &&
        Number(locomotiveId) !== Number(currentLocomotiveId);

      const assignmentChanged = employeeChanged || locomotiveChanged;

      const isVerticalDrag = !dateChanged && assignmentChanged;
      const isHorizontalDrag = dateChanged && !assignmentChanged;

      try {
        if (isVerticalDrag) {
          if (roleId !== undefined && employeeId !== undefined) {
            const currentRole = draggedShift.usn_shift_roles?.find(
              (role) => role.role_id === roleId
            );

            if (currentRole) {
              const formData = new FormData();
              const payload = [
                {
                  usn_shift_id: draggedShift.id,
                  shiftRole: [
                    {
                      employee_id: employeeId,
                      proximity: currentRole.proximity,
                      break_duration: currentRole.break_duration,
                      start_day: currentRole.start_day,
                    },
                  ],
                },
              ];

              formData.append("assign_usn_shifts", JSON.stringify(payload));

              const response =
                await ProjectUSNShiftsService.assignEmployeeToUSNShift(
                  formData
                );

              setShifts((prevShifts) =>
                prevShifts.map((shift) => {
                  if (shift.id === draggedShift.id) {
                    return {
                      ...shift,
                      usn_shift_roles: shift.usn_shift_roles?.map((role) => {
                        if (role.role_id === roleId) {
                          return {
                            ...role,
                            usn_shift_personnels: [
                              {
                                id:
                                  role.usn_shift_personnels?.[0]?.id ||
                                  Date.now(),
                                usn_shift_role_id: role.id,
                                employee_id: employeeId,
                                employee: { id: employeeId },
                              },
                            ],
                          };
                        }
                        return role;
                      }),
                    };
                  }
                  return shift;
                })
              );

              toast.success(
                response.message || "Employee assigned successfully"
              );
              return;
            }
          }

          if (locomotiveId !== undefined) {
            const formData = new FormData();
            formData.append(
              "assign_usn_shifts",
              JSON.stringify([
                {
                  usn_shift_id: draggedShift.id,
                  locomotive_id: locomotiveId,
                },
              ])
            );

            const response =
              await ProjectUSNShiftsService.assignLocomotiveToUSNShift(
                formData
              );

            setShifts((prevShifts) =>
              prevShifts.map((shift) =>
                shift.id === draggedShift.id
                  ? { ...shift, locomotive_id: locomotiveId }
                  : shift
              )
            );

            toast.success(
              response?.message || "Locomotive assigned successfully"
            );
            return;
          }
        }

        if (draggedShift.has_route_planning && isHorizontalDrag) {
          await ProjectUSNShiftsService.updateProjectUSNShiftDate(
            draggedShift.id,
            newDate
          );

          setShifts((prevShifts) =>
            prevShifts.map((shift) =>
              shift.id === draggedShift.id ? { ...shift, date: newDate } : shift
            )
          );

          toast.success("USN shift date updated successfully");
          return;
        }

        const response = await ProjectUSNShiftsService.getProjectUSNShift(
          draggedShift.id
        );

        console.log("response:", response);

        const shiftData = response.data || response;

        if (!shiftData || !shiftData.product_usn_id) {
          console.error("Invalid shift data received:", shiftData);
          toast.error("Failed to load shift data for update");
          return;
        }

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
          date: newDate,
          start_time: formatTimeOnly(shiftData.start_time),
          end_time: formatTimeOnly(shiftData.end_time),
          product_usn_id: shiftData.product_usn_id,
          company_id: shiftData.company_id,
          has_locomotive: shiftData.has_locomotive ? "true" : "false",
          has_note: shiftData.has_note ? "true" : "false",
          has_document: shiftData.has_document ? "true" : "false",
          has_route_planning: shiftData.has_route_planning ? "true" : "false",
        };

        if (shiftData.usn_shift_roles && shiftData.usn_shift_roles.length > 0) {
          updatePayload.shiftRole = shiftData.usn_shift_roles.map(
            (role: any) => {
              const employeeId =
                role.usn_shift_personnels?.[0]?.employee_id || role.role_id;

              return {
                role_id: role.role_id,
                employee_id: employeeId,
                proximity: role.proximity,
                break_duration: role.break_duration,
                start_day: role.start_day,
              };
            }
          );
        } else {
          updatePayload.shiftRole = [];
        }

        if (!isHorizontalDrag && locomotiveId !== undefined) {
          updatePayload.locomotive_id = locomotiveId;
        } else if (shiftData.locomotive_id) {
          updatePayload.locomotive_id = shiftData.locomotive_id;
        } else if (shiftData.locomotive?.id) {
          updatePayload.locomotive_id = shiftData.locomotive.id;
        }

        if (shiftData.warehouse_location_id) {
          updatePayload.warehouse_location_id = shiftData.warehouse_location_id;
        } else if (shiftData.location_id) {
          updatePayload.warehouse_location_id = shiftData.location_id;
        } else if (shiftData.usn_shift_warehouse_locations?.length > 0) {
          updatePayload.warehouse_location_id =
            shiftData.usn_shift_warehouse_locations[0].location_id;
        }

        if (shiftData.has_route_planning) {
          const routePlanningData =
            shiftData.usn_shift_route_planning ||
            shiftData.usn_shift_route_plannings ||
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
              } else if (rp.orders && rp.orders.length > 0) {
                routeData.orders = rp.orders;
              }

              return routeData;
            });
          } else {
            updatePayload.routePlanning = [];
          }
        }

        if (shiftData.note) {
          updatePayload.note = shiftData.note;
        }

        console.log(
          "Final update payload:",
          JSON.stringify(updatePayload, null, 2)
        );

        const formData = new FormData();
        formData.append("shift", JSON.stringify(updatePayload));

        await ProjectUSNShiftsService.updateProjectUSNShift(
          draggedShift.id,
          formData
        );

        if (
          !isVerticalDrag &&
          !isHorizontalDrag &&
          locomotiveId !== undefined
        ) {
          const locomotiveFormData = new FormData();
          locomotiveFormData.append(
            "assign_usn_shifts",
            JSON.stringify([
              {
                usn_shift_id: draggedShift.id,
                locomotive_id: locomotiveId,
              },
            ])
          );
          await ProjectUSNShiftsService.assignLocomotiveToUSNShift(
            locomotiveFormData
          );
        }

        setShifts((prevShifts) => {
          const updatedShifts = prevShifts.map((shift) => {
            if (shift.id === draggedShift.id) {
              const updatedShift = {
                ...shift,
                date: isVerticalDrag
                  ? shift.date
                  : dateChanged
                    ? newDate
                    : shift.date,
              };

              if (!isHorizontalDrag && locomotiveId !== undefined) {
                updatedShift.locomotive_id = locomotiveId;
              }

              if (
                !isHorizontalDrag &&
                roleId !== undefined &&
                shift.usn_shift_roles
              ) {
                updatedShift.usn_shift_roles = shift.usn_shift_roles.map(
                  (role) => {
                    if (role.role_id === roleId && employeeId !== undefined) {
                      return {
                        ...role,
                        usn_shift_personnels: [
                          {
                            id:
                              role.usn_shift_personnels?.[0]?.id || Date.now(),
                            usn_shift_role_id: role.id,
                            employee_id: employeeId,
                            employee: { id: employeeId },
                          },
                        ],
                      };
                    }
                    return role;
                  }
                );
              }

              return updatedShift;
            }
            return shift;
          });

          return [...updatedShifts];
        });

        let successMessage = "Warehouse shift updated successfully";

        if (isVerticalDrag) {
          if (employeeId !== undefined) {
            successMessage = "Employee assignment updated successfully";
          } else if (roleId !== undefined) {
            successMessage = "Role assignment updated successfully";
          } else if (locomotiveId !== undefined) {
            successMessage = "Locomotive assignment updated successfully";
          }
        } else if (isHorizontalDrag) {
          successMessage = "Shift date updated successfully";
        } else {
          if (roleId !== undefined && employeeId !== undefined) {
            successMessage =
              "Shift date and employee assignment updated successfully";
          } else if (roleId !== undefined) {
            successMessage =
              "Shift date and role assignment updated successfully";
          } else if (locomotiveId !== undefined) {
            successMessage =
              "Shift date and locomotive assignment updated successfully";
          } else if (dateChanged) {
            successMessage = "Shift date updated successfully";
          }
        }

        toast.success(successMessage);
      } catch (error) {
        console.error("Error updating shift date:", error);
        toast.error("Failed to update shift date");
      }
    },
    [draggedShift]
  );

  const handleDeleteShift = useCallback(
    async (shiftId: number) => {
      try {
        await ProjectUSNShiftsService.deleteProjectUSNShift(shiftId);
        setShifts((prevShifts) =>
          prevShifts.filter((shift) => shift.id !== shiftId)
        );
        setSelectedShifts((prev) =>
          prev.filter((shift) => shift.id !== shiftId)
        );
        toast.success("Warehouse shift deleted successfully");
        // Ensure UI reflects server state immediately
        await fetchShifts();
      } catch (error) {
        console.error("Error deleting shift:", error);
        toast.error("Failed to delete warehouse shift");
      }
    },
    [fetchShifts]
  );

  useEffect(() => {
    fetchShifts();
  }, [fetchShifts]);

  useEffect(() => {
    if (view === "weekly") {
      const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
    } else if (view === "monthly") {
      const calculateDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const firstDayOfMonth = startOfMonth(new Date(year, month));
        const daysInMonth = getDaysInMonth(new Date(year, month));
        const startOfMonthDay = getDay(firstDayOfMonth);
        const adjustedStartOfMonthDay =
          startOfMonthDay === 0 ? 6 : startOfMonthDay - 1;

        const currentMonthName = new Date(year, month).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
          }
        );

        setTotalDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
        setSkipDays(
          Array.from({ length: adjustedStartOfMonthDay }, (_, i) => i + 1)
        );
        setCurrentMonth(currentMonthName);
      };

      calculateDaysInMonth();
    }
  }, [currentDate, view]);

  const handleFixedShifts = useCallback(
    async (shiftsToFix: any[]) => {
      if (shiftsToFix.length === 0) return false;
      try {
        const formData = new FormData();
        formData.append(
          "shift_ids",
          JSON.stringify(shiftsToFix?.map((s) => s.id))
        );
        let response = await ProjectUSNShiftsService.fixedUSNShifts(formData);
        const updatedShifts = shifts.map((s) =>
          shiftsToFix.some((selected) => selected.id === s.id)
            ? { ...s, status: "FIXED" }
            : s
        );
        setShifts(updatedShifts);
        setSelectedShifts([]);
        toast.success(
          response.message || "USN Shifts updated to FIXED successfully"
        );
        await fetchShifts();
        return true;
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Failed to update USN shifts to FIXED"
        );
        console.error("Error updating USN shifts to FIXED:", error);
        return false;
      }
    },
    [shifts, setShifts, fetchShifts]
  );

  const handlePlannedShifts = useCallback(
    async (shiftsToPlanned: any[]) => {
      if (shiftsToPlanned.length === 0) return false;
      try {
        const formData = new FormData();
        formData.append(
          "shift_ids",
          JSON.stringify(shiftsToPlanned?.map((s) => s.id))
        );
        let response = await ProjectUSNShiftsService.plannedUSNShifts(formData);
        if (response.status === "success") {
          const updatedShifts = shifts.map((s) =>
            shiftsToPlanned.some((selected) => selected.id === s.id)
              ? { ...s, status: "PLANNED" }
              : s
          );
          setShifts(updatedShifts);
          setSelectedShifts([]);
          toast.success(
            response.message || "USN Shifts updated to PLANNED successfully"
          );
          // Refetch to ensure real-time server state
          await fetchShifts();
          return true;
        }
        return false;
      } catch (error: any) {
        toast.error(
          error?.data?.message || "Failed to update USN shifts to PLANNED"
        );
        console.error("Error updating USN shifts to PLANNED:", error);
        return false;
      }
    },
    [shifts, setShifts, fetchShifts]
  );

  const handleTimeSheet = useCallback(
    (shifts: any[]) => {
      if (shifts.length > 0) {
        localStorage.setItem("selectedShifts", JSON.stringify(shifts));
        const url = `/time-sheet/usn-shifts-timesheets/add`;
        setTimeout(() => {
          router.push(url, { scroll: false });
        }, 0);
      }
    },
    [router]
  );

  const handleHandoverBook = useCallback(
    (shifts: any[]) => {
      if (shifts.length > 0) {
        localStorage.setItem("selectedShifts", JSON.stringify(shifts));
        const url = `/handover-book/add`;
        setTimeout(() => {
          router.push(url, { scroll: false });
        }, 0);
      }
    },
    [router]
  );

  return {
    currentDate,
    currentMonth,
    totalDays,
    skipDays,
    selectedShifts,
    shifts,
    setShifts,
    isLoading,
    draggedShift,
    handlePreviousMonth,
    handleNextMonth,
    handlePreviousWeek: view === "weekly" ? handlePreviousWeek : undefined,
    handleNextWeek: view === "weekly" ? handleNextWeek : undefined,
    handleMonthYearSelect,
    handleShiftClick,
    handleShiftSelect,
    clearSelectedShifts,
    handleDragStart,
    handleDragEnd,
    handleDrop,
    handleDeleteShift,
    handleFixedShifts,
    handlePlannedShifts,
    handleTimeSheet,
    handleHandoverBook,
    fetchShifts,
  };
};
