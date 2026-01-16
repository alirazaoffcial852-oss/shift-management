"use client";
import { useParams } from "next/navigation";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTrackCostEdit } from "@/hooks/trackCost/useTrackCost";

const EditTrackCostForm: React.FC = () => {
  const params = useParams();
  const trackCostId = params?.id as string;

  const {
    trackCost,
    error,
    loading,
    isLoading,
    handleTrackCostChange,
    updateTrackCost,
    totalCost,
  } = useTrackCostEdit(trackCostId);

  const handleSubmit = async () => {
    await updateTrackCost();
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-16">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
          <div className="h-10 bg-gray-200 rounded w-24 ml-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-16">
      <p className="flex gap-6 text-sm text-gray-600">
        <span>KMs Travelled: 20KM</span>
        <span>Toll Cost {totalCost} euros</span>
      </p>
      <div className="grid grid-cols-1 sm:gap-6">
        <SMSInput
          label="Track Cost"
          placeholder="ex: 10,000"
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
          {loading ? "Updating..." : "Update"}
        </SMSButton>
      </div>
    </div>
  );
};

export default EditTrackCostForm;
