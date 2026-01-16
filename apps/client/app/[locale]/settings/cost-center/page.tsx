import React from "react";
import CostCenter from "./components/viewCostCenter";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <CostCenter />
    </ProtectedRoute>
  );
};

export default page;
