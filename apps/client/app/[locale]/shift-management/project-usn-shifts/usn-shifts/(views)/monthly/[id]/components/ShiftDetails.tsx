"use client";

import { useParams } from "next/navigation";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslations } from "next-intl";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import {
  ExternalLink,
  MoreVertical,
  Check,
  Edit,
  FileText,
  Download,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import RouteWagonsModal from "./RouteWagonsModal";
import { useLocationsList } from "@/hooks/location/useLocationsList";
import { RouteLocationPDF } from "./RouteLocationPDF";
import { pdf } from "@react-pdf/renderer";
import { useLocomotiveTable } from "@/hooks/locomotive/useLocomotiveTable";
import { useEmployeeTable } from "@/hooks/employee/useEmployeeTable";
import { useAuth } from "@/providers/appProvider";

const ShiftDetails = () => {
  const { id } = useParams();
  const { isEmployee } = useAuth();
  const [shift, setShift] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [isWagonModalOpen, setIsWagonModalOpen] = useState<boolean>(false);
  const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
  const buttonRefs = React.useRef<{ [key: number]: HTMLButtonElement | null }>(
    {}
  );
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const t = useTranslations("pages.shift");
  const tPdf = useTranslations("pdf");
  const { locations } = useLocationsList();
  const { locomotives } = useLocomotiveTable();
  const { employees } = useEmployeeTable();

  const fetchShift = async () => {
    if (!id) {
      setError(t("noShiftIdProvided"));
      setLoading(false);
      return null;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await ProjectUSNShiftsService.getProjectUSNShift(
        Number(id)
      );
      if (response) {
        setShift(response);
        return response;
      } else {
        throw new Error(t("noShiftDataReceived"));
      }
    } catch (err: any) {
      console.error("Error fetching shift:", err);
      setError(err.message || t("failedToFetchShiftDetails"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, [id]);

  const updateDropdownPosition = useCallback(() => {
    if (activeDropdown !== null && buttonRefs.current[activeDropdown]) {
      const button = buttonRefs.current[activeDropdown];
      const rect = button.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 128,
      });
    }
  }, [activeDropdown]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown !== null &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
        setDropdownPosition(null);
      }
    };

    const handleScroll = () => {
      if (activeDropdown !== null) {
        updateDropdownPosition();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [activeDropdown, updateDropdownPosition]);

  useEffect(() => {
    if (activeDropdown !== null) {
      updateDropdownPosition();
    }
  }, [activeDropdown, updateDropdownPosition]);

  const getLocomotiveName = () => {
    const locomotiveId =
      shift?.locomotive_id || shift?.usn_shift_locomotives?.[0]?.locomotive_id;
    if (locomotiveId) {
      const locomotive = locomotives.find((loco) => loco.id === locomotiveId);
      return locomotive?.name || `${t("Locomotive")} #${locomotiveId}`;
    }
    return t("nA");
  };

  const getTrainDriverName = () => {
    const trainDriverRole = shift?.usn_shift_roles?.find(
      (role: any) => role.role?.has_train_driver === true
    );
    const employee = trainDriverRole?.usn_shift_personnels?.[0]?.employee;
    if (employee?.name) {
      return employee.name;
    }
    return t("nA");
  };

  const getShuntingAttendantName = () => {
    const shuntingRoles = shift?.usn_shift_roles?.filter(
      (role: any) => role.role?.has_train_driver === false
    );

    if (shuntingRoles && shuntingRoles.length > 0) {
      const names = shuntingRoles
        .map((role: any) => {
          const employee = role?.usn_shift_personnels?.[0]?.employee;
          return employee?.name || null;
        })
        .filter((name: string | null) => name !== null);

      return names.length > 0 ? names.join(", ") : t("nA");
    }
    return t("nA");
  };

  const getTrainNumbers = () => {
    if (
      shift?.usn_shift_route_planning &&
      shift.usn_shift_route_planning.length > 0
    ) {
      const trainNumbers = shift.usn_shift_route_planning
        .map((route: any) => route.train_no)
        .filter((trainNo: string) => trainNo && trainNo.trim() !== "");

      if (trainNumbers.length > 0) {
        return trainNumbers.join(", ");
      }
    }
    return t("nA");
  };

  const getLocationName = (locationId: number) => {
    const location = locations.find((loc) => loc.id === locationId);
    return location
      ? `${location.name} (${location.type.toLowerCase()})`
      : `${t("startLocation")} ${locationId}`;
  };

  const getWagonCount = (route: any, wagonType: "first" | "second") => {
    if (wagonType === "first") {
      return route.usn_shift_first_wagon_action?.length || 0;
    } else {
      return route.usn_shift_second_wagon_action?.length || 0;
    }
  };

  const employeeNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    employees.forEach((emp) => {
      map[emp.id] = emp.name || emp.email || `${t("Employee")} #${emp.id}`;
    });
    return map;
  }, [employees]);

  const usnTimesheets = useMemo(() => {
    if (!shift?.usn_timesheet) return [];
    return Array.isArray(shift.usn_timesheet)
      ? shift.usn_timesheet
      : Object.values(shift.usn_timesheet);
  }, [shift?.usn_timesheet]);

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    try {
      return format(new Date(value), "dd/MM/yyyy HH:mm");
    } catch {
      return value;
    }
  };

  const getTimesheetEmployeeName = (timesheet: any) => {
    if (timesheet?.employee?.name) return timesheet.employee.name;
    if (timesheet?.employee_id && employeeNameMap[timesheet.employee_id]) {
      return employeeNameMap[timesheet.employee_id];
    }
    if (timesheet?.employee?.email) return timesheet.employee.email;
    return timesheet?.employee_id
      ? `${t("Employee")} #${timesheet.employee_id}`
      : t("nA");
  };

  const getTimesheetDocumentsCount = (timesheet: any) => {
    const docCount = timesheet?.usn_timesheet_document?.length || 0;
    const handoverCount =
      timesheet?.usn_timesheet_handover_book_documents?.length || 0;
    return docCount + handoverCount;
  };

  const getTimesheetFlags = (timesheet: any) => {
    const flags: string[] = [];
    if (timesheet?.is_night_shift) flags.push(t("night"));
    if (timesheet?.is_holiday) flags.push(t("holiday"));
    if (timesheet?.has_extra_hours) flags.push(t("extraHoursLabel"));
    if (timesheet?.self_created) flags.push(t("selfCreated"));
    return flags;
  };

  const renderFlagPills = (flags: string[]) => {
    if (!flags.length) {
      return <span className="text-xs text-gray-400">—</span>;
    }

    return (
      <div className="flex flex-wrap gap-1">
        {flags.map((flag) => (
          <span
            key={flag}
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
          >
            {flag}
          </span>
        ))}
      </div>
    );
  };

  const getTimesheetExtraHoursSummary = (timesheet: any) => {
    const extras = timesheet?.usn_timesheet_extra_hours || [];
    if (extras.length === 0) {
      return timesheet?.has_extra_hours ? t("yes") : "—";
    }

    return extras
      .map((entry: any) => {
        if (!entry) return null;
        const base = entry.extra_hours ?? entry.hours;
        if (base && entry.note) {
          return `${base} (${entry.note})`;
        }
        return base ?? entry.note ?? null;
      })
      .filter(Boolean)
      .join(", ");
  };

  const statusColorMap: Record<string, string> = {
    SUBMITTED: "bg-blue-50 text-blue-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    DRAFT: "bg-gray-100 text-gray-700",
  };

  const handleAction = async (action: "approve" | "edit", routeId: number) => {
    if (action === "approve") {
      try {
        setActiveDropdown(null);
        setDropdownPosition(null);

        toast.loading(t("approvingRoutePlanning"));

        const response =
          await ProjectUSNShiftsService.approveRoutePlanning(routeId);

        toast.dismiss();
        toast.success(
          response.message || t("routePlanningApprovedSuccessfully")
        );

        await fetchShift();
      } catch (error: any) {
        console.error("Error approving route planning:", error);
        toast.dismiss();
        toast.error(
          error?.response?.data?.message || t("failedToApproveRoutePlanning")
        );
      }
    } else if (action === "edit") {
      const route = shift?.usn_shift_route_planning?.find(
        (r: any) => r.id === routeId
      );

      if (route) {
        setSelectedRoute(route);
        setIsWagonModalOpen(true);
      }

      setActiveDropdown(null);
      setDropdownPosition(null);
    }
  };

  const isImageFile = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      extension || ""
    );
  };

  const viewDocument = (doc: { id: number; document: string }) => {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:5051";
    const fullUrl = doc.document.startsWith("http")
      ? doc.document
      : `${baseUrl}/${doc.document}`;
    window.open(fullUrl, "_blank");
  };

  const handleDownloadLocationPDF = async (
    route: any,
    locationType: "start" | "end"
  ) => {
    try {
      const wagons =
        locationType === "start"
          ? route.usn_shift_first_wagon_action || []
          : route.usn_shift_second_wagon_action || [];

      const locationName =
        locationType === "start"
          ? getLocationName(route.start_location_id)
          : getLocationName(route.end_location_id);

      toast.loading(t("generatingPdf"));

      const blob = await pdf(
        <RouteLocationPDF
          locationType={locationType}
          locationName={locationName}
          wagons={wagons}
          routeInfo={{
            trainNo: route.train_no || t("nA"),
            purpose: route.purpose || t("nA"),
            startLocation: getLocationName(route.start_location_id),
            endLocation: getLocationName(route.end_location_id),
            date: shift?.date
              ? format(new Date(shift.date), "dd/MM/yyyy")
              : undefined,
          }}
          t={tPdf}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${locationType}_location_document_${route.train_no || route.id}.pdf`;
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast.dismiss();
        toast.success(t("pdfDownloadedSuccessfully"));
      }, 100);
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast.dismiss();
      toast.error(t("failedToGeneratePdf"));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-600 text-xl mb-4">
          {t("error")}: {error}
        </div>
        <button
          onClick={fetchShift}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("retry")}
        </button>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">{t("noShiftFound")}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {activeDropdown !== null && dropdownPosition && (
        <div
          ref={dropdownRef}
          className="fixed z-50 w-32 bg-white rounded-md shadow-lg border"
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
          }}
        >
          <div className="py-1">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAction("approve", activeDropdown);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Check size={16} className="text-green-500 mr-2" />
              {t("approve")}
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAction("edit", activeDropdown);
              }}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
            >
              <Edit size={16} className="text-gray-500 mr-2" />
              {t("edit")}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto p-6">
        <div className="mb-6 flex items-center gap-4">
          <SMSBackButton />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {t("shiftDetails")}
          </h1>
        </div>

        {!isEmployee && (
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("date")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("time")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("trainDriver")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("shuntingAttendant")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("locomotive")}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {t("trainNo")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shift.date
                        ? format(new Date(shift.date), "dd/MM/yyyy")
                        : t("nA")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {shift.start_time
                        ? formatInTimeZone(shift.start_time, "UTC", "hh:mm a")
                        : t("nA")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTrainDriverName()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getShuntingAttendantName()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getLocomotiveName()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getTrainNumbers()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {shift.has_route_planning &&
          shift.usn_shift_route_planning &&
          shift.usn_shift_route_planning.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="overflow-x-auto overflow-y-visible">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("startLocation")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("selectWagon")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("selectPurpose")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("arrivalDestination")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("select2ndWagon")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("trainNo")}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("startLocationDoc")}
                      </th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t("endLocationDoc")}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                        {t("actions")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shift.usn_shift_route_planning.map(
                      (route: any, index: number) => (
                        <tr
                          key={route.id || index}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getLocationName(route.start_location_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-900 px-3 py-1 bg-gray-100 rounded-full">
                                {getWagonCount(route, "first")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {route.purpose || t("status")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {getLocationName(route.end_location_id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center justify-center">
                              <span className="text-sm font-medium text-gray-900 px-3 py-1 bg-gray-100 rounded-full">
                                {getWagonCount(route, "second")}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {route.train_no}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {route.start_location_id &&
                            route.usn_shift_first_wagon_action &&
                            route.usn_shift_first_wagon_action.length > 0 ? (
                              <button
                                onClick={() =>
                                  handleDownloadLocationPDF(route, "start")
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors group"
                                title={t("downloadStartLocationDocument")}
                              >
                                <FileText className="h-5 w-5" />
                                <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-center">
                            {route.end_location_id &&
                            route.usn_shift_second_wagon_action &&
                            route.usn_shift_second_wagon_action.length > 0 ? (
                              <button
                                onClick={() =>
                                  handleDownloadLocationPDF(route, "end")
                                }
                                className="inline-flex items-center gap-2 px-3 py-2 bg-green-50 hover:bg-green-100 text-green-700 rounded-lg transition-colors group"
                                title={t("downloadEndLocationDocument")}
                              >
                                <FileText className="h-5 w-5" />
                                <Download className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
                              </button>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex justify-end">
                              <button
                                ref={(el) => {
                                  buttonRefs.current[route.id] = el;
                                }}
                                onClick={() => {
                                  if (activeDropdown === route.id) {
                                    setActiveDropdown(null);
                                    setDropdownPosition(null);
                                  } else {
                                    setActiveDropdown(route.id);
                                  }
                                }}
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center justify-center"
                              >
                                <MoreVertical
                                  size={16}
                                  className="text-gray-600"
                                />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        {shift.usn_shift_roles && shift.usn_shift_roles.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("personnel")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shift.usn_shift_roles.map((role: any, index: number) => (
                <div key={role.id || index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {role.role?.name || t("role")}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {t("Employee")}:
                      </span>
                      <span className="text-gray-900 text-sm font-medium">
                        {(() => {
                          const employeeId =
                            role.usn_shift_personnels?.[0]?.employee_id;
                          if (employeeId) {
                            const employee = employees.find(
                              (emp) => emp.id === employeeId
                            );
                            return (
                              employee?.name ||
                              `${t("Employee")} #${employeeId}`
                            );
                          }
                          return t("notAssigned");
                        })()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {t("Proximity")}:
                      </span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.proximity || t("nA")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {t("break")}:
                      </span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.break_duration
                          ? `${role.break_duration} min`
                          : t("nA")}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">
                        {t("startDay")}:
                      </span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.start_day || t("no")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
            {t("additionalDetails")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("date")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.date
                    ? format(new Date(shift.date), "dd/MM/yyyy")
                    : t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("startTime")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.start_time
                    ? formatInTimeZone(shift.start_time, "UTC", "hh:mm a")
                    : t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("endTime")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.end_time
                    ? formatInTimeZone(shift.end_time, "UTC", "hh:mm a")
                    : t("nA")}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("status")}:</span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    shift.status === "PLANNED"
                      ? "bg-blue-100 text-blue-800"
                      : shift.status === "FIXED"
                        ? "bg-purple-100 text-purple-800"
                        : shift.status === "PICK_UP_OFFER"
                          ? "bg-purple-50 text-purple-700 border border-purple-300"
                          : shift.status === "APPROVED"
                            ? "bg-green-100 text-green-800"
                            : shift.status === "SUBMITTED"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {shift.status || t("nA")}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {t("hasLocomotive")}:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_locomotive ? t("yes") : t("no")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {t("hasRoutePlanning")}:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_route_planning ? t("yes") : t("no")}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("hasNote")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_note ? t("yes") : t("no")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {t("hasDocuments")}:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_document ? t("yes") : t("no")}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("created")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.created_at
                    ? format(new Date(shift.created_at), "dd/MM/yyyy HH:mm")
                    : t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("updated")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.updated_at
                    ? format(new Date(shift.updated_at), "dd/MM/yyyy HH:mm")
                    : t("nA")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {shift.has_note && shift.note && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("notes")}
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700 text-sm whitespace-pre-wrap">
                {shift.note}
              </p>
            </div>
          </div>
        )}

        {shift.has_document &&
          shift.usn_shift_documents &&
          shift.usn_shift_documents.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("shiftDocuments")}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {shift.usn_shift_documents.map((doc: any) => {
                  const fileName =
                    doc.document.split("/").pop() || `Document ${doc.id}`;
                  const isImage = isImageFile(fileName);
                  const baseUrl =
                    process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
                    "http://localhost:5051";
                  const previewUrl = `${baseUrl}/${doc.document}`;
                  const fullUrl = doc.document.startsWith("http")
                    ? doc.document
                    : `${baseUrl}/${doc.document}`;

                  return (
                    <a
                      key={doc.id}
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer block"
                    >
                      {isImage ? (
                        <div className="relative w-full h-24 mb-2">
                          <Image
                            src={previewUrl}
                            alt={fileName}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-24 mb-2 bg-gray-100 rounded">
                          <span className="text-2xl">📄</span>
                        </div>
                      )}
                      <span className="text-xs font-medium text-center truncate block">
                        {fileName}
                      </span>
                      <div className="flex items-center justify-center mt-1 text-xs text-blue-600">
                        <ExternalLink size={12} className="mr-1" />
                        {t("view")}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

        {usnTimesheets.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("timesheets")}
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("Employee")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("time")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("breakDuration")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("flags")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("extraHours")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("status")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("notes")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("documents")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {t("submitted")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {usnTimesheets.map((timesheet: any) => {
                    const submittedAt =
                      timesheet?.submitted_at ||
                      timesheet?.approved_at ||
                      timesheet?.created_at;
                    const flags = getTimesheetFlags(timesheet);
                    const status = timesheet?.status || t("nA");
                    const statusClasses =
                      statusColorMap[status] || "bg-gray-100 text-gray-700";

                    return (
                      <tr key={timesheet.id}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {getTimesheetEmployeeName(timesheet)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {timesheet?.start_time && timesheet?.end_time
                            ? `${timesheet.start_time} - ${timesheet.end_time}`
                            : t("nA")}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {timesheet?.break_duration
                            ? `${timesheet.break_duration} min`
                            : "—"}
                        </td>
                        <td className="px-4 py-3">{renderFlagPills(flags)}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {getTimesheetExtraHoursSummary(timesheet)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClasses}`}
                          >
                            {status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {timesheet?.notes?.trim() || "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {getTimesheetDocumentsCount(timesheet)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          {formatDateTime(submittedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {shift.usn_timesheet && shift.usn_timesheet.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("timesheetDocuments")}
            </h3>
            <div className="space-y-6">
              {shift.usn_timesheet.map((timesheet: any, idx: number) => {
                const documents = timesheet.usn_timesheet_document || [];
                const handoverBookDocuments =
                  timesheet.usn_timesheet_handover_book_documents || [];

                if (
                  documents.length === 0 &&
                  handoverBookDocuments.length === 0
                )
                  return null;

                const getFileIcon = (fileName: string) => {
                  const extension = fileName.split(".").pop()?.toLowerCase();
                  if (["pdf"].includes(extension || "")) {
                    return <FileText className="h-6 w-6 text-red-500" />;
                  } else if (
                    ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
                      extension || ""
                    )
                  ) {
                    return <ImageIcon className="h-6 w-6 text-blue-500" />;
                  } else {
                    return <FileIcon className="h-6 w-6 text-gray-500" />;
                  }
                };

                return (
                  <div key={timesheet.id || idx} className="mb-6">
                    <h4 className="text-xl font-semibold text-gray-700 mb-4">
                      {timesheet.employee?.name ||
                        (timesheet.employee_id
                          ? employeeNameMap[timesheet.employee_id]
                          : undefined) ||
                        timesheet.employee?.email ||
                        `Timesheet ${idx + 1}`}
                    </h4>

                    {documents.length > 0 && (
                      <div className="mb-4">
                        <h5 className="text-sm font-medium text-gray-600 mb-3">
                          {t("documents")}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {documents.map((doc: any) => {
                            const fileName =
                              doc.document?.split("/").pop() ||
                              `Document ${doc.id}`;
                            const isImage = isImageFile(fileName);
                            const baseUrl =
                              process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                                "/api",
                                ""
                              ) || "http://localhost:5051";
                            const previewUrl = `${baseUrl}/${doc.document}`;
                            const fullUrl = doc.document?.startsWith("http")
                              ? doc.document
                              : `${baseUrl}/${doc.document}`;

                            return (
                              <a
                                key={doc.id}
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer block"
                              >
                                {isImage ? (
                                  <div className="relative w-full h-24 mb-2">
                                    <Image
                                      src={previewUrl}
                                      alt={fileName}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-24 mb-2 bg-gray-100 rounded">
                                    {getFileIcon(fileName)}
                                  </div>
                                )}
                                <span className="text-xs font-medium text-center truncate block">
                                  {fileName}
                                </span>
                                <div className="flex items-center justify-center mt-1 text-xs text-blue-600">
                                  <ExternalLink size={12} className="mr-1" />
                                  {t("view")}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {handoverBookDocuments.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-600 mb-3">
                          {t("handoverBookDocuments")}
                        </h5>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {handoverBookDocuments.map((doc: any) => {
                            const fileName =
                              doc.document?.split("/").pop() ||
                              `Document ${doc.id}`;
                            const isImage = isImageFile(fileName);
                            const baseUrl =
                              process.env.NEXT_PUBLIC_API_BASE_URL?.replace(
                                "/api",
                                ""
                              ) || "http://localhost:5051";
                            const previewUrl = `${baseUrl}/${doc.document}`;
                            const fullUrl = doc.document?.startsWith("http")
                              ? doc.document
                              : `${baseUrl}/${doc.document}`;

                            return (
                              <a
                                key={doc.id}
                                href={fullUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer block"
                              >
                                {isImage ? (
                                  <div className="relative w-full h-24 mb-2">
                                    <Image
                                      src={previewUrl}
                                      alt={fileName}
                                      fill
                                      className="object-cover rounded"
                                    />
                                  </div>
                                ) : (
                                  <div className="flex items-center justify-center h-24 mb-2 bg-gray-100 rounded">
                                    {getFileIcon(fileName)}
                                  </div>
                                )}
                                <span className="text-xs font-medium text-center truncate block">
                                  {fileName}
                                </span>
                                <div className="flex items-center justify-center mt-1 text-xs text-blue-600">
                                  <ExternalLink size={12} className="mr-1" />
                                  {t("view")}
                                </div>
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <RouteWagonsModal
        isOpen={isWagonModalOpen}
        onClose={() => {
          setIsWagonModalOpen(false);
          setSelectedRoute(null);
        }}
        firstWagons={selectedRoute?.usn_shift_first_wagon_action || []}
        secondWagons={selectedRoute?.usn_shift_second_wagon_action || []}
        usnShiftRoutePlanningId={selectedRoute?.id}
        routeInfo={
          selectedRoute
            ? {
                startLocation: getLocationName(selectedRoute.start_location_id),
                endLocation: getLocationName(selectedRoute.end_location_id),
                trainNo: selectedRoute.train_no || "N/A",
                purpose: selectedRoute.purpose || "N/A",
              }
            : undefined
        }
        onWagonPositionUpdate={async () => {
          const updatedShift = await fetchShift();
          // Update selectedRoute with the latest data after refetch
          if (selectedRoute && updatedShift?.usn_shift_route_planning) {
            const updatedRoute = updatedShift.usn_shift_route_planning.find(
              (r: any) => r.id === selectedRoute.id
            );
            if (updatedRoute) {
              setSelectedRoute(updatedRoute);
            }
          }
        }}
      />
    </div>
  );
};

export default ShiftDetails;
