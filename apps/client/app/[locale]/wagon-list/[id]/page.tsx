"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import AddWagonList from "../components/addWagonlist";
import ShiftService from "@/services/shift";

const page: React.FC = () => {
  const params = useParams();
  const shiftTrainId = params?.id ? Number(params.id) : null;
  const [shiftTrainData, setShiftTrainData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShiftData = async () => {
      if (!shiftTrainId) {
        setLoading(false);
        return;
      }

      try {
        // Fetch all shifts to find the one containing our shiftTrainId
        const response = await ShiftService.getAllShifts(
          "",
          "",
          null,
          "ALL",
          null,
          {}
        );

        if (response?.data?.data && Array.isArray(response.data.data)) {
          // Find the shift that contains our shiftTrainId
          for (const shift of response.data.data) {
            if (shift.shiftTrain && Array.isArray(shift.shiftTrain)) {
              const matchingTrain = shift.shiftTrain.find(
                (st: any) => st.id === shiftTrainId
              );

              if (matchingTrain) {
                // Get locomotive name from shiftLocomotive
                const locomotiveName =
                  shift.shiftLocomotive?.[0]?.locomotive?.name ||
                  shift.locomotive?.name ||
                  "";

                setShiftTrainData({
                  ...matchingTrain,
                  locomotive_name: locomotiveName,
                  shift_date: shift.date,
                  shift: shift,
                });
                break;
              }
            }
          }
        }
      } catch (error) {
        console.error("Error fetching shift data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchShiftData();
  }, [shiftTrainId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full mt-20">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex md:gap-32">
      <div className="lg:ml-4 p-4 lg:p-0 flex-1 overflow-x-auto">
        <AddWagonList shiftTrainData={shiftTrainData} />
      </div>
    </div>
  );
};

export default page;
