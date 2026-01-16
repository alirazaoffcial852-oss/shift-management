"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import { toast } from "sonner";
import LoadingSpinner from "@/components/LoadingSpinner";
import { ProjectUSNShift } from "@/types/projectUsn";
import ShiftInformation from "../../components/ShiftInformation";

const EditShift = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shift, setShift] = useState<ProjectUSNShift | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const shiftId = params?.id as string;
  const returnTo = searchParams.get("returnTo") || "monthly";

  useEffect(() => {
    const fetchShift = async () => {
      if (!shiftId) return;

      try {
        setIsLoading(true);
        const response = await ProjectUSNShiftsService.getProjectUSNShift(
          parseInt(shiftId)
        );

        console.log(response, "response");

        const shiftData = response;

        const mappedShift = {
          ...shiftData,
          locomotive_id:
            shiftData.locomotive_id ||
            shiftData.usn_shift_locomotives?.[0]?.locomotive_id ||
            undefined,

          note: shiftData.note || shiftData.usn_shift_notes?.[0]?.note || "",

          warehouse_location_id:
            shiftData.location_id ||
            shiftData.usn_shift_warehouse_locations?.[0]?.location_id ||
            undefined,

          documents: shiftData.document
            ? [shiftData.document]
            : shiftData.usn_shift_documents?.map((d: any) => d.document) || [],
        };

        setShift(mappedShift);
      } catch (error) {
        console.error("Error fetching shift:", error);
        toast.error("Failed to fetch shift details");
        router.push(
          "/shift-management/project-usn-shifts/warehouse-shifts/monthly"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchShift();
  }, [shiftId, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading shift details..." />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Shift Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested shift could not be found.
          </p>
          <button
            onClick={() =>
              router.push(
                `/shift-management/project-usn-shifts/warehouse-shifts/${returnTo}`
              )
            }
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Calendar
          </button>
        </div>
      </div>
    );
  }

  const isWarehouseShift = !shift.has_route_planning;

  return (
    <ShiftInformation
      editMode={true}
      shiftId={parseInt(shiftId)}
      existingShift={shift}
      returnTo={returnTo}
      disableRoutePlanning={isWarehouseShift}
    />
  );
};

export default EditShift;
