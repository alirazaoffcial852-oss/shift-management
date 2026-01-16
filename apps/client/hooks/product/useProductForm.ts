import { Product, ProductPersonnelPricing } from "@/types/product";
import CustomerService from "@/services/customer";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCompany } from "@/providers/appProvider";
import ProductService from "@/services/product";
import { validateProductForm } from "@/utils/validation/product";
import { toast } from "sonner";
import { createFormData } from "./components/formData";
import { Customer } from "@/types/customer";
import { Route, RouteOption } from "@/types/shared/route";
import LocomotiveService from "@/services/locomotive";

export const useProductForm = (
  id?: number,
  selectedOption?: string,
  onClose?: () => void,
  setCustomizeProduct?: (product: any) => void
) => {
  const router = useRouter();
  const { company } = useCompany();

  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [product, setProduct] = useState<Product>({
    name: "",
    customer_id: "",
    company_id: company?.id?.toString() || "",
    is_locomotive: false,
    has_flat_price: false,
    shift_flat_rate: null,
    has_toll_cost: false,
    show_in_dropdown: false,
    toll_cost: 0,
    routes: [],
    productPersonnelPricings: [],
  });

  const [initialProduct, setInitialProduct] = useState<Product | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [pagination, setpagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    total_pages: 0,
  });
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const getTotalSteps = () => (selectedOption === "edit" || "add" ? 6 : 5);

  useEffect(() => {
    fetchProductData();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        if (!company?.id) return;
        const response = await LocomotiveService.getAllRoute(
          company.id.toString()
        );
        if (response?.data) {
          const routeOptions: RouteOption[] = response.data.map(
            (route: any) => ({
              value: route.id.toString(),
              label: route.name,
            })
          );

          setRoutes(routeOptions);
        }
      } catch (error) {
        console.error("Error fetching routes:", error);
      }
    };
    fetchRoutes();
  }, [company]);

  const fetchProductData = useCallback(async () => {
    if (!id) return;
    try {
      const response = await ProductService.getProductById(id);
      if (response.data) {
        const formattedData = {
          id: response.data.id,
          name: response.data.name,
          customer_id: response.data.customer_id,
          company_id: response.data.company_id,
          is_locomotive: response.data.is_locomotive,
          has_flat_price: response.data.has_flat_price,
          flat_price: response.data.flat_price,
          shift_flat_rate: response.data.shift_flat_rate,
          has_toll_cost: response.data.has_toll_cost,
          show_in_dropdown: response.data.show_in_dropdown,
          toll_cost: response.data.toll_cost,
          routes: response.data.routes.map((route: Route) => ({
            id: route.id,
            route_id: route.route_id,
            rate: route.rate,
            rate_type: route.rate_type,
          })),
          productPersonnelPricings: response.data.productPersonnelPricings.map(
            (person: ProductPersonnelPricing) => ({
              id: person.id,
              company_role_id: person?.company_personnel_id,
              company_personnel_id: person?.company_personnel_id,
              far_away_hourly_rate: person?.far_away_hourly_rate,
              nearby_hourly_rate: person?.nearby_hourly_rate,
              costing_terms: person?.costing_terms,
              flat_price: person?.flat_price,
              included_in_flat_price: person?.included_in_flat_price,
              personnelNightShiftPricing: {
                id: person?.personnelNightShiftPricing?.id,
                night_time_rate:
                  person?.personnelNightShiftPricing?.night_time_rate,
                night_time_rate_type:
                  person?.personnelNightShiftPricing?.night_time_rate_type,
                night_shift_start_at:
                  person?.personnelNightShiftPricing?.night_shift_start_at,
                night_shift_end_at:
                  person?.personnelNightShiftPricing?.night_shift_end_at,
              },
              personnelTravellingPricing: {
                id: person?.personnelTravellingPricing?.id,
                travel_time_rate:
                  person?.personnelTravellingPricing?.travel_time_rate,
                travel_time_rate_type:
                  person?.personnelTravellingPricing?.travel_time_rate_type,
                travel_allowance_departure:
                  person?.personnelTravellingPricing
                    ?.travel_allowance_departure,
                travel_allowance_departure_type:
                  person?.personnelTravellingPricing
                    ?.travel_allowance_departure_type,
                travel_allowance_arrival:
                  person?.personnelTravellingPricing?.travel_allowance_arrival,
                travel_allowance_arrival_type:
                  person?.personnelTravellingPricing
                    ?.travel_allowance_arrival_type,
                full_day_travel_allowance:
                  person?.personnelTravellingPricing?.full_day_travel_allowance,
                full_day_travel_allowance_type:
                  person?.personnelTravellingPricing
                    ?.full_day_travel_allowance_type,
              },
              personnelHolidayPricing: {
                id: person?.personnelHolidayPricing?.id,
                holiday_rate: person?.personnelHolidayPricing?.holiday_rate,
                holiday_rate_type:
                  person?.personnelHolidayPricing?.holiday_rate_type,
                sunday_rate: person?.personnelHolidayPricing?.sunday_rate,
                sunday_rate_type:
                  person?.personnelHolidayPricing?.sunday_rate_type,
              },
            })
          ),
        };

        setInitialProduct(JSON.parse(JSON.stringify(formattedData)));
        setProduct(formattedData);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Failed to fetch product data");
    }
  }, [id]);

  const validateCurrentStep = (step: number) => {
    if (id) {
      if (step === 0 && !selectedOption && setCustomizeProduct) {
        return { option: "Please select an option to continue" };
      }

      if (step === 4 && selectedOption === "customize") {
        return {};
      }

      if (step === 4 && selectedOption !== "customize") {
        return validateProductForm(product, 3);
      }
    }

    return validateProductForm(product, step);
  };

  const handleContinue = () => {
    const stepErrors = validateCurrentStep(currentStep);
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length === 0) {
      if (currentStep < getTotalSteps() - 1) {
        if (selectedOption === "customize" && currentStep === 3) {
          setCurrentStep(4);
        } else {
          if (!product.is_locomotive && currentStep === 0) {
            setCurrentStep((prev) => prev + 2);
          } else {
            setCurrentStep((prev) => prev + 1);
          }
        }
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (!product.is_locomotive && currentStep === 2) {
      setCurrentStep((prev) => Math.max(0, prev - 2));
    } else setCurrentStep((prev) => Math.max(0, prev - 1));
    setErrors({});
  };

  const fetchCustomers = useCallback(
    async (page = 1, searchTerm = "") => {
      try {
        if (!company?.id) {
          return;
        }

        setIsLoadingCustomers(true);

        const response = await CustomerService.getAllCustomers(
          page,
          pagination.limit,
          company.id as number,
          "ACTIVE",
          searchTerm
        );

        if (response?.data) {
          setAllCustomers(response.data?.data);
          const newCustomers = response.data?.data?.map((customer: any) => ({
            id: customer.id,
            name: customer.name,
          }));

          if (page === 1) {
            setCustomers(newCustomers);
          } else {
            setCustomers((prev) => [...prev, ...newCustomers]);
          }

          if (response.data.pagination) {
            setpagination({
              page: response.data.pagination.page,
              limit: response.data.pagination.limit,
              total: response.data.pagination.total,
              total_pages: response.data.pagination.total_pages,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoadingCustomers(false);
      }
    },
    [company, pagination.limit]
  );

  useEffect(() => {
    if (company?.id) {
      fetchCustomers(1, "");
    }
  }, [company, fetchCustomers]);

  const handleSubmit = async () => {
    try {
      // Validate all steps before final submission
      let allValid = true;
      let finalErrors: { [key: string]: string } = {};

      for (let step = 0; step < getTotalSteps(); step++) {
        if (step === 1 && !product.is_locomotive) continue;
        const stepErrors = validateProductForm(product, step);
        finalErrors = { ...finalErrors, ...stepErrors };
        if (Object.keys(stepErrors).length > 0) {
          allValid = false;
        }
      }

      if (!allValid) {
        setErrors(finalErrors);
        for (let step = 0; step < getTotalSteps(); step++) {
          if (step === 1 && !product.is_locomotive) continue;
          const stepErrors = validateProductForm(product, step);
          if (Object.keys(stepErrors).length > 0) {
            setCurrentStep(step);
            break;
          }
        }
        return;
      }

      setIsSubmitting(true);
      const formData = createFormData(product, company?.id as number);

      let response;
      if (!selectedOption) {
        response = await (id
          ? ProductService.updateProduct(id, formData)
          : ProductService.createProduct(formData));
        toast.success(response?.message || "Operation successful");
        router.push("/products");
      } else {
        if (id && selectedOption === "edit") {
          response = await ProductService.updateProduct(id, formData);
        } else if (selectedOption === "customize") {
          return await handleCustomizeProduct();
        } else {
          response = await ProductService.createProduct(formData);
        }
        toast.success(response?.message || "Operation successful");
        if (onClose) {
          onClose();
        }
      }
    } catch (error) {
      if (error && typeof error === "object" && "data" in error) {
        toast.error((error as any).data.message);
      } else {
        if (error instanceof Error) {
          toast.error(error.message || "An error occurred");
        } else {
          toast.error("An error occurred");
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadMoreCustomers = useCallback(
    (searchTerm = "") => {
      if (pagination.page < pagination.total_pages) {
        fetchCustomers(pagination.page + 1, searchTerm);
      }
    },
    [fetchCustomers, pagination]
  );

  const handleSearchCustomers = useCallback(
    (searchTerm: string) => {
      setSearchQuery(searchTerm);

      setpagination((prev) => ({
        ...prev,
        page: 1,
      }));

      fetchCustomers(1, searchTerm);
    },
    [fetchCustomers]
  );

  const compareValues = (oldValue: any, newValue: any): boolean => {
    if (oldValue === newValue) return false;
    if (!oldValue && newValue) return true;
    if (oldValue && !newValue) return true;
    return JSON.stringify(oldValue) !== JSON.stringify(newValue);
  };

  const handleCustomizeProduct = async () => {
    if (!initialProduct || !product.id) return;

    const changes: any[] = [];

    // Compare main product fields
    const mainProductFields = [
      "has_flat_price",
      "flat_price",
      "shift_flat_rate",
      "has_toll_cost",
      "toll_cost",
      "show_in_dropdown",
    ];

    mainProductFields.forEach((field) => {
      if (
        compareValues(
          initialProduct[field as keyof Product],
          product[field as keyof Product]
        )
      ) {
        changes.push({
          product_id: product.id,
          table_name: "products",
          column_name: field,
          old_value: initialProduct[field as keyof Product],
          new_value: product[field as keyof Product],
          table_row_id: product.id,
        });
      }
    });

    // Compare routes with handling added and removed routes
    // Handle removed routes (present in initial but not in current)
    initialProduct.routes?.forEach((initialRoute) => {
      const existingRoute = product.routes?.find(
        (route) => route.route_id === initialRoute.route_id
      );

      if (!existingRoute) {
        // Route was removed
        changes.push({
          product_id: product.id,
          table_name: "product_routes",
          column_name: "rate",
          old_value: initialRoute.rate,
          new_value: 0,
          table_row_id: initialRoute.route_id,
        });
        changes.push({
          product_id: product.id,
          table_name: "product_routes",
          column_name: "rate_type",
          old_value: initialRoute.rate_type,
          new_value: "",
          table_row_id: initialRoute.route_id,
        });
      } else {
        // Route exists in both - check for changes
        ["rate", "rate_type"].forEach((field) => {
          if (
            compareValues(
              initialRoute[field as keyof Route],
              existingRoute[field as keyof Route]
            )
          ) {
            changes.push({
              product_id: product.id,
              table_name: "product_routes",
              column_name: field,
              old_value: initialRoute[field as keyof Route],
              new_value: existingRoute[field as keyof Route],
              table_row_id: initialRoute.route_id,
            });
          }
        });
      }
    });

    // Handle added routes (present in current but not in initial)
    product.routes?.forEach((currentRoute) => {
      const initialRoute = initialProduct.routes?.find(
        (route) => route.route_id === currentRoute.route_id
      );

      if (!initialRoute) {
        // New route was added
        changes.push({
          product_id: product.id,
          table_name: "product_routes",
          column_name: "rate",
          old_value: 0,
          new_value: currentRoute.rate,
          table_row_id: currentRoute.route_id,
        });
        changes.push({
          product_id: product.id,
          table_name: "product_routes",
          column_name: "rate_type",
          old_value: "",
          new_value: currentRoute.rate_type,
          table_row_id: currentRoute.route_id,
        });
      }
    });

    // Compare personnel pricing
    product.productPersonnelPricings?.forEach((pricing, index) => {
      const initialPricing = initialProduct.productPersonnelPricings?.[index];
      if (initialPricing) {
        // Main personnel pricing fields
        [
          "far_away_hourly_rate",
          "nearby_hourly_rate",
          "flat_price",
          "included_in_flat_price",
          "costing_terms",
        ].forEach((field) => {
          if (
            compareValues(
              initialPricing[field as keyof ProductPersonnelPricing],
              pricing[field as keyof ProductPersonnelPricing]
            )
          ) {
            changes.push({
              product_id: product.id,
              table_name: "productPersonnelPricing",
              column_name: field,
              old_value: initialPricing[field as keyof ProductPersonnelPricing],
              new_value: pricing[field as keyof ProductPersonnelPricing],
              table_row_id: pricing.id,
            });
          }
        });

        // Night shift pricing comparison
        if (
          pricing.personnelNightShiftPricing &&
          initialPricing.personnelNightShiftPricing
        ) {
          [
            "night_time_rate",
            "night_time_rate_type",
            "night_shift_start_at",
            "night_shift_end_at",
          ].forEach((field) => {
            if (
              compareValues(
                initialPricing.personnelNightShiftPricing?.[
                  field as keyof typeof pricing.personnelNightShiftPricing
                ],
                pricing.personnelNightShiftPricing?.[
                  field as keyof typeof pricing.personnelNightShiftPricing
                ]
              )
            ) {
              changes.push({
                product_id: product.id,
                table_name: "personnelNightShiftPricing",
                column_name: field,
                old_value:
                  initialPricing.personnelNightShiftPricing?.[
                    field as keyof typeof pricing.personnelNightShiftPricing
                  ],
                new_value:
                  pricing.personnelNightShiftPricing?.[
                    field as keyof typeof pricing.personnelNightShiftPricing
                  ],
                table_row_id: pricing.personnelNightShiftPricing?.id,
              });
            }
          });
        }

        // Travelling pricing comparison
        if (
          pricing.personnelTravellingPricing &&
          initialPricing.personnelTravellingPricing
        ) {
          [
            "travel_time_rate",
            "travel_time_rate_type",
            "travel_allowance_departure",
            "travel_allowance_departure_type",
            "travel_allowance_arrival",
            "travel_allowance_arrival_type",
            "full_day_travel_allowance",
            "full_day_travel_allowance_type",
          ].forEach((field) => {
            if (
              compareValues(
                initialPricing.personnelTravellingPricing?.[
                  field as keyof typeof pricing.personnelTravellingPricing
                ],
                pricing.personnelTravellingPricing?.[
                  field as keyof typeof pricing.personnelTravellingPricing
                ]
              )
            ) {
              changes.push({
                product_id: product.id,
                table_name: "personnelTravellingPricing",
                column_name: field,
                old_value:
                  initialPricing.personnelTravellingPricing?.[
                    field as keyof typeof pricing.personnelTravellingPricing
                  ],
                new_value:
                  pricing.personnelTravellingPricing?.[
                    field as keyof typeof pricing.personnelTravellingPricing
                  ],
                table_row_id: pricing.personnelTravellingPricing?.id,
              });
            }
          });
        }

        // Holiday pricing comparison
        if (
          pricing.personnelHolidayPricing &&
          initialPricing.personnelHolidayPricing
        ) {
          [
            "holiday_rate",
            "holiday_rate_type",
            "sunday_rate",
            "sunday_rate_type",
          ].forEach((field) => {
            if (
              compareValues(
                initialPricing.personnelHolidayPricing?.[
                  field as keyof typeof pricing.personnelHolidayPricing
                ],
                pricing.personnelHolidayPricing?.[
                  field as keyof typeof pricing.personnelHolidayPricing
                ]
              )
            ) {
              changes.push({
                product_id: product.id,
                table_name: "personnelHolidayPricing",
                column_name: field,
                old_value:
                  initialPricing.personnelHolidayPricing?.[
                    field as keyof typeof pricing.personnelHolidayPricing
                  ],
                new_value:
                  pricing.personnelHolidayPricing?.[
                    field as keyof typeof pricing.personnelHolidayPricing
                  ],
                table_row_id: pricing.personnelHolidayPricing?.id,
              });
            }
          });
        }
      }
    });

    if (setCustomizeProduct) {
      setCustomizeProduct(changes);
    }

    return changes;
  };

  return {
    product,
    setProduct,
    company,
    customers,
    routes,
    setRoutes,
    errors,
    setErrors,
    isSubmitting,
    currentStep,
    totalSteps: getTotalSteps(),
    handleContinue,
    handleBack,
    handleSubmit,
    createFormData,
    pagination,
    isLoadingCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
    searchQuery,
    fetchCustomers: () => fetchCustomers(1, ""),
    handleCustomizeProduct,
    allCustomers,
  };
};
