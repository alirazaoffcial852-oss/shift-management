import React from "react";
import ViewRoles from "./components/viewRoles";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const index = () => {
  return (
    <ProtectedRoute>
      <ViewRoles />
    </ProtectedRoute>
  );
};

export default index;
