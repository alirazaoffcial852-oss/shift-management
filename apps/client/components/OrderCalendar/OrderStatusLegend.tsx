import { cn } from "@workspace/ui/lib/utils";
import { Info } from "lucide-react";
import React, { useState } from "react";

const OrderStatusLegend = () => {
  const [showPopover, setShowPopover] = useState(false);

  const statusList = [
    { title: "Open Orders", colorCode: "bg-blue-100 border-blue-200" },
    { title: "Pending Orders", colorCode: "bg-yellow-100 border-yellow-200" },
    {
      title: "Planned Completed",
      colorCode: "bg-purple-100 border-purple-200",
    },
    { title: "Completed Orders", colorCode: "bg-green-100 border-green-200" },
    { title: "Cancelled Orders", colorCode: "bg-red-100 border-red-200" },
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
      <div className="hidden xl:flex items-center flex-wrap gap-5 ml-8">
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
                Order Status
              </h3>
              <LegendItems />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default OrderStatusLegend;
