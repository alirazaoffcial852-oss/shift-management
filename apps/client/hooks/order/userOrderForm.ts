"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import OrderService from "@/services/order.service";
import {
  CreateOrderData,
  FormErrors,
  SupplierLocation,
  TariffLocation,
} from "@/types/order";

export const useOrderForm = (id?: number, onClose?: () => void) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const urlDate = searchParams.get("date");

  const [formData, setFormData] = useState<CreateOrderData>({
    supplier_id: 0,
    tariff_id: 0,
    delivery_date: "",
    type_of_wagon: "",
    no_of_wagons: 0,
    tonnage: 0,
    distance_in_km: 0,
    return_schedule: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [supplierLocations, setSupplierLocations] = useState<
    SupplierLocation[]
  >([]);
  const [tariffLocations, setTariffLocations] = useState<TariffLocation[]>([]);
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(false);
  const [isLoadingTariffs, setIsLoadingTariffs] = useState(false);

  const isDateFromUrl = Boolean(urlDate);

  const fetchSupplierLocations = useCallback(async () => {
    try {
      setIsLoadingSuppliers(true);
      const response = await OrderService.getSupplierLocations();

      if (response?.data) {
        setSupplierLocations(response.data);
      }
    } catch (error) {
      console.error("Error fetching supplier locations:", error);
      toast.error("Failed to fetch supplier locations");
    } finally {
      setIsLoadingSuppliers(false);
    }
  }, []);

  const fetchTariffLocations = useCallback(async () => {
    try {
      setIsLoadingTariffs(true);
      const response = await OrderService.getTariffLocations();
      if (response?.data) {
        setTariffLocations(response.data);
      }
    } catch (error) {
      console.error("Error fetching tariff locations:", error);
      toast.error("Failed to fetch tariff locations");
    } finally {
      setIsLoadingTariffs(false);
    }
  }, []);

  const formatDateForInput = (date: Date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (urlDate && !id) {
      const parsedDate = new Date(`${urlDate}T00:00:00`);

      if (Number.isNaN(parsedDate.getTime())) {
        setFormData((prev) => ({
          ...prev,
          delivery_date: "",
          return_schedule: "",
        }));
        return;
      }

      const returnDate = new Date(parsedDate);
      returnDate.setDate(returnDate.getDate() + 2);

      setFormData((prev) => ({
        ...prev,
        delivery_date: formatDateForInput(parsedDate),
        return_schedule: formatDateForInput(returnDate),
      }));
    }
  }, [urlDate, id]);

  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        try {
          const response = await OrderService.getOrderById(id);
          const orderData = response.data;
          setFormData({
            supplier_id: orderData.supplier_id,
            tariff_id: orderData.tariff_id,
            delivery_date: orderData.delivery_date,
            type_of_wagon: orderData.type_of_wagon
              ? orderData.type_of_wagon.toUpperCase()
              : "",
            no_of_wagons: orderData.no_of_wagons,
            tonnage: orderData.tonnage,
            distance_in_km: orderData.distance_in_km,
            return_schedule: orderData.return_schedule,
          });
        } catch (error) {
          console.error("Error fetching order:", error);
          toast.error("Failed to fetch order data");
        }
      };
      fetchOrder();
    }
  }, [id]);

  useEffect(() => {
    fetchSupplierLocations();
    fetchTariffLocations();
  }, [fetchSupplierLocations, fetchTariffLocations]);

  const handleInputChange = <Field extends keyof CreateOrderData>(
    field: Field,
    value: CreateOrderData[Field] | Date | null
  ) => {
    setFormData((prev) => {
      if (field === "delivery_date") {
        if (!value) {
          return { ...prev, delivery_date: "", return_schedule: "" };
        }

        let deliveryDate: Date | null = null;
        let formattedDelivery = "";

        if (value instanceof Date) {
          formattedDelivery = formatDateForInput(value);
          deliveryDate = new Date(`${formattedDelivery}T00:00:00`);
        } else if (typeof value === "string") {
          deliveryDate = new Date(`${value}T00:00:00`);
          if (Number.isNaN(deliveryDate.getTime())) {
            return {
              ...prev,
              delivery_date: value,
              return_schedule: "",
            };
          }
          formattedDelivery = value;
        } else {
          return { ...prev, delivery_date: "", return_schedule: "" };
        }

        const returnDate = new Date(deliveryDate);
        returnDate.setDate(returnDate.getDate() + 2);

        return {
          ...prev,
          delivery_date: formattedDelivery,
          return_schedule: formatDateForInput(returnDate),
        };
      }

      if (field === "return_schedule") {
        if (!value) {
          return { ...prev, return_schedule: "" };
        }

        if (value instanceof Date) {
          return {
            ...prev,
            return_schedule: formatDateForInput(value),
          };
        }

        if (typeof value === "string") {
          return { ...prev, return_schedule: value };
        }

        return prev;
      }

      if (field === "type_of_wagon" && typeof value === "string") {
        return { ...prev, type_of_wagon: value.toUpperCase() as string };
      }

      if (value === null || value instanceof Date) {
        return prev;
      }

      return { ...prev, [field]: value as CreateOrderData[Field] };
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.supplier_id) newErrors.supplier_id = "Supplier is required";
    if (!formData.tariff_id) newErrors.tariff_id = "Tariff Point is required";
    if (!formData.delivery_date)
      newErrors.delivery_date = "Delivery Date is required";
    if (!formData.type_of_wagon)
      newErrors.type_of_wagon = "Type of Wagon is required";
    if (!formData.no_of_wagons || formData.no_of_wagons <= 0)
      newErrors.no_of_wagons = "Number of Wagons is required";
    if (!formData.tonnage || formData.tonnage <= 0)
      newErrors.tonnage = "Tonnage is required";
    if (!formData.distance_in_km || formData.distance_in_km <= 0)
      newErrors.distance_in_km = "Distance is required";
    if (!formData.return_schedule)
      newErrors.return_schedule = "Return Schedule is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      if (!id) {
        const orderData: CreateOrderData[] = [
          {
            ...formData,
            type_of_wagon: formData.type_of_wagon.toUpperCase(),
          },
        ];
        const response = await OrderService.createOrder(orderData);
        toast.success(response?.message || "Order created successfully");
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("supplier_id", formData.supplier_id.toString());
        formDataToSend.append("tariff_id", formData.tariff_id.toString());
        formDataToSend.append("delivery_date", formData.delivery_date);
        formDataToSend.append(
          "type_of_wagon",
          formData.type_of_wagon.toUpperCase()
        );
        formDataToSend.append("no_of_wagons", formData.no_of_wagons.toString());
        formDataToSend.append("tonnage", formData.tonnage.toString());
        formDataToSend.append(
          "distance_in_km",
          formData.distance_in_km.toString()
        );
        formDataToSend.append("return_schedule", formData.return_schedule);
        const response = await OrderService.updateOrder(id, formDataToSend);
        toast.success(response?.message || "Order updated successfully");
      }

      if (onClose) {
        onClose();
      } else {
        const returnTo = searchParams.get("returnTo");
        if (returnTo) {
          router.push(`/shift-management/orders-shifts/${returnTo}`);
        } else {
          router.push("/shift-management/orders-shifts/monthly");
        }
      }

      return true;
    } catch (error: any) {
      const errorMessage = error?.data?.message || "An error occurred";
      toast.error(errorMessage);
      console.error("Error submitting form:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const supplierOptions = supplierLocations.map((location) => ({
    value: location.id.toString(),
    label: location.name,
  }));

  const tariffOptions = tariffLocations.map((location) => ({
    value: location.id.toString(),
    label: location.name,
  }));

  return {
    formData,
    errors,
    loading,
    handleInputChange,
    handleSubmit,
    supplierOptions,
    tariffOptions,
    isLoadingSuppliers,
    isLoadingTariffs,
    isDateFromUrl,
  };
};
