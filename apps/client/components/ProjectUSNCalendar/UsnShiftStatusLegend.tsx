import { cn } from "@workspace/ui/lib/utils";
import { Info } from "lucide-react";
import React, { useState } from "react";

const UsnShiftStatusLegend = () => {
  const [showPopover, setShowPopover] = useState(false);

  const statusList = [
    {
      title: "Open Shifts",
      colorCode: "border-dashed border-2 border-gray-400 bg-white",
    },
    {
      title: "Offer Shifts",
      colorCode: "border-dashed border-2 border-gray-400 bg-white",
    },
    { title: "Planned Shifts", colorCode: "bg-gray-200" },
    { title: "Fixed Shifts", colorCode: "bg-blue-50" },
    { title: "Submitted Shifts", colorCode: "bg-orange-100" },
    { title: "Approved Shifts", colorCode: "bg-yellow-100" },
    { title: "Billed Shifts", colorCode: "bg-green-100" },
    { title: "Rejected Shifts", colorCode: "bg-red-100" },
  ];

  const LegendItems = () => (
    <>
      {statusList.map((status, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn("w-5 h-5 rounded border", status.colorCode)}
            aria-label={status.title}
          ></div>
          <span className="ml-2 text-sm lowercase">{status.title}</span>
        </div>
      ))}
    </>
  );

  return (
    <>
      <div className="hidden xl:flex flex-wrap gap-x-4 gap-y-2 items-center">
        <LegendItems />
      </div>

      <div className="relative xl:hidden">
        <button
          className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300"
          onClick={() => setShowPopover(!showPopover)}
          onMouseEnter={() => setShowPopover(true)}
          onMouseLeave={() => setShowPopover(false)}
          aria-label="Show status legend"
        >
          <Info className="w-5 h-5" />
        </button>

        {showPopover && (
          <div
            className="absolute right-0 z-10 mt-2 p-4 bg-white rounded-lg shadow-lg w-64"
            onMouseEnter={() => setShowPopover(true)}
            onMouseLeave={() => setShowPopover(false)}
          >
            <div className="flex flex-col space-y-3">
              <h3 className="font-medium text-gray-900 border-b pb-2">
                USN Shift Status
              </h3>
              <LegendItems />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UsnShiftStatusLegend;
