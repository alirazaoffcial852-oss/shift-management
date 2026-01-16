"use client";

import { Shift } from "@/types/shift";
import { useParams } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import ShiftService from "@/services/shift";
import WagonListService from "@/services/wagonList";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
  ExternalLink,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
} from "lucide-react";

const ShiftDetails = () => {
  const { id } = useParams();
  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [wagonListData, setWagonListData] = useState<Record<number, any>>({});
  const t = useTranslations("pages.shift");
  const tP = useTranslations("pages.personnel");
  const tCommon = useTranslations("common");

  const timesheetsArray = useMemo(() => {
    if (!shift?.timesheets) return [];
    return Array.isArray(shift.timesheets)
      ? shift.timesheets
      : Object.values(shift.timesheets);
  }, [shift?.timesheets]);

  const fetchShift = async () => {
    if (!id) {
      setError(t("noShiftIdProvided"));
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await ShiftService.getShiftById(Number(id));
      if (response) {
        setShift(response.data);
      } else {
        throw new Error(t("noShiftDataReceived"));
      }
    } catch (err: any) {
      console.error("Error fetching shift:", err);
      setError(err.message || t("failedToFetchShiftDetails"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, [id]);

  // Fetch wagon list details for trains that have incomplete data
  useEffect(() => {
    const fetchWagonListDetails = async () => {
      if (!shift?.shiftTrain) return;

      const fetchPromises = shift.shiftTrain.map(async (train: any) => {
        const wagonList = train.wagonList;
        if (!wagonList || !train.id) return;

        // Check if we have incomplete data (only id and wagonDocuments, missing other fields)
        const hasIncompleteData =
          !wagonList.train_number &&
          !wagonList.location &&
          !wagonList.rail_number &&
          !wagonList.company &&
          !wagonList.tech_prep_date &&
          !wagonList.brake_date;

        if (hasIncompleteData) {
          try {
            const response = await WagonListService.getByShiftTrainId(train.id);
            if (response?.data) {
              setWagonListData((prev) => ({
                ...prev,
                [train.id]: response.data,
              }));
            }
          } catch (err) {
            console.error(
              `Error fetching wagon list for train ${train.id}:`,
              err
            );
          }
        } else {
          // If we have complete data in the response, use it directly
          setWagonListData((prev) => ({
            ...prev,
            [train.id]: wagonList,
          }));
        }
      });

      await Promise.all(fetchPromises);
    };

    if (shift) {
      fetchWagonListDetails();
    }
  }, [shift]);

  const baseApiUrl = useMemo(
    () =>
      process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
      "http://localhost:5051",
    []
  );

  const isImageFile = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    return ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(
      extension || ""
    );
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <FileText className="h-6 w-6 text-red-500" />;
    }
    if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")
    ) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    }
    return <FileIcon className="h-6 w-6 text-gray-500" />;
  };

  const resolveDocumentUrl = (path?: string | null) => {
    if (!path) return "";
    return path.startsWith("http") ? path : `${baseApiUrl}/${path}`;
  };

  const employeeNameMap = useMemo(() => {
    const map: Record<number, string> = {};
    if (!Array.isArray((shift as any)?.shiftRole)) return map;

    (shift as any)?.shiftRole?.forEach((role: any) => {
      role?.shiftPersonnel?.forEach((person: any) => {
        const employeeId = person?.employee_id ?? person?.employee?.id;
        if (!employeeId) return;

        const name =
          person?.employee?.name ||
          person?.employee?.email ||
          `${t("Employee")} #${employeeId}`;

        map[employeeId] = name;
      });
    });

    return map;
  }, [shift?.shiftRole]);

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

  const shiftDetailsArray = Array.isArray((shift as any)?.shiftDetail)
    ? ((shift as any).shiftDetail as any[])
    : (shift as any)?.shiftDetail
      ? [(shift as any).shiftDetail as any]
      : [];

  const primaryShiftDetail = shiftDetailsArray[0] ?? null;

  const locomotivesArray = Array.isArray((shift as any)?.shiftLocomotive)
    ? ((shift as any).shiftLocomotive as any[])
    : [];

  const primaryLocomotive =
    locomotivesArray[0]?.locomotive ||
    (Array.isArray((shift as any)?.locomotive)
      ? (shift as any)?.locomotive?.[0]
      : (shift as any)?.locomotive) ||
    null;

  const shiftDocuments = Array.isArray((shift as any)?.shiftDocument)
    ? ((shift as any).shiftDocument as any[])
    : [];

  const formatDateTime = (value?: string | null) => {
    if (!value) return "—";
    try {
      return format(new Date(value), "dd/MM/yyyy HH:mm");
    } catch {
      return value;
    }
  };

  const getTimesheetDocumentsCount = (timesheet: any) => {
    const docCount = timesheet?.timesheetDocs?.length || 0;
    const handoverCount = timesheet?.timesheetHandoverBookDocument?.length || 0;
    return docCount + handoverCount;
  };

  const getTimesheetExtraHoursSummary = (timesheet: any) => {
    const extras = timesheet?.timesheetExtraHour || [];
    if (extras.length === 0) {
      return timesheet?.has_extra_hours ? tCommon("yes") : "—";
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

  const statusColorMap: Record<string, string> = {
    SUBMITTED: "bg-blue-50 text-blue-700",
    APPROVED: "bg-green-50 text-green-700",
    REJECTED: "bg-red-50 text-red-700",
    DRAFT: "bg-gray-100 text-gray-700",
  };

  console.log(shift, "shift");

  return (
    <div className="min-h-screen mt-4">
      <div className="mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {t("shift_detail")}
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("BasicInformation")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("Location")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {primaryShiftDetail?.location || t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("Date")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.date
                    ? format(new Date(shift.date), "dd/MM/yyyy")
                    : t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("StartTime")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.start_time
                    ? formatInTimeZone(shift.start_time, "UTC", "hh:mm a")
                    : t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("EndTime")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.end_time
                    ? formatInTimeZone(shift.end_time, "UTC", "hh:mm a")
                    : t("nA")}
                </span>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {tP("title")}
            </h3>
            {shift.shiftRole && shift.shiftRole.length > 0 ? (
              <div className="space-y-4">
                {shift.shiftRole.map((role: any, index: number) => {
                  const personnel = Array.isArray(role.shiftPersonnel)
                    ? role.shiftPersonnel
                    : [];
                  const employeeNames = personnel
                    .map(
                      (person: any) =>
                        person.employee?.name || person.employee?.email
                    )
                    .filter(Boolean);

                  return (
                    <div key={role.id || index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          {tP("role_name")}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium">
                          {role.role?.short_name || role.role?.name || t("nA")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          {t("Employee")}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">
                          {employeeNames.length > 0
                            ? employeeNames.join(", ")
                            : t("notAssigned")}
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
                          {t("BreakDuration")}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium">
                          {role.break_duration
                            ? `${role.break_duration} min`
                            : t("nA")}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">
                          {t("StartDay")}:
                        </span>
                        <span className="text-gray-900 text-sm font-medium">
                          {role.start_day || t("no")}
                        </span>
                      </div>
                      {shift.shiftRole &&
                        index < shift?.shiftRole?.length - 1 && (
                          <hr className="my-3" />
                        )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">
                {t("noPersonnelAssigned")}
              </p>
            )}
          </div>
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("shiftInformation")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("Customer")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.customer?.name || t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("Project")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.project?.name || t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("bvProject")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.bv_project?.name || t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {t("typeOfOperation")}:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {primaryShiftDetail?.type_of_operation?.name ||
                    primaryShiftDetail?.type_of_operation_id ||
                    t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">{t("product")}:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.product?.name || t("nA")}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">
                  {t("locomotive")}:
                </span>
                <span className="text-gray-900 text-sm font-medium">
                  {primaryLocomotive?.name || t("nA")}
                </span>
              </div>
              {primaryShiftDetail?.note && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm">
                    {t("ShiftNote")}:
                  </span>
                  <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">
                    {primaryShiftDetail.note}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        <hr />

        {timesheetsArray.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
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
                  {timesheetsArray.map((timesheet: any) => {
                    const flags = getTimesheetFlags(timesheet);
                    const status = timesheet?.status || t("nA");
                    const submittedAt =
                      timesheet?.submitted_at ||
                      timesheet?.approved_at ||
                      timesheet?.created_at;
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

        {(() => {
          if (timesheetsArray.length === 0) return null;

          const timesheetsWithDocs = timesheetsArray.filter(
            (timesheet: any) => {
              const documents = timesheet.timesheetDocs || [];
              const handoverBookDocuments =
                timesheet.timesheetHandoverBookDocument || [];
              return documents.length > 0 || handoverBookDocuments.length > 0;
            }
          );

          if (timesheetsWithDocs.length === 0) return null;

          return (
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                {t("timesheetDocuments")}
              </h3>
              <div className="space-y-6">
                {timesheetsWithDocs.map((timesheet: any, idx: number) => {
                  const documents = timesheet.timesheetDocs || [];
                  const handoverBookDocuments =
                    timesheet.timesheetHandoverBookDocument || [];
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

                      {/* Regular Documents */}
                      {documents.length > 0 && (
                        <div className="mb-4">
                          <h5 className="text-sm font-medium text-gray-600 mb-3">
                            {t("documents")}
                          </h5>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {documents.map((doc: any) => {
                              if (!doc.document) return null;
                              const fileName =
                                doc.document?.split("/").pop() ||
                                `Document ${doc.id}`;
                              const isImage = isImageFile(fileName);
                              const previewUrl = resolveDocumentUrl(
                                doc.document
                              );
                              const fullUrl = resolveDocumentUrl(doc.document);

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
                              if (!doc.document) return null;
                              const fileName =
                                doc.document?.split("/").pop() ||
                                `Document ${doc.id}`;
                              const isImage = isImageFile(fileName);
                              const previewUrl = resolveDocumentUrl(
                                doc.document
                              );
                              const fullUrl = resolveDocumentUrl(doc.document);

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
          );
        })()}

        {/* Wagon Documents Section */}
        {shift.shiftTrain &&
          shift.shiftTrain.length > 0 &&
          (() => {
            const allWagonDocuments: Array<{
              doc: any;
              trainIndex: number;
              trainNo: string;
            }> = [];

            shift.shiftTrain.forEach((train: any, trainIndex: number) => {
              const wagonList = train.wagonList;
              const wagonDocuments =
                wagonList?.wagonDocuments || wagonList?.[""] || [];

              if (Array.isArray(wagonDocuments) && wagonDocuments.length > 0) {
                wagonDocuments.forEach((doc: any) => {
                  allWagonDocuments.push({
                    doc,
                    trainIndex,
                    trainNo: train.train_no || `Train ${trainIndex + 1}`,
                  });
                });
              }
            });

            if (allWagonDocuments.length > 0) {
              return (
                <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    {t("wagonDocuments")}
                  </h3>
                  <div className="space-y-6">
                    {shift.shiftTrain.map((train: any, trainIndex: number) => {
                      const wagonList = train.wagonList;
                      // Use fetched wagon list data if available
                      const fullWagonList =
                        wagonListData[train.id] || wagonList || {};
                      const wagonDocuments =
                        fullWagonList?.wagonDocuments ||
                        fullWagonList?.[""] ||
                        wagonList?.wagonDocuments ||
                        wagonList?.[""] ||
                        [];

                      if (
                        !Array.isArray(wagonDocuments) ||
                        wagonDocuments.length === 0
                      ) {
                        return null;
                      }

                      return (
                        <div
                          key={train.id || trainIndex}
                          className="mb-6 last:mb-0"
                        >
                          <h4 className="text-base font-semibold text-gray-700 mb-4">
                            {train.train_no
                              ? `${t("train")} ${train.train_no}`
                              : `${t("train")} ${trainIndex + 1}`}
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {wagonDocuments.map((doc: any) => {
                              if (!doc.document) return null;
                              const fileName =
                                doc.document.split("/").pop() ||
                                `Document ${doc.id}`;
                              const isImage = isImageFile(fileName);
                              const previewUrl = resolveDocumentUrl(
                                doc.document
                              );
                              const fullUrl = resolveDocumentUrl(doc.document);

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
                      );
                    })}
                  </div>
                </div>
              );
            }
            return null;
          })()}

        {shiftDocuments.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              {t("documents")}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shiftDocuments.map((doc: any) => {
                if (!doc.document) return null;
                const fileName =
                  doc.document.split("/").pop() || `Document ${doc.id}`;
                const isImage = isImageFile(fileName);
                const previewUrl = resolveDocumentUrl(doc.document);
                const fullUrl = resolveDocumentUrl(doc.document);

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
                      View
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiftDetails;
