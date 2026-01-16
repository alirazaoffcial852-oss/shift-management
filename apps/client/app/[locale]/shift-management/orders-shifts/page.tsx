"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const OrdersPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace("/shift-management/orders-shifts/monthly");
  }, [router]);

  return null;
};

export default OrdersPage;
