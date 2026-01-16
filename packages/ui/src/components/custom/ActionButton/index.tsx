import { useState } from "react";
import { LucideIcon } from "lucide-react";
import { ConfirmationDialog } from "@workspace/ui/components/custom/ConfirmationDialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";

interface ActionServices {
  [key: string]: ((id: number, ...args: any[]) => Promise<any>) | undefined;
}

interface BaseItem {
  id: number;
  name: string;
  [key: string]: any;
}

interface ActionButtonProps<T extends BaseItem> {
  item: T;
  services: ActionServices;
  onSuccess?: () => void;
  customConfig: {
    show?: boolean;
    title: string;
    description: string;
    confirmText: string;
    buttonText: string;
    icon?: LucideIcon;
    variant?: "default" | "destructive";
    style?: string;
  };
}

export const ActionButton = <T extends BaseItem>({
  item,
  services,
  onSuccess,
  customConfig,
}: ActionButtonProps<T>) => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const config = {
    title: customConfig.title,
    description: customConfig.description,
    confirmText: customConfig.confirmText,
    variant: customConfig.variant || "default",
    icon: customConfig.icon,
    style: customConfig.style || "hover:bg-gray-50 text-gray-600",
    handler: async () => {
      const serviceName = Object.keys(services)[0];
      if (!serviceName) {
        throw new Error("Service name not found");
      }
      const serviceFunction = services[serviceName];
      if (!serviceFunction) {
        throw new Error("Service not provided");
      }
      return serviceFunction(item.id);
    },
  };

  const Icon = config.icon;

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      await config.handler();
      onSuccess?.();
      setShowConfirmation(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      {customConfig.show && (
        <SMSButton
          onClick={handleButtonClick}
          className={`w-full block py-0 h-8 px-3 transition-colors text-left ${config.style} bg-transparent shadow-none rounded-none`}
        >
          <span className="flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4" />}
            <span className="text-sm">{customConfig.buttonText}</span>
          </span>
        </SMSButton>
      )}

      {showConfirmation && (
        <ConfirmationDialog
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirm}
          title={config.title}
          description={config.description}
          confirmText={config.confirmText}
          variant={config.variant}
        />
      )}
    </>
  );
};
