"use client";
import React from "react";
import { Loader2 as LoaderIcon } from "lucide-react";

const Loader = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-transparent">
      <LoaderIcon size={64} className="animate-spin" />
    </div>
  );
};

export default Loader;
