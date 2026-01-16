"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import RegularHandoverBooksTable from "./components/RegularHandoverBooksTable";
import USNHandoverBooksTable from "./components/USNHandoverBooksTable";
import "@/components/OrderViewTabs/tabs.css";

export default function HandoverBookDocumentsPage() {
  const t = useTranslations("common");
  const [activeTab, setActiveTab] = useState("regular");

  return (
    <div className="container mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">
        {t("handover_book_documents")}
      </h1>

      <div className="mb-6 max-w-md">
        <div
          className="sms-radio-inputs"
          style={{ flexWrap: "nowrap", width: "auto", display: "flex" }}
        >
          <label className="sms-radio">
            <input
              checked={activeTab === "regular"}
              name="handover-tabs"
              type="radio"
              onChange={() => setActiveTab("regular")}
            />
            <span className="name">{t("regular_shift_handover_books")}</span>
          </label>
          <label className="sms-radio">
            <input
              checked={activeTab === "usn"}
              name="handover-tabs"
              type="radio"
              onChange={() => setActiveTab("usn")}
            />
            <span className="name">{t("usn_shift_handover_books")}</span>
          </label>
        </div>
      </div>

      {activeTab === "regular" && (
        <div className="mt-6">
          <RegularHandoverBooksTable />
        </div>
      )}

      {activeTab === "usn" && (
        <div className="mt-6">
          <USNHandoverBooksTable />
        </div>
      )}
    </div>
  );
}
