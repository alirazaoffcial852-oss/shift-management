"use client";
import USNShiftsViewTabs from "@/components/USNShiftTabs";
import { useUsnShiftsViewTabs } from "@/hooks/projectUsnShifts/useUsnShiftsViewTabs";
import { useAuth } from "@/providers/appProvider";

export default function UsnShiftsViewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = useUsnShiftsViewTabs();
  const { isEmployee } = useAuth();

  return (
    <div className="space-y-6">
      {!isEmployee && (
        <div className="flex justify-start">
          <USNShiftsViewTabs />
        </div>
      )}
      {children}
    </div>
  );
}
