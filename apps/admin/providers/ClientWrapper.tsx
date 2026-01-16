"use client";

import Header from "@/components/Header";
import { AppProvider, useApp } from "@/providers/appProvider";
import { Loader } from "lucide-react";

function ClientContent({ children }: { children: React.ReactNode }) {
  const { initialLoading } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F3F3]">
      <Header />
      <main className="flex-grow">
        {initialLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader className="animate-spin" />
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
}

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <ClientContent>{children}</ClientContent>
    </AppProvider>
  );
}
