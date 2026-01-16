"use client";

import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { useTranslations } from "next-intl";
import { SMSBackButton } from "@workspace/ui/components/custom/SMSBackButton";
import { ExternalLink } from "lucide-react";
import Image from "next/image";

const ShiftDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const [shift, setShift] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("pages.shift");

  const fetchShift = async () => {
    if (!id) {
      setError("No shift ID provided");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await ProjectUSNShiftsService.getProjectUSNShift(
        Number(id)
      );
      if (response) {
        setShift(response);
      } else {
        throw new Error("No shift data received");
      }
    } catch (err: any) {
      console.error("Error fetching shift:", err);
      setError(err.message || "Failed to fetch shift details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShift();
  }, [id]);

  const getLocomotiveName = () => {
    if (shift?.usn_shift_locomotives?.[0]?.locomotive) {
      return shift.usn_shift_locomotives[0].locomotive.name;
    }
    return "N/A";
  };

  const getWarehouseLocation = () => {
    if (shift?.usn_shift_warehouse_locations?.[0]?.location) {
      return shift.usn_shift_warehouse_locations[0].location.name;
    }
    return "N/A";
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
    const url = `${baseUrl}/${doc.document}`;
    window.open(url, "_blank");
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
        <div className="text-red-600 text-xl mb-4">Error: {error}</div>
        <button
          onClick={fetchShift}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-xl">No shift found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-4">
      <div className="mx-auto">
        <div className="mb-6 flex items-center gap-4">
          <SMSBackButton />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Warehouse Shift Details
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Basic Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Date:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.date
                    ? format(new Date(shift.date), "dd/MM/yyyy")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Start Time:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.start_time
                    ? formatInTimeZone(shift.start_time, "UTC", "hh:mm a")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">End Time:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.end_time
                    ? formatInTimeZone(shift.end_time, "UTC", "hh:mm a")
                    : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Status:</span>
                <span
                  className={`text-sm font-medium px-3 py-1 rounded-full ${
                    shift.status === "PLANNED"
                      ? "bg-blue-100 text-blue-800"
                      : shift.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : shift.status === "SUBMITTED"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {shift.status || "N/A"}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Warehouse Information
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-gray-600 text-sm">
                  Warehouse Location:
                </span>
                <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">
                  {getWarehouseLocation()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Has Locomotive:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_locomotive ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Has Note:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_note ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm">Has Documents:</span>
                <span className="text-gray-900 text-sm font-medium">
                  {shift.has_document ? "Yes" : "No"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {shift.usn_shift_roles && shift.usn_shift_roles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Personnel
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {shift.usn_shift_roles.map((role: any, index: number) => (
                <div key={role.id || index} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">
                    {role.role?.name || "Role"}
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Employee:</span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.usn_shift_personnels?.[0]?.employee?.user?.name ||
                          "Not assigned"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Proximity:</span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.proximity || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Break:</span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.break_duration
                          ? `${role.break_duration} min`
                          : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Start Day:</span>
                      <span className="text-gray-900 text-sm font-medium">
                        {role.start_day || "No"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {shift.product_usn?.customer && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Customer Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Customer:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {shift.product_usn.customer.name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Email:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {shift.product_usn.customer.email || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Phone:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {shift.product_usn.customer.phone || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Contact Person:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {shift.product_usn.customer.contact_person_name || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Contact Phone:</span>
                  <span className="text-gray-900 text-sm font-medium">
                    {shift.product_usn.customer.contact_person_phone || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-gray-600 text-sm">Address:</span>
                  <span className="text-gray-900 text-sm font-medium text-right max-w-[60%]">
                    {shift.product_usn.customer.address || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {shift.has_note && shift.note && (
          <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
              Notes
            </h3>
            <p className="text-gray-700 text-sm whitespace-pre-wrap">
              {shift.note}
            </p>
          </div>
        )}

        {shift.has_document &&
          shift.usn_shift_documents &&
          shift.usn_shift_documents.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                Documents
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

                  return (
                    <div
                      key={doc.id}
                      className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                      onClick={() => viewDocument(doc)}
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
                        View
                      </div>
                    </div>
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
