"use client";
import { ShiftInformationFormProps } from "./types/form";
import { BasicDetail } from "./BasicDetail";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Product } from "@/types/product";
import { useTranslations } from "next-intl";
import { PersonalDetail } from "./PersonalDetail";
import { useEffect, useState } from "react";
import ProductService from "@/services/product";

export function ShiftInformationForm({
  shifts,
  onUpdate,
  errors,
  useComponentAs = "ADD",
  onContinue,
  handleBack,
  products,
  setCustomizeProduct,
}: ShiftInformationFormProps) {
  const t = useTranslations("pages.shift");
  const [fetchedProduct, setFetchedProduct] = useState<Product | null>(null);

  let selectedProduct: Product | undefined = products.find(
    (product) => product.id?.toString() === shifts.product_id?.toString()
  );

  useEffect(() => {
    const fetchProductById = async () => {
      if (!shifts.product_id) {
        setFetchedProduct(null);
        return;
      }

      if (
        fetchedProduct &&
        fetchedProduct.id?.toString() === shifts.product_id?.toString()
      ) {
        return;
      }

      if (!selectedProduct) {
        try {
          const response = await ProductService.getProductById(
            Number(shifts.product_id)
          );
          if (response?.data) {
            const normalizedProduct: Product = {
              ...response.data,
              productPersonnelPricings:
                response.data.productPersonnelPricings?.map((person: any) => {
                  const personnel = person?.personnel;
                  const roleId =
                    personnel?.id ||
                    personnel?.role_id ||
                    person?.company_personnel_id;

                  return {
                    id: person.id,
                    company_role_id: person?.company_personnel_id,
                    company_personnel_id: person?.company_personnel_id,
                    far_away_hourly_rate: person?.far_away_hourly_rate,
                    nearby_hourly_rate: person?.nearby_hourly_rate,
                    costing_terms: person?.costing_terms,
                    flat_price: person?.flat_price,
                    included_in_flat_price: person?.included_in_flat_price,
                    personnel: {
                      id: roleId,
                      role_id: roleId,
                      role: personnel?.role || {
                        id: roleId,
                        name: personnel?.name || `Role ${roleId}`,
                        company_id:
                          personnel?.company_id || response.data.company_id,
                      },
                    },
                    personnelNightShiftPricing:
                      person?.personnelNightShiftPricing,
                    personnelTravellingPricing:
                      person?.personnelTravellingPricing,
                    personnelHolidayPricing: person?.personnelHolidayPricing,
                  };
                }) || [],
            };
            setFetchedProduct(normalizedProduct);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          setFetchedProduct(null);
        }
      } else {
        setFetchedProduct(null);
      }
    };

    fetchProductById();
  }, [shifts.product_id, selectedProduct?.id, fetchedProduct?.id]);

  if (!selectedProduct && fetchedProduct) {
    selectedProduct = fetchedProduct;
  }

  return (
    <div>
      <BasicDetail
        shifts={shifts}
        onUpdate={onUpdate}
        errors={errors}
        products={products}
        setCustomizeProduct={setCustomizeProduct}
      />

      {selectedProduct?.productPersonnelPricings && (
        <PersonalDetail
          key={selectedProduct.id}
          shifts={shifts}
          onUpdate={onUpdate}
          errors={errors}
          product={selectedProduct}
        />
      )}

      {useComponentAs === "ADD" && (
        <div className="flex justify-between mt-10">
          <SMSButton
            className="bg-transparent text-[18px] shadow-none p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
            onClick={handleBack}
          >
            {t("back")}
          </SMSButton>
          <SMSButton className="bg-black rounded-full  " onClick={onContinue}>
            {t("continue")}
          </SMSButton>
        </div>
      )}
    </div>
  );
}
