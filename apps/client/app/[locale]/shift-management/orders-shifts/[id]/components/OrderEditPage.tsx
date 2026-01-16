"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import OrderForm from "@/components/Forms/orders";

const OrderEditPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const returnTo = searchParams.get("returnTo");

    if (returnTo) {
      return;
    } else {
      router.replace("/shift-management/orders-shifts/monthly");
    }
  }, [router, searchParams]);

  const returnTo = searchParams.get("returnTo");

  if (!returnTo) {
    return null;
  }

  return <OrderForm />;
};

export default OrderEditPage;
