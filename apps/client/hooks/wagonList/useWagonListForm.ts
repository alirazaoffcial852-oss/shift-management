"use client";

import { useEffect, useRef, useState } from "react";
import {
  FormErrors,
  Profile,
  Wagon,
  WagonFormData,
  WagonListResponse,
  WagonNumberItem,
} from "@/types/wagon";
import { useRouter } from "next/navigation";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import WagonListService from "@/services/wagonList";
import UserService from "@/services/user";

export const useWagonListForm = (
  shiftTrainId?: number,
  shiftTrainData?: {
    id: number;
    departure_location: string;
    locomotive_name?: string;
    shift_date?: string;
    shift?: any;
  } | null
) => {
  const router = useRouter();

  const [errors, setErrors] = useState<FormErrors>({});
  const [allWagonLists, setAllWagonLists] = useState<WagonListResponse[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);
  const signatureRef = useRef<SignatureCanvas>(null);
  const [isSignatureEmpty, setIsSignatureEmpty] = useState(true);
  const [wagonListData, setWagonListData] = useState<WagonListResponse>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wagons, setWagons] = useState<Wagon[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [existingDocuments, setExistingDocuments] = useState<string[]>([]);

  const [formData, setFormData] = useState<WagonFormData>({
    trainPreparation: {
      location: "",
      railNumber: 0,
      locomotive: "",
      trainNumber: 0,
    },
    technicalPreparations: {
      date: "",
      fromTime: "",
      toTime: "",
      vdvChecks: {
        level3a: false,
        level3b: false,
      },
      avvChecks: {
        zp: false,
        wu: false,
        wsu: false,
      },
      restrictions: {
        no: false,
        yes: false,
      },
    },
    brakePreparation: {
      brakeDate: "",
      brakeFromTime: "",
      brakeToTime: "",
      with: {
        locomotive: false,
        shuntingLocomotive: false,
        brakeTestingFacilities: false,
      },
      AsPerVDV757: {
        none: false,
        fullBreakingTest: false,
        simplifiedBreakingTest: false,
      },
      dangerousGoods: false,
      extraordinaryShipments: false,
      restrictions: {
        no: false,
        yes: false,
      },
      function: {
        AuditorLevel3: false,
        AuditorLevel4: false,
        Wagonauditor: false,
        Wagonmaster: false,
      },
    },
    wagonNumbers: {
      items: [
        {
          wagonNumber: "",
          wagonType: "",
          lengthOverBuffer: 0,
          loadedAxles: 0,
          emptyAxles: "",
          loadWeight: 0,
          weightOfWagon: "",
          totalWeight: 0,
          brakingWeightP: "",
          brakingWeightG: "",
          brakeSystemKLL: "",
          parkingBrake: false,
          automaticBrake: false,
          remark: "",
        },
      ],
      company: "",
      signature: "",
    },
    documents: [],
    deletedDocumentIds: [],
  });

  const fetchUserProfile = async () => {
    try {
      const response = await UserService.getUserProfile();
      setProfile(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch profile");
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (
      profile &&
      profile.employee &&
      profile.employee.company &&
      profile.employee.company.name
    ) {
      setFormData((prev) => ({
        ...prev,
        wagonNumbers: {
          ...prev.wagonNumbers,
          company: profile.employee.company.name,
        },
      }));
    }
  }, [profile]);

  const handleInputChange = (
    section: keyof WagonFormData,
    field: string,
    value: any,
    index?: number
  ) => {
    if (section === "documents") {
      if (field === "deletedIndexes") {
        setFormData((prev) => ({
          ...prev,
          deletedDocumentIds: value,
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          documents: value,
        }));
      }
      return;
    }
    const numericFields = [
      "trainNumber",
      "railNumber",
      "axles",
      "lengthOverBuffer",
      "loadedAxles",
      "loadWeight",
      "totalWeight",
    ];

    let processedValue: string | number | boolean = value;
    if (numericFields.includes(field) && typeof value === "string") {
      processedValue = value === "" ? "" : parseInt(value, 10) || "";
    }

    setFormData((prev) => {
      if (section === "wagonNumbers" && index !== undefined) {
        const updatedItems = [...prev.wagonNumbers.items];
        updatedItems[index] = {
          ...updatedItems[index],
          [field]: processedValue,
        } as WagonNumberItem;
        return {
          ...prev,
          wagonNumbers: {
            ...prev.wagonNumbers,
            items: updatedItems,
          },
        };
      }
      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: processedValue,
        },
      };
    });

    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleCheckboxChange = (
    section: keyof WagonFormData,
    field: string,
    subField?: string,
    index?: number
  ) => {
    setFormData((prev) => {
      if (section === "wagonNumbers" && index !== undefined) {
        const updatedItems = [...prev.wagonNumbers.items];
        const currentItem = updatedItems[index];

        if (!currentItem) return prev;

        updatedItems[index] = {
          ...currentItem,
          [field]: !currentItem[field as keyof WagonNumberItem],
        };

        return {
          ...prev,
          wagonNumbers: {
            ...prev.wagonNumbers,
            items: updatedItems,
          },
        };
      }

      if (subField) {
        return {
          ...prev,
          [section]: {
            ...prev[section],
            [field]: {
              ...(prev[section] as any)[field],
              [subField]: !(prev[section] as any)[field][subField],
            },
          },
        };
      }

      return {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: !(prev[section] as any)[field],
        },
      };
    });
  };

  const handleRestrictionsChange = (
    section: "technicalPreparations" | "brakePreparation",
    value: "no" | "yes"
  ) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        restrictions: {
          no: value === "no",
          yes: value === "yes",
        },
      },
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: FormErrors = {};

    const railNumber = Number(formData.trainPreparation.railNumber);

    if (
      !formData.trainPreparation.locomotive ||
      !formData.trainPreparation.locomotive.trim()
    ) {
      newErrors.locomotive = "Locomotive is required";
    }
    if (
      !formData.trainPreparation.location ||
      !formData.trainPreparation.location.trim()
    ) {
      newErrors.location = "Location is required";
    }
    if (!railNumber || railNumber <= 0) {
      newErrors.railNumber =
        "Rail number is required and must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.technicalPreparations.date) {
      newErrors.date = "Date is required";
    }
    if (!formData.technicalPreparations.fromTime) {
      newErrors.fromTime = "From time is required";
    }
    if (!formData.technicalPreparations.toTime) {
      newErrors.toTime = "To time is required";
    }

    if (
      formData.technicalPreparations.fromTime &&
      formData.technicalPreparations.toTime &&
      formData.technicalPreparations.fromTime >=
        formData.technicalPreparations.toTime
    ) {
      newErrors.toTime = "To time must be after from time";
    }

    if (
      !formData.technicalPreparations.vdvChecks.level3a &&
      !formData.technicalPreparations.vdvChecks.level3b
    ) {
      newErrors.general = "Please select at least one VDV 757 option";
    }

    if (
      !formData.technicalPreparations.avvChecks.zp &&
      !formData.technicalPreparations.avvChecks.wu &&
      !formData.technicalPreparations.avvChecks.wsu
    ) {
      newErrors.general =
        (newErrors.general ? newErrors.general + ". " : "") +
        "Please select at least one AVV option";
    }

    if (
      !formData.technicalPreparations.restrictions.no &&
      !formData.technicalPreparations.restrictions.yes
    ) {
      newErrors.general =
        (newErrors.general ? newErrors.general + ". " : "") +
        "Please select at least one restriction option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.brakePreparation.brakeDate) {
      newErrors.brakeDate = "Brake date is required";
    }
    if (!formData.brakePreparation.brakeFromTime) {
      newErrors.brakeFromTime = "Brake from time is required";
    }
    if (!formData.brakePreparation.brakeToTime) {
      newErrors.brakeToTime = "Brake to time is required";
    }

    if (
      formData.brakePreparation.brakeFromTime &&
      formData.brakePreparation.brakeToTime &&
      formData.brakePreparation.brakeFromTime >=
        formData.brakePreparation.brakeToTime
    ) {
      newErrors.brakeToTime = "Brake to time must be after brake from time";
    }

    if (
      !formData.brakePreparation.with.locomotive &&
      !formData.brakePreparation.with.shuntingLocomotive &&
      !formData.brakePreparation.with.brakeTestingFacilities
    ) {
      newErrors.general = "Please select at least one 'With' option";
    }

    if (
      !formData.brakePreparation.AsPerVDV757.none &&
      !formData.brakePreparation.AsPerVDV757.fullBreakingTest &&
      !formData.brakePreparation.AsPerVDV757.simplifiedBreakingTest
    ) {
      newErrors.general =
        (newErrors.general ? newErrors.general + ". " : "") +
        "Please select at least one 'As per VDV 757' option";
    }

    if (
      !formData.brakePreparation.restrictions.no &&
      !formData.brakePreparation.restrictions.yes
    ) {
      newErrors.general =
        (newErrors.general ? newErrors.general + ". " : "") +
        "Please select a restriction option in Brake Preparation";
    }

    if (
      !formData.brakePreparation.function.AuditorLevel3 &&
      !formData.brakePreparation.function.AuditorLevel4 &&
      !formData.brakePreparation.function.Wagonmaster &&
      !formData.brakePreparation.function.Wagonauditor
    ) {
      newErrors.general =
        (newErrors.general ? newErrors.general + ". " : "") +
        "Please select at least one function option";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!formData.wagonNumbers.signature || isSignatureEmpty) {
      newErrors.signature = "Signature is required";
      isValid = false;
    }

    if (
      !formData.wagonNumbers.company ||
      !formData.wagonNumbers.company.trim()
    ) {
      newErrors.company = "Company is required";
      isValid = false;
    }

    formData.wagonNumbers.items.forEach((wagon, index) => {
      const lengthOverBuffer = Number(wagon.lengthOverBuffer);
      const loadedAxles = Number(wagon.loadedAxles);
      const loadWeight = Number(wagon.loadWeight);
      const weightOfWagon = Number(wagon.weightOfWagon);
      const totalWeight = Number(wagon.totalWeight);

      const wagonNumberDigits = (wagon.wagonNumber || "").replace(/\D/g, "");
      if (!wagon.wagonNumber || wagon.wagonNumber.trim() === "") {
        newErrors[`wagonNumber-${index}`] = "Wagon number is required";
        isValid = false;
      } else if (wagonNumberDigits.length !== 12) {
        newErrors[`wagonNumber-${index}`] =
          "Wagon number must be 12 digits (format: 00 00 0000 000 0)";
        isValid = false;
      }

      if (!lengthOverBuffer || lengthOverBuffer <= 0) {
        newErrors[`lengthOverBuffer-${index}`] =
          "Length over buffer must be a positive number";
        isValid = false;
      }
      if (!loadedAxles || loadedAxles <= 0) {
        newErrors[`loadedAxles-${index}`] =
          "Loaded axles must be a positive number";
        isValid = false;
      }
      if (!loadWeight || loadWeight <= 0) {
        newErrors[`loadWeight-${index}`] =
          "Load weight must be a positive number";
        isValid = false;
      }
      if (!weightOfWagon || weightOfWagon <= 0) {
        newErrors[`weightOfWagon-${index}` as keyof FormErrors] =
          "Weight of wagon must be a positive number";
        isValid = false;
      }
      if (!totalWeight || totalWeight <= 0) {
        newErrors[`totalWeight-${index}`] =
          "Total weight must be a positive number";
        isValid = false;
      }

      if (!wagon.brakingWeightP || wagon.brakingWeightP.trim() === "") {
        newErrors[`brakingWeightP-${index}`] = "Braking weight P is required";
        isValid = false;
      }
      if (!wagon.brakingWeightG || wagon.brakingWeightG.trim() === "") {
        newErrors[`brakingWeightG-${index}`] = "Braking weight G is required";
        isValid = false;
      }

      if (!wagon.brakeSystemKLL || wagon.brakeSystemKLL.trim() === "") {
        newErrors[`brakeSystem-${index}`] = "Brake system KLL is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const prevStep = () => {
    setErrors({});
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const totalSteps = 2;

  const preventBubbling = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (
      !validateStep1() ||
      !validateStep2() ||
      !validateStep3() ||
      !validateStep4()
    ) {
      return;
    }

    setIsSubmitting(true);

    try {
      const signature = signatureRef.current?.toDataURL();

      const submissionData: WagonFormData = {
        trainPreparation: {
          locomotive: formData.trainPreparation.locomotive || "",
          location: formData.trainPreparation.location,
          railNumber: Number(formData.trainPreparation.railNumber),
          trainNumber: formData.trainPreparation.trainNumber || 0,
        },
        technicalPreparations: {
          date: formData.technicalPreparations.date,
          fromTime: formData.technicalPreparations.fromTime,
          toTime: formData.technicalPreparations.toTime,
          vdvChecks: formData.technicalPreparations.vdvChecks,
          avvChecks: formData.technicalPreparations.avvChecks,
          restrictions: formData.technicalPreparations.restrictions,
        },
        brakePreparation: {
          brakeDate: formData.brakePreparation.brakeDate,
          brakeFromTime: formData.brakePreparation.brakeFromTime,
          brakeToTime: formData.brakePreparation.brakeToTime,
          with: formData.brakePreparation.with,
          AsPerVDV757: formData.brakePreparation.AsPerVDV757,
          dangerousGoods: formData.brakePreparation.dangerousGoods,
          extraordinaryShipments:
            formData.brakePreparation.extraordinaryShipments,
          restrictions: formData.brakePreparation.restrictions,
          function: formData.brakePreparation.function,
        },
        wagonNumbers: {
          company:
            formData.wagonNumbers.company ||
            profile?.employee?.company?.name ||
            "",
          signature: signature || "",
          items: formData.wagonNumbers.items.map((item) => ({
            wagonNumber: item.wagonNumber || "",
            wagonType: item.wagonType || "",
            lengthOverBuffer: Number(item.lengthOverBuffer) || 0,
            loadedAxles: Number(item.loadedAxles) || 0,
            emptyAxles: item.emptyAxles ? Number(item.emptyAxles) : undefined,
            loadWeight: Number(item.loadWeight) || 0,
            weightOfWagon: Number(item.weightOfWagon) || 0,
            totalWeight: Number(item.totalWeight) || 0,
            brakingWeightP: item.brakingWeightP || "",
            brakingWeightG: item.brakingWeightG || "",
            brakeSystemKLL: item.brakeSystemKLL || "",
            parkingBrake: (item as any).parkingBrake || false,
            automaticBrake: (item as any).automaticBrake || false,
            remark: (item as any).remark || "",
          })),
        },
        documents: formData.documents || [],
        deletedDocumentIds: formData.deletedDocumentIds || [],
      };

      let response;
      if (wagonListData && wagonListData.id) {
        response = await WagonListService.updateWagonListById(
          wagonListData.id,
          submissionData,
          formData.deletedDocumentIds
        );
      } else {
        response = await WagonListService.createWagonList(
          submissionData,
          shiftTrainId || 0
        );
      }
      if (response) {
        toast.success(response.message);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/shift-management/regular-shifts/monthly");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ general: "Failed to submit form. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    setErrors({});
    let isValid = false;

    if (currentStep === 0) {
      const step1Errors: FormErrors = {};
      const step2Errors: FormErrors = {};
      const step3Errors: FormErrors = {};

      const railNumber = Number(formData.trainPreparation.railNumber);

      if (
        !formData.trainPreparation.locomotive ||
        !formData.trainPreparation.locomotive.trim()
      ) {
        step1Errors.locomotive = "Locomotive is required";
      }
      if (
        !formData.trainPreparation.location ||
        !String(formData.trainPreparation.location).trim()
      ) {
        step1Errors.location = "Location is required";
      }
      if (!railNumber || railNumber <= 0) {
        step1Errors.railNumber =
          "Rail number is required and must be greater than 0";
      }

      if (!formData.technicalPreparations.date) {
        step2Errors.date = "Date is required";
      }
      if (!formData.technicalPreparations.fromTime) {
        step2Errors.fromTime = "From time is required";
      }
      if (!formData.technicalPreparations.toTime) {
        step2Errors.toTime = "To time is required";
      }
      if (
        formData.technicalPreparations.fromTime &&
        formData.technicalPreparations.toTime &&
        formData.technicalPreparations.fromTime >=
          formData.technicalPreparations.toTime
      ) {
        step2Errors.toTime = "To time must be after from time";
      }
      if (
        !formData.technicalPreparations.vdvChecks.level3a &&
        !formData.technicalPreparations.vdvChecks.level3b
      ) {
        step2Errors.general = "Please select at least one VDV 757 option";
      }
      if (
        !formData.technicalPreparations.avvChecks.zp &&
        !formData.technicalPreparations.avvChecks.wu &&
        !formData.technicalPreparations.avvChecks.wsu
      ) {
        step2Errors.general =
          (step2Errors.general ? step2Errors.general + ". " : "") +
          "Please select at least one AVV option";
      }
      if (
        !formData.technicalPreparations.restrictions.no &&
        !formData.technicalPreparations.restrictions.yes
      ) {
        step2Errors.general =
          (step2Errors.general ? step2Errors.general + ". " : "") +
          "Please select at least one restriction option";
      }

      if (!formData.brakePreparation.brakeDate) {
        step3Errors.brakeDate = "Brake date is required";
      }
      if (!formData.brakePreparation.brakeFromTime) {
        step3Errors.brakeFromTime = "Brake from time is required";
      }
      if (!formData.brakePreparation.brakeToTime) {
        step3Errors.brakeToTime = "Brake to time is required";
      }
      if (
        formData.brakePreparation.brakeFromTime &&
        formData.brakePreparation.brakeToTime &&
        formData.brakePreparation.brakeFromTime >=
          formData.brakePreparation.brakeToTime
      ) {
        step3Errors.brakeToTime = "Brake to time must be after brake from time";
      }
      if (
        !formData.brakePreparation.with.locomotive &&
        !formData.brakePreparation.with.shuntingLocomotive &&
        !formData.brakePreparation.with.brakeTestingFacilities
      ) {
        step3Errors.general = "Please select at least one 'With' option";
      }
      if (
        !formData.brakePreparation.AsPerVDV757.none &&
        !formData.brakePreparation.AsPerVDV757.fullBreakingTest &&
        !formData.brakePreparation.AsPerVDV757.simplifiedBreakingTest
      ) {
        step3Errors.general =
          (step3Errors.general ? step3Errors.general + ". " : "") +
          "Please select at least one 'As per VDV 757' option";
      }
      if (
        !formData.brakePreparation.restrictions.no &&
        !formData.brakePreparation.restrictions.yes
      ) {
        step3Errors.general =
          (step3Errors.general ? step3Errors.general + ". " : "") +
          "Please select a restriction option in Brake Preparation";
      }
      if (
        !formData.brakePreparation.function.AuditorLevel3 &&
        !formData.brakePreparation.function.AuditorLevel4 &&
        !formData.brakePreparation.function.Wagonmaster &&
        !formData.brakePreparation.function.Wagonauditor
      ) {
        step3Errors.general =
          (step3Errors.general ? step3Errors.general + ". " : "") +
          "Please select at least one function option";
      }

      const generalErrors = [
        step1Errors.general,
        step2Errors.general,
        step3Errors.general,
      ]
        .filter(Boolean)
        .join(". ");

      const combinedErrors: FormErrors = {
        ...step1Errors,
        ...step2Errors,
        ...step3Errors,
      };

      if (generalErrors) {
        combinedErrors.general = generalErrors;
      }

      const filteredErrors: FormErrors = {};
      Object.keys(combinedErrors).forEach((key) => {
        const value = combinedErrors[key as keyof FormErrors];
        if (value !== undefined && value !== null && value !== "") {
          filteredErrors[key as keyof FormErrors] = value;
        }
      });

      setErrors(filteredErrors);
      isValid = Object.keys(filteredErrors).length === 0;
    } else if (currentStep === 1) {
      isValid = validateStep4();
    }

    if (isValid) {
      if (currentStep < totalSteps - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  useEffect(() => {
    fetchWagons();
  }, [currentPage, searchTerm, timeFilter, dateRange]);

  const fetchWagons = async () => {
    try {
      const response = await WagonListService.getAllWagonLists({
        page: currentPage,
        search: searchTerm,
        timeFilter,
        startDate: dateRange.start,
        endDate: dateRange.end,
      });
      setWagons(response.data);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Error fetching wagons:", error);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (filter: string) => {
    setTimeFilter(filter);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range: { start: string; end: string }) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  useEffect(() => {
    const fetchWagonListData = async () => {
      if (!shiftTrainId) return;
      try {
        const response = await WagonListService.getByShiftTrainId(shiftTrainId);
        if (response?.data) {
        setWagonListData(response.data);
        }
      } catch (error: any) {
        if (error?.response?.status !== 404) {
        console.error("Error fetching wagon list:", error);
        }
      }
    };
    fetchWagonListData();
  }, [shiftTrainId]);

  // Initialize formwith shift train data when provided (only for new wagon lists)
  useEffect(() => {
    if (shiftTrainData && !wagonListData) {
      const formatDate = (dateString: string | null | undefined) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      const shiftDate =
        formatDate(shiftTrainData.shift_date || shiftTrainData.shift?.date) ||
        "";

      setFormData((prev) => ({
        ...prev,
        trainPreparation: {
          ...prev.trainPreparation,
          locomotive: shiftTrainData.locomotive_name || "",
          location: shiftTrainData.departure_location || "",
        },
        technicalPreparations: {
          ...prev.technicalPreparations,
          date: shiftDate,
        },
        brakePreparation: {
          ...prev.brakePreparation,
          brakeDate: shiftDate,
        },
      }));
    }
  }, [shiftTrainData, wagonListData]);

  useEffect(() => {
    console.log(wagonListData, "wagonListData");
    if (wagonListData) {
      const formatDate = (dateString: string | null) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };
      setFormData({
        trainPreparation: {
          locomotive: wagonListData.locomotive || "",
          location: wagonListData.location || "",
          railNumber: wagonListData.rail_number || 0,
        },
        technicalPreparations: {
          date: formatDate(wagonListData.tech_prep_date) || "",
          fromTime: wagonListData.tech_prep_from_time || "",
          toTime: wagonListData.tech_prep_to_time || "",
          vdvChecks: {
            level3a: wagonListData.vdv_level_3a || false,
            level3b: wagonListData.vdv_level_3b || false,
          },
          avvChecks: {
            zp: wagonListData.avv_zp || false,
            wu: wagonListData.avv_wu || false,
            wsu: wagonListData.avv_wsu || false,
          },
          restrictions: {
            no: wagonListData.tech_prep_restrictions_no || false,
            yes: wagonListData.tech_prep_restrictions_yes || false,
          },
        },
        brakePreparation: {
          brakeDate: formatDate(wagonListData.brake_date) || "",
          brakeFromTime: wagonListData.brake_from_time || "",
          brakeToTime: wagonListData.brake_to_time || "",
          with: {
            locomotive: wagonListData.with_locomotive || false,
            shuntingLocomotive: wagonListData.with_shunting_locomotive || false,
            brakeTestingFacilities:
              wagonListData.with_brake_testing_facilities || false,
          },
          AsPerVDV757: {
            none: wagonListData.vdv_757_none || false,
            fullBreakingTest: wagonListData.vdv_757_full_breaking_test || false,
            simplifiedBreakingTest:
              wagonListData.vdv_757_simplified_breaking_test || false,
          },
          dangerousGoods: wagonListData.dangerous_goods || false,
          extraordinaryShipments:
            wagonListData.extraordinary_shipments || false,
          restrictions: {
            no: wagonListData.brake_prep_restrictions_no || false,
            yes: wagonListData.brake_prep_restrictions_yes || false,
          },
          function: {
            AuditorLevel3: wagonListData.function_auditor_level_3 || false,
            AuditorLevel4: wagonListData.function_auditor_level_4 || false,
            Wagonauditor: wagonListData.function_wagon_auditor || false,
            Wagonmaster: wagonListData.function_wagon_master || false,
          },
        },
        wagonNumbers: {
          items: wagonListData.wagonItems?.map((item: any) => {
            const formatWagonNumberFromParts = (
              num1: number,
              num2: number,
              num3: number,
              num4: number,
              num5: number
            ): string => {
              const part1 = String(num1 || 0).padStart(2, "0");
              const part2 = String(num2 || 0).padStart(2, "0");
              const part3 = String(num3 || 0).padStart(4, "0");
              const part4 = String(num4 || 0).padStart(3, "0");
              const part5 = String(num5 || 0);
              return `${part1} ${part2} ${part3} ${part4} ${part5}`;
            };

            const formatWagonNumberFromString = (
              wagonNumber: string
            ): string => {
              if (!wagonNumber) return "";
              const digits = wagonNumber.replace(/\D/g, "");
              if (digits.length === 0) return "";

              const paddedDigits = digits.padStart(12, "0");

              const part1 = paddedDigits.slice(0, 2);
              const part2 = paddedDigits.slice(2, 4);
              const part3 = paddedDigits.slice(4, 8);
              const part4 = paddedDigits.slice(8, 11);
              const part5 = paddedDigits.slice(11, 12);

              return `${part1} ${part2} ${part3} ${part4} ${part5}`;
            };

            let wagonNumber = "";
            if (item.wagon_number) {
              wagonNumber = formatWagonNumberFromString(item.wagon_number);
            } else if (item.wagon_number_1 !== undefined) {
              wagonNumber = formatWagonNumberFromParts(
                item.wagon_number_1 || 0,
                item.wagon_number_2 || 0,
                item.wagon_number_3 || 0,
                item.wagon_number_4 || 0,
                item.wagon_number_5 || 0
              );
            }

            // Calculate weightOfWagon from totalWeight - loadWeight if not provided
            const loadWeight = item.load_weight || 0;
            const totalWeight = item.total_weight || 0;
            const weightOfWagon =
              (item as any).weight_of_wagon ||
              (item as any).weightOfWagon || 
              (totalWeight > loadWeight ? totalWeight - loadWeight : "");

            return {
              wagonNumber: wagonNumber || "",
              wagonType: item.type_of_wagon || item.designation_letter || "",
              axles: item.axles || 0,
              lengthOverBuffer:
                item.length_over_buffer || item.length_over_buffet || 0,
              loadedAxles: item.loaded_axles || 0,
              emptyAxles: item.empty_axles || "",
              loadWeight: loadWeight,
              weightOfWagon: weightOfWagon,
              totalWeight: totalWeight,
              brakingWeightP: item.braking_weight_p || "",
              brakingWeightG: item.braking_weight_g || "",
              brakeSystemKLL: item.brake_system_kll || "",
              parkingBrake:
                item.parking_brake !== undefined
                  ? item.parking_brake
                  : item.parkingBrake || false,
              automaticBrake:
                item.has_automatic_brake !== undefined
                  ? item.has_automatic_brake
                  : item.automatic_brake !== undefined
                    ? item.automatic_brake
                    : item.automaticBrake || false,
              remark: item.remarks || item.remark || "",
            };
          }) || [
            {
              wagonNumber: "",
              wagonType: "",
              axles: 0,
              lengthOverBuffer: 0,
              loadedAxles: 0,
              emptyAxles: "",
              loadWeight: 0,
              weightOfWagon: "",
              totalWeight: 0,
              brakingWeightP: "",
              brakingWeightG: "",
              brakeSystemKLL: "",
              parkingBrake: false,
              automaticBrake: false,
              remark: "",
            },
          ],
          company: wagonListData.company || "",
          signature: wagonListData.signature || "",
        },
        documents: [],
        deletedDocumentIds: wagonListData.deletedDocumentIds,
      });

      setExistingDocuments(
        wagonListData.wagonDocuments?.map(
          (doc: { document: any }) => doc.document
        ) || []
      );

      if (wagonListData.signature && signatureRef.current) {
        setTimeout(() => {
          if (signatureRef.current && wagonListData.signature) {
            signatureRef.current.fromDataURL(wagonListData.signature);
            setIsSignatureEmpty(false);
          }
        }, 100);
      }
    }
  }, [wagonListData, shiftTrainId]);

  return {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleCheckboxChange,
    handleRestrictionsChange,
    prevStep,
    nextStep,
    currentStep,
    totalSteps,
    preventBubbling,
    signatureRef,
    handleSubmit,
    isSignatureEmpty,
    setIsSignatureEmpty,
    wagonListData,
    profile,
    allWagonLists,
    wagons,
    currentPage,
    totalPages,
    setCurrentPage,
    handleSearch,
    handleTimeFilterChange,
    handleDateRangeChange,
    existingDocuments,
  };
};
