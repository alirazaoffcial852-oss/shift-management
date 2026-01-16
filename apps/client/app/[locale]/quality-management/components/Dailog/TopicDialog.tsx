"use client";

import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import TopicForm from "@/components/Forms/TopicForm";
import { DialogProps } from "@/types/topic";

const TopicDialog: React.FC<
  DialogProps & { addLocalTopic?: (topic: any) => void }
> = ({ isOpen, onOpenChange, onClose, type, id, refetch, addLocalTopic }) => {
  const t = useTranslations("pages.qualityManagement");

  const getTitleText = () => {
    return type === "add" ? t("letsCreateTopics") : t("letsEditTopic");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1300px] max-h-[90vh] px-6 sm:px-[50px] md:px-[100px] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 py-4">
          <DialogTitle className="w-full mx-auto text-center text-[28px] sm:text-[36px] mb-4 sm:mb-[76px] mt-[16px]">
            {getTitleText()}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pb-4">
          {type === "add" ? (
            <TopicForm
              useComponentAs="ADD"
              onClose={onClose}
              isDialog={true}
              refetch={refetch}
              addLocalTopic={addLocalTopic}
            />
          ) : (
            <TopicForm
              useComponentAs="EDIT"
              onClose={onClose}
              id={Number(id)}
              refetch={refetch}
              isDialog={true}
              addLocalTopic={addLocalTopic}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TopicDialog;
