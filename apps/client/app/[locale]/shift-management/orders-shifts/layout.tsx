"use client";
import { ConfirmationProvider } from "@/providers/ConfirmationProvider";
import { PropsWithChildren } from "react";
import { useOrderCalendar } from "@/hooks/order/useOrderCalendar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useTranslations } from "next-intl";

const OrdersLayout = ({ children }: PropsWithChildren) => {
  const { isLoading } = useOrderCalendar("monthly");
  const t = useTranslations("pages.order");

  if (isLoading) {
    return (
      <div className="container lg:w-[98%] mx-auto">
        <ConfirmationProvider>
          <div className="flex items-center justify-center min-h-[400px]">
            <LoadingSpinner size="lg" text={t("loadingOrders")} />
          </div>
        </ConfirmationProvider>
      </div>
    );
  }

  return (
    <>
      <div className="container lg:w-[98%] mx-auto">
        <ConfirmationProvider>{children}</ConfirmationProvider>
      </div>
    </>
  );
};

export default OrdersLayout;
