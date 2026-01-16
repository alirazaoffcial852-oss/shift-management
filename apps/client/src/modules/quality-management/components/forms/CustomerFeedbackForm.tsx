"use client";

import * as React from "react";
import { StarRating } from "@workspace/ui/components/custom/StarRating";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTranslations } from "next-intl";

interface CustomerFeedbackFormProps {
  customerName?: string;
  onSave?: (data: CustomerFeedbackData) => void;
}

interface CustomerFeedbackData {
  overallRating: number;
  travelRating: number;
  accommodationRating: number;
  notes: string;
}

export default function CustomerFeedbackForm({
  customerName = "Customer Name",
  onSave,
}: CustomerFeedbackFormProps) {
  const t = useTranslations("pages.qualityManagement");
  const tCommon = useTranslations("common.buttons");

  const [travelRating, setTravelRating] = React.useState(0);
  const [accommodationRating, setAccommodationRating] = React.useState(0);
  const [notes, setNotes] = React.useState("");
  const [overallRating, setOverallRating] = React.useState(0);

  // Auto-calculate overall rating when individual ratings change
  React.useEffect(() => {
    const calculatedRating = (travelRating + accommodationRating) / 2;
    setOverallRating(calculatedRating);
  }, [travelRating, accommodationRating]);

  const handleSave = () => {
    const data: CustomerFeedbackData = {
      overallRating,
      travelRating,
      accommodationRating,
      notes,
    };
    onSave?.(data);
  };

  return (
    <div className="w-full mx-auto py-6">
      {/* Header - Centered, Semi Bold, #2D2E33 */}
      <div className="mb-6">
        <h2
          className="text-center font-semibold leading-[100%]"
          style={{
            fontSize: "28px",
            color: "#2D2E33",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {t("giveFeedbackToCustomer", { name: customerName })}
        </h2>
      </div>

      {/* Overall Rating - Semi Bold, Letter Spacing -3% */}
      <div className="mb-6">
        <div className="flex items-center justify-center gap-3 mb-3">
          <span
            className="font-semibold leading-[100%]"
            style={{
              fontSize: "20px",
              color: "#2D2E33",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {t("overallRating")}:
          </span>
          <span
            className="font-semibold leading-[100%]"
            style={{
              fontSize: "20px",
              color: "#FFA500",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.03em",
            }}
          >
            {overallRating.toFixed(1)}
          </span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"></div>
        </div>
        {/* <StarRating
          value={overallRating}
          onChange={setOverallRating}
          size={22}
          className="cursor-pointer"
        /> */}
      </div>

      {/* Topics Label - Semi Bold, #818285 */}
      <div className="mb-5">
        <h3
          className="font-semibold mb-4"
          style={{
            fontSize: "16px",
            color: "#818285",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
          }}
        >
          {t("topicsLabel")}
        </h3>

        {/* Travel Rating - Semi Bold, #000000 */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-semibold"
            style={{
              fontSize: "20px",
              color: "#000000",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {t("travel")}
          </span>
          <StarRating
            value={travelRating}
            size={22}
            onChange={setTravelRating}
          />
        </div>

        {/* Accommodation Rating - Semi Bold, #000000 */}
        <div className="flex items-center gap-3 mb-4">
          <span
            className="font-semibold"
            style={{
              fontSize: "20px",
              color: "#000000",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {t("accommodation")}
          </span>
          <StarRating
            value={accommodationRating}
            size={22}
            onChange={setAccommodationRating}
          />
        </div>
      </div>

      {/* Notes Section - Label Semi Bold #818285, Placeholder Regular #818285 */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span
            className="font-semibold"
            style={{
              fontSize: "16px",
              color: "#818285",
              fontFamily: "Inter, sans-serif",
              fontWeight: 600,
            }}
          >
            {t("notes")}:
          </span>
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center"></div>
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("notesPlaceholder")}
          className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-[#818285] placeholder:font-normal"
          style={{
            fontSize: "16px",
            color: "#2D2E33",
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
          }}
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end mt-8 pt-4 border-t border-gray-200">
        <SMSButton
          text={tCommon("save")}
          className="bg-black rounded-full min-w-[120px]"
          onClick={handleSave}
        />
      </div>
    </div>
  );
}
