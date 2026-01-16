import React from "react";
import Company from "./components/Company";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const index = () => {
  return (
    <ProtectedRoute>
    <div className="p-6 ">
      <Company />
    </div>
    </ProtectedRoute>
  );
};

export default index;
