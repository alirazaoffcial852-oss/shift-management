"use client";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProjectUSNShiftsService from "@/services/projectUsnShift";
import EditUsnShift from "./components/editUsnShift";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function EditUsnShiftPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const shiftId = params.id as string;
  const returnTo = searchParams.get("returnTo") || "monthly";
  const [shift, setShift] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShift = async () => {
      try {
        const response = await ProjectUSNShiftsService.getProjectUSNShift(
          parseInt(shiftId)
        );
        const shiftData = response.data || response;
        setShift(shiftData);
      } catch (error) {
        console.error("Error fetching USN shift:", error);
      } finally {
        setLoading(false);
      }
    };

    if (shiftId) {
      fetchShift();
    }
  }, [shiftId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner size="lg" text="Loading USN shift..." />
      </div>
    );
  }

  if (!shift) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">USN shift not found</p>
      </div>
    );
  }

  return <EditUsnShift shift={shift} returnTo={returnTo} />;
}
