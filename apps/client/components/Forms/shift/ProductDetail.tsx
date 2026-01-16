"use client";
import { useCompany } from "@/providers/appProvider";
import { Shift } from "@/types/shift";
import { Product } from "@/types/product";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { FORMMODE } from "@/types/shared/global";
import { useTranslations } from "next-intl";

interface ProductDetailProps {
  shifts: Shift;
  products: Product[];
  useComponentAs?: FORMMODE;
  handleBack: () => void;
  onContinue: () => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({
  shifts,
  products,
  handleBack,
  onContinue,
  useComponentAs = "ADD",
}) => {
  const t = useTranslations("pages.shift");
  const { company } = useCompany();

  let hasLocomotive =
    company?.configuration?.has_locomotive && shifts.shiftDetail.has_locomotive;
  let selectedProduct =
    products.find(
      (product) => product.id?.toString() === shifts.product_id.toString()
    ) || ({} as Product);
  return (
    <div className="space-y-3">
      {/* {hasLocomotive && (
        <div className="grid grid-cols-1 gap-6 !mt-[54px]">
          <div>
            <h3>{t("locomotiveSubCategories")}</h3>{" "}
          </div>
          <div className="border border-gray-300 rounded-lg p-4 flex gap-2">
            {selectedProduct?.routes?.map((data: any) => (
              <div
                key={data?.route?.id}
                className="bg-gray-100 p-2 rounded-md mb-2 w-fit"
              >
                {data?.route?.name}
              </div>
            )) || <div>{t("noRoutesAvailable")}</div>}{" "}
          </div>
        </div>
      )} */}
      {useComponentAs === "ADD" && (
        <div className="flex justify-between mt-10">
          <SMSButton
            className="bg-transparent text-[18px] shadow-none p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
            onClick={handleBack}
          >
            {t("backButton")}
          </SMSButton>
          <SMSButton className="bg-black rounded-full" onClick={onContinue}>
            {t("continueButton")}
          </SMSButton>
        </div>
      )}
    </div>
  );
};
