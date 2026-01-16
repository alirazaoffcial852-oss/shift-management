import React from "react";
import TypeOfOperation from "./components/viewTypeOfOperation";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const page = () => {
  return (
    <ProtectedRoute>
      <TypeOfOperation />
    </ProtectedRoute>
  );
};

export default page;
