"use client";

import { RATE_TYPE } from "@/types/rate";
import { Route } from "@/types/shared/route";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import TypeSelection from "@workspace/ui/components/custom/TypeSelection";
import { PriceModelFormProps } from "./components/productForm";
import { useTranslations } from "next-intl";

export function PriceForm({
  product,
  onUpdate,
  routes,
  setRoutes,
  errors,
  onContinue,
  handleBack,
  isSubmitting = false,
}: PriceModelFormProps) {
  const tactions = useTranslations("actions");

  const handleRouteChange = (
    routeId: string,
    field: "rate" | "rate_type",
    value: number | RATE_TYPE
  ) => {
    const updatedRoutes = product.routes ? [...product.routes] : [];

    const routeIndex = updatedRoutes.findIndex(
      (route) => route.route_id === routeId
    );

    if (routeIndex !== -1) {
      updatedRoutes[routeIndex] = {
        ...updatedRoutes[routeIndex],
        [field]: value,
      } as Route;
    } else {
      updatedRoutes.push({
        route_id: routeId,
        rate: field === "rate" ? (value as number) : 0,
        rate_type: field === "rate_type" ? (value as RATE_TYPE) : "FLAT",
      } as Route);
    }

    onUpdate({
      ...product,
      routes: updatedRoutes,
    });
  };
  const handlerRoutesName = (routeId: string) => {
    const route = routes.find(
      (route) => route.value.toString() === routeId.toString()
    );
    return route ? route.label : "";
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {product.routes && product.routes.length > 0 ? (
          product.routes.map((route: Route, index) => (
            <TypeSelection
              key={route.route_id}
              label={handlerRoutesName(route.route_id)}
              name={`rate_${route.route_id}`}
              value={route.rate.toString()}
              onChange={(e) =>
                handleRouteChange(
                  route.route_id,
                  "rate",
                  parseFloat(e.target.value?.toString() || "0")
                )
              }
              placeholder="Enter rate"
              error={errors[`routes[${index}].rate`]}
              type={route.rate_type}
              allowedTypes={["FLAT", "HOURLY"]}
              onTypeChange={(newType) =>
                handleRouteChange(
                  route.route_id,
                  "rate_type",
                  newType as RATE_TYPE
                )
              }
              required={true}
            />
          ))
        ) : (
          <div className="col-span-2 text-center text-gray-500">
            No routes selected. Please go back and select routes first.
          </div>
        )}
      </div>

      <div className="flex justify-between mt-10">
        <SMSButton
          className="bg-transparent text-[18px] shadow-none p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
          onClick={handleBack}
        >
          {tactions("back")}
        </SMSButton>
        <SMSButton className="bg-black rounded-full" onClick={onContinue}>
          {tactions("continue")}
        </SMSButton>
      </div>
    </div>
  );
}
