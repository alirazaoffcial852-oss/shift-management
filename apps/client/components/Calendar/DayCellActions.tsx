import { useCalendar } from "@/hooks/shift/useCalendar";
import {
  ContextMenuContent,
  ContextMenuItem,
} from "@workspace/ui/components/context-menu";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

export const DayCellActions = ({ date }: { date: Date }) => {
  const { handleCreateShift, handleCreateOfferShift, isEmployee } =
    useCalendar();
  const t = useTranslations("pages.calandar.Actions");
  const { hasPermission } = usePermission();

  return (
    <ContextMenuContent className="w-64">
      {hasPermission("shift.create") && (
      <ContextMenuItem onClick={() => handleCreateShift(date)}>
        {t("create_shift")}
      </ContextMenuItem>
      )}
      {hasPermission("shift.create") && (
      <ContextMenuItem onClick={() => handleCreateOfferShift(date)}>
        {t("createOffer")}
      </ContextMenuItem>
      )}
    </ContextMenuContent>
  );
};
