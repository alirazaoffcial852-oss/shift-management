"use client";
import { useRouter, useParams } from "next/navigation";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import TrackCostService from "@/services/trackCost";
import { toast } from "sonner";
import { useTrackCostTable } from "@/hooks/trackCost/useTrackCost";
import { useTranslations } from "next-intl";

const AddTrackCostForm: React.FC = () => {
  const {
    validateForm,
    trackCost,
    error,
    handleTrackCostChange,
    loading,
    setLoading,
  } = useTrackCostTable();

  const router = useRouter();
  const params = useParams();
  const currentShiftId = params?.id as string;
  const t = useTranslations("pages.trackCost");

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("shift_id", currentShiftId);
      formData.append("track_cost", trackCost.replace(/,/g, ""));
      const response = await TrackCostService.createTrackCost(formData);
      toast.success(response?.message || t("trackCostAddedSuccessfully"));
      router.push("/track-cost");
    } catch (error: any) {
      console.error("Error adding track cost:", error);
      toast.error(error?.data?.message || t("failedToAddTrackCost"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-16">
      <p className="flex gap-6 text-sm text-gray-600">
        <span>{t("kmsTravelled")}</span>
        <span>{t("tollCost")}</span>
      </p>
      <div className="grid grid-cols-1 sm:gap-6">
        <SMSInput
          label={t("trackCost")}
          placeholder={t("trackCostPlaceholder")}
          value={trackCost}
          onChange={handleTrackCostChange}
          error={error}
          required
          className="w-full"
        />
      </div>

      <div className="flex justify-end mt-6 sm:mt-10">
        <SMSButton
          className="bg-black rounded-full"
          onClick={handleSubmit}
          disabled={loading || !trackCost.trim()}
        >
          {loading ? t("adding") : t("add")}
        </SMSButton>
      </div>
    </div>
  );
};

export default AddTrackCostForm;
