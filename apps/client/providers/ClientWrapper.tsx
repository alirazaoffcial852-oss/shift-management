"use client";

import React, { useEffect, useState } from "react";
import { AppProvider, useApp } from "./appProvider";
import Loader from "@/components/Loader/loader";

function ClientContent({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { initialLoading } = useApp();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted || initialLoading) {
    return <Loader />;
  }

  return <main className="flex-grow w-full max-w-full">{children}</main>;
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ClientContent>{children}</ClientContent>
    </AppProvider>
  );
}
