"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const WarehouseShiftsPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.replace(
      "/shift-management/project-usn-shifts/warehouse-shifts/monthly"
    );
  }, [router]);

  return null;
};

export default WarehouseShiftsPage;
