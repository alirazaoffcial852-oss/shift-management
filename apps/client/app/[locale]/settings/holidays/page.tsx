import React from "react";
import Viewholiday from "./components/viewHolidays";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const index = () => {
  return (
    <ProtectedRoute>
      <Viewholiday />
    </ProtectedRoute>
  );
};

export default index;
