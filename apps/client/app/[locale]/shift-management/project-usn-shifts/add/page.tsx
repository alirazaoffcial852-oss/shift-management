"use client";
import React from "react";
import { useSearchParams } from "next/navigation";
import AddProjectUSNShift from "./components/addShift";

const page = () => {
  const searchParams = useSearchParams();
  const selectedDate = searchParams.get("date");
  const returnTo = searchParams.get("returnTo") || "monthly";

  return (
    <div>
      <AddProjectUSNShift selectedDate={selectedDate} returnTo={returnTo} />
    </div>
  );
};

export default page;
