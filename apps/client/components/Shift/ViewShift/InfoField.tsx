import { Label } from "@workspace/ui/components/label";

export const InfoField = ({
  label,
  value,
}: {
  label?: string;
  value?: string;
}) => (
  <div className="space-y-1">
    {label && <Label className="text-sm font-semibold ">{label}</Label>}
    {value && (
      <p className="text-[10px]  sm:text-[14px] md:text-[14px] font-medium text-[#2D2E33] capitalize">
        {value || "N/A"}
      </p>
    )}
  </div>
);
