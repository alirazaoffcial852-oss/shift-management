"use client";

import React from "react";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { Edit, Train, CirclePlus, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TrainData {
  id: number;
  shift_id: number;
  train_no: string;
  departure_location: string;
  arrival_location: string;
  created_at: string;
  updated_at: string;
  wagonList: {} | null;
  freight_transport: boolean;
}

const TrainsTable: React.FC = () => {
  const router = useRouter();
  const trains = JSON.parse(localStorage.getItem("trains") || "[]");

  const handleWagonList = (train: TrainData) => {
    const hasWagonList = !!train.wagonList;
    const freight_transport = train.freight_transport;
    if (!freight_transport) {
      let alertMessage = "";
      if (!freight_transport) {
        alertMessage =
          "Freight transport must be enabled to access wagon list.";
      }
      toast.error(alertMessage);
      return;
    }

    router.push(`/wagon-list/${train.id}`);
  };

  const handleEditWagonList = (train: TrainData) => {
    const hasWagonList = !!train.wagonList;
    const freight_transport = train.freight_transport;

    if (!freight_transport || !hasWagonList) {
      let alertMessage = "";

      if (!freight_transport && !hasWagonList) {
        alertMessage =
          "Both freight transport must be enabled and wagon list must exist to edit.";
      } else if (!freight_transport) {
        alertMessage = "Freight transport must be enabled to edit wagon list.";
      } else if (!hasWagonList) {
        alertMessage = "Wagon list must exist to edit it.";
      }

      alert(alertMessage);
      return;
    }

    router.push(`/wagon-list/${train.id}`);
  };

  const columns = [
    {
      header: "Train No",
      accessor: "train_no",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "Departure Location",
      accessor: "departure_location",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "Arrival Location",
      accessor: "arrival_location",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "Freight Transport",
      accessor: "freight_transport",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (value: boolean) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {value ? "True" : "False"}
        </span>
      ),
    },
    {
      header: "Shift ID",
      accessor: "shift_id",
      className: "font-semibold",
      headerClassName: "text-gray-500",
    },
    {
      header: "Created At",
      accessor: "created_at",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (value: string) => {
        return new Date(value).toLocaleDateString();
      },
    },
    {
      header: "Updated At",
      accessor: "updated_at",
      className: "font-semibold",
      headerClassName: "text-gray-500",
      render: (value: string) => {
        return new Date(value).toLocaleDateString();
      },
    },
  ];

  const actions = [
    {
      label: "Wagon List",
      element: (row: TrainData) => {
        console.log(row, "row");
        const hasWagonList = !!row.wagonList;
        const freight_transport = row.freight_transport;
        const canProceed = hasWagonList && freight_transport;

        console.log(freight_transport, "freight_transport");
        console.log(hasWagonList, "hasWagonList");
        console.log(canProceed, "canProceed");

        return (
          <button
            onClick={() =>
              hasWagonList && freight_transport
                ? handleEditWagonList(row)
                : handleWagonList(row)
            }
            className={`flex items-center gap-2 px-3 py-2 text-sm ${
              canProceed
                ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                : !freight_transport
                  ? "text-red-600 hover:text-red-800 hover:bg-red-50"
                  : "text-blue-600 hover:text-blue-800 hover:bg-blue-50"
            } rounded-md transition-colors w-full text-left`}
          >
            {!freight_transport ? (
              <>
                <AlertCircle className="h-4 w-4" />
                Freight Required
              </>
            ) : hasWagonList ? (
              <>
                <Edit className="h-4 w-4" />
                Edit Wagon List
              </>
            ) : (
              <>
                <CirclePlus className="h-4 w-4" />
                Add Wagon List
              </>
            )}
          </button>
        );
      },
    },
  ];

  return (
    <div className="p-4 mt-44">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Train className="h-6 w-6 text-green-800" />
          <h2 className="text-xl font-bold">Shift Trains</h2>
        </div>

        {trains.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-green-800">
              <strong>Total Trains:</strong> {trains.length}
            </p>
          </div>
        )}
      </div>
      <SMSTable
        onDateRangeChange={() => {}}
        onSearchChange={() => {}}
        columns={columns}
        data={trains}
        actions={actions}
        onPageChange={() => {}}
        pagination={true}
        search={true}
        currentPage={1}
        totalPages={Math.ceil(trains.length / 10)}
        isLoading={false}
        enableSelection={false}
        className="w-full overflow-x-auto mt-6 border-separate border-spacing-y-3"
      />
    </div>
  );
};

export default TrainsTable;
