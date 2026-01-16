"use client";

import { useTranslations } from "next-intl";

export default function UsnShiftsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("pages.projectUsn");
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[95rem] mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("projectUsnShifts")}
          </h1>
          <p className="text-gray-600 mt-2">
            {t("manageProjectUsnShiftsWithRoutePlanning")}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
