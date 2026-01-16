import React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@workspace/ui/components/select";
import { Label } from "@workspace/ui/components/label";
import { SUBSCRPTION_TYPES } from "@/constants/client.constant";
import { Subscription } from "@workspace/ui/types/client";
import { SubscriptionPaymentSectionProps } from "@/types/clientForm.interface";
import { useLocale } from "next-intl";

export const SubscriptionPaymentSection: React.FC<
  SubscriptionPaymentSectionProps
> = ({ client, errors, isEditMode, handleInputChange }) => {
  const subscription: Partial<Subscription> =
    (Array.isArray(client.subscriptions) && client.subscriptions.length > 0
      ? client.subscriptions[0]
      : {}) || {};

  const handleSubscriptionChange = (field: string, value: string) => {
    handleInputChange("subscriptions", field, value);
  };

  const locale = useLocale();

  return (
    <>
      <div className="space-y-1">
        <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1">
          Subscription Type
        </Label>
        <Select
          value={subscription.subscription_type}
          disabled={isEditMode}
          onValueChange={(value) =>
            handleSubscriptionChange("subscription_type", value)
          }
          required
        >
          <SelectTrigger
            className="h-[54px] w-full rounded-[16px]"
            error={errors["subscriptions.subscription_type"]}
          >
            <SelectValue placeholder="Select subscription type" />
          </SelectTrigger>
          <SelectContent>
            {SUBSCRPTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors["subscriptions.subscription_type"] && (
          <p className="mt-1 text-xs md:text-sm text-red-600">
            {errors["subscriptions.subscription_type"]}
          </p>
        )}
      </div>

      <SMSInput
        label="Amount"
        disabled={isEditMode}
        value={subscription.amount}
        onChange={(e) => handleSubscriptionChange("amount", e.target.value)}
        required
        error={errors["subscriptions.amount"]}
        name="amount"
        type="text"
        placeholder="Enter amount"
      />

      {!isEditMode && (
        <SMSInput
          label="Subscription Date"
          disabled={isEditMode}
          value={subscription.subscription_date}
          onChange={(e) =>
            handleSubscriptionChange("subscription_date", e.target.value)
          }
          required
          error={errors["subscriptions.subscription_date"]}
          name="subscription_date"
          type="date"
          popoverDirection="up"
          i18n={locale}
        />
      )}
    </>
  );
};
