import React, { useState } from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
import { WagonFormData, FormErrors, WagonNumberItem } from "@/types/wagon";
import { useTranslations } from "next-intl";
import SignatureCanvas from "react-signature-canvas";
import {
  Plus,
  Trash2,
  FileText,
  ImageIcon,
  FileIcon,
  ExternalLink,
  X,
} from "lucide-react";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { DropZone } from "@/components/FileUpload/DropZone";
import { useWagonFileUpload } from "@/hooks/wagonList/useWagonFileUpload";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { wagonTypeDisplayNames } from "@/types/order";

interface WagonNumberFormProps {
  formData: WagonFormData;
  errors: FormErrors;
  handleInputChange: (
    section: keyof WagonFormData,
    field: string,
    value: any,
    index?: number
  ) => void;
  handleCheckboxChange: (
    section: keyof WagonFormData,
    field: string,
    subField?: string,
    index?: number
  ) => void;
  signatureRef: React.RefObject<SignatureCanvas>;
  preventBubbling: (e: React.MouseEvent) => void;
  setIsSignatureEmpty: (isEmpty: boolean) => void;
  isSignatureEmpty: boolean;
  existingDocuments?: string[];
}

interface WagonDocument {
  id: number;
  document: string;
}

const WagonNumberForm: React.FC<WagonNumberFormProps> = ({
  formData,
  errors,
  handleInputChange,
  signatureRef,
  preventBubbling,
  setIsSignatureEmpty,
  existingDocuments = [],
}) => {
  const t = useTranslations("pages.wegonList");
  const [wagonNumberInputs, setWagonNumberInputs] = useState<
    Record<number, string>
  >({});

  const wagonTypeOptions = wagonTypeDisplayNames.map((displayName) => ({
    label: displayName,
    value: displayName.toUpperCase(),
  }));

  const brakingTypeOptions = [
    { value: "K", label: "K" },
    { value: "L", label: "L" },
    { value: "LL", label: "LL" },
    { value: "GG", label: "GG" },
    { value: "D", label: "D" },
    { value: "OK_N_N", label: "OK_N_N" },
    { value: "BEFREIUNG", label: "BEFREIUNG" },
    { value: "X", label: "X" },
  ];

  const yesNoOptions = [
    { value: t("Yes") || "Yes", label: t("Yes") || "Yes" },
    { value: t("No") || "No", label: t("No") || "No" },
  ];

  const getBrakeSystemValue = (wagon: WagonNumberItem): string => {
    return wagon.brakeSystemKLL || "";
  };

  const handleBrakeSystemChange = (index: number, value: string) => {
    const updatedItems = [...formData.wagonNumbers.items];
    const currentItem = updatedItems[index];

    if (!currentItem) {
      console.error(`No wagon item found at index ${index}`);
      return;
    }

    const updatedItem: WagonNumberItem = {
      ...currentItem,
      brakeSystemKLL: value || "",
    };

    updatedItems[index] = updatedItem;
    handleInputChange("wagonNumbers", "items", updatedItems);
  };

  const {
    dragActive,
    handleDrop,
    handleDrag,
    handleFileInput,
    files,
    existingDocs,
    removeFile,
    removeExistingDoc,
  } = useWagonFileUpload({
    existingDocuments: existingDocuments,
    onFilesChange: (newFiles) => {
      handleInputChange("documents", "files", newFiles);
    },
    onExistingDocsChange: (newDocs, deletedIndexes) => {
      handleInputChange("documents", "deletedIndexes", deletedIndexes || []);
    },
  });

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split(".").pop()?.toLowerCase();

    if (["pdf"].includes(extension || "")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "bmp", "webp"].includes(extension || "")
    ) {
      return <ImageIcon className="h-6 w-6 text-blue-500" />;
    } else {
      return <FileIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const viewDocument = (file: File | WagonDocument) => {
    let url: string;

    if (file instanceof File) {
      url = URL.createObjectURL(file);
    } else {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
        "http://localhost:5051";
      url = `${baseUrl}/${file.document}`;
    }

    window.open(url, "_blank");

    if (file instanceof File) {
      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 100);
    }
  };

  const handleRemoveExistingDocument = (index: number) => {
    removeExistingDoc(index);
  };

  const handleAddWagon = () => {
    const newWagonItem: WagonNumberItem = {
      weightOfWagon: "",
      wagonNumber: "",
      wagonType: "",
      lengthOverBuffer: "",
      loadedAxles: "",
      emptyAxles: "",
      loadWeight: "",
      totalWeight: "",
      brakingWeightP: "",
      brakingWeightG: "",
      brakeSystemKLL: "",
      parkingBrake: false,
      automaticBrake: false,
      remark: "",
    };
    handleInputChange("wagonNumbers", "items", [
      ...formData.wagonNumbers.items,
      newWagonItem,
    ]);
  };

  const handleRemoveWagon = (index: number) => {
    const updatedItems = formData.wagonNumbers.items.filter(
      (_, i) => i !== index
    );
    handleInputChange("wagonNumbers", "items", updatedItems);
  };

  const formatWagonNumberInput = (value: string): string => {
    const digits = value.replace(/\D/g, "").slice(0, 12);

    if (digits.length === 0) {
      return "";
    }

    let formatted = "";

    if (digits.length > 0) {
      formatted += digits.slice(0, 2);
    }
    if (digits.length > 2) {
      formatted += " " + digits.slice(2, 4);
    }
    if (digits.length > 4) {
      formatted += " " + digits.slice(4, 8);
    }
    if (digits.length > 8) {
      formatted += " " + digits.slice(8, 11);
    }
    if (digits.length > 11) {
      formatted += " " + digits.slice(11, 12);
    }

    return formatted;
  };

  const parseWagonNumber = (
    value: string
  ): {
    wagonNumber1: number;
    wagonNumber2: number;
    wagonNumber3: number;
    wagonNumber4: number;
    wagonNumber5: number;
  } => {
    const digits = value.replace(/\D/g, "");

    return {
      wagonNumber1: parseInt(digits.slice(0, 2) || "0", 10) || 0,
      wagonNumber2: parseInt(digits.slice(2, 4) || "0", 10) || 0,
      wagonNumber3: parseInt(digits.slice(4, 8) || "0", 10) || 0,
      wagonNumber4: parseInt(digits.slice(8, 11) || "0", 10) || 0,
      wagonNumber5: parseInt(digits.slice(11, 12) || "0", 10) || 0,
    };
  };

  const handleWagonNumberInput = (index: number, value: string) => {
    const formatted = formatWagonNumberInput(value);

    setWagonNumberInputs((prev) => ({
      ...prev,
      [index]: formatted,
    }));

    const updatedItems = [...formData.wagonNumbers.items];
    const currentItem = updatedItems[index];

    if (!currentItem) {
      console.error(`No wagon item found at index ${index}`);
      return;
    }

    const updatedItem: WagonNumberItem = {
      ...currentItem,
      wagonNumber: formatted,
    };

    updatedItems[index] = updatedItem;
    handleInputChange("wagonNumbers", "items", updatedItems);
  };

  const getWagonNumberDisplayValue = (
    index: number,
    wagon: WagonNumberItem
  ): string => {
    if (wagonNumberInputs[index] !== undefined) {
      return wagonNumberInputs[index];
    }

    return wagon.wagonNumber || "";
  };

  const handleWagonInputChange = (
    index: number,
    field: keyof WagonNumberItem,
    value: string | number | boolean
  ) => {
    const updatedItems = [...formData.wagonNumbers.items];
    const currentItem = updatedItems[index];

    if (!currentItem) {
      console.error(`No wagon item found at index ${index}`);
      return;
    }

    const updatedItem: WagonNumberItem = {
      ...currentItem,
      [field]: value,
    };

    // Auto-calculate totalWeight when loadWeight or weightOfWagon changes
    if (field === "loadWeight" || field === "weightOfWagon") {
      const loadWeight =
        field === "loadWeight"
          ? Number(value) || 0
          : Number(updatedItem.loadWeight) || 0;
      const weightOfWagon =
        field === "weightOfWagon"
          ? Number(value) || 0
          : Number(updatedItem.weightOfWagon) || 0;

      updatedItem.totalWeight = (loadWeight + weightOfWagon).toString();
    }

    updatedItems[index] = updatedItem;
    handleInputChange("wagonNumbers", "items", updatedItems);
  };

  const handleWagonCheckboxChange = (
    index: number,
    field: keyof WagonNumberItem
  ) => {
    const updatedItems = [...formData.wagonNumbers.items];
    const currentItem = updatedItems[index];
    if (!currentItem) {
      console.error(`No wagon item found at index ${index}`);
      return;
    }
    const updatedItem: WagonNumberItem = {
      ...currentItem,
      [field]: !currentItem[field],
    };

    // Auto-fill remark with "A" when automaticBrake is checked
    if (field === "automaticBrake" && updatedItem.automaticBrake) {
      updatedItem.remark = "A";
    }

    updatedItems[index] = updatedItem;
    handleInputChange("wagonNumbers", "items", updatedItems);
  };

  const getWagonTitle = (index: number) => {
    const wagon = formData.wagonNumbers.items[index];
    if (wagon?.wagonNumber && wagon.wagonNumber.trim() !== "") {
      return `Wagon ${wagon.wagonNumber}`;
    }
    return `Wagon ${index + 1}`;
  };

  return (
    <section className="mb-6 p-6 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        {t("WagonNumberInformation")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SMSInput
          name="company"
          label={t("Company")}
          type="text"
          value={formData.wagonNumbers.company}
          onChange={(e) =>
            handleInputChange("wagonNumbers", "company", e.target.value)
          }
          error={errors.company}
          disabled
        />
        <div>
          <Label className="block mb-2">{t("Signature")}</Label>
          <div className="border border-gray-300 rounded-md p-2">
            <SignatureCanvas
              ref={signatureRef}
              canvasProps={{
                className: "w-full h-32 bg-white",
                onMouseLeave: preventBubbling,
                onMouseOut: preventBubbling,
              }}
              onBegin={() => setIsSignatureEmpty(false)}
              onEnd={() => {
                const signature = signatureRef.current?.toDataURL();
                if (signature) {
                  handleInputChange("wagonNumbers", "signature", signature);
                }
              }}
            />
          </div>
          <div className="mt-2">
            <button
              type="button"
              onClick={() => {
                signatureRef.current?.clear();
                setIsSignatureEmpty(true);
                handleInputChange("wagonNumbers", "signature", "");
              }}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              {t("ClearSignature")}
            </button>
          </div>
          {errors.signature && (
            <p className="mt-1 text-sm text-red-600">{errors.signature}</p>
          )}
        </div>
      </div>

      {formData.wagonNumbers.items.map((wagon, index) => (
        <div key={index} className="mt-8 border p-4 rounded-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{getWagonTitle(index)}</h3>
            {formData.wagonNumbers.items.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveWagon(index)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50"
                aria-label="Remove wagon"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4">
            <SMSInput
              label={t("WagonNumber") || "Wagon Number"}
              value={getWagonNumberDisplayValue(index, wagon)}
              onChange={(e) => {
                handleWagonNumberInput(index, e.target.value);
              }}
              error={errors[`wagonNumber-${index}`]}
              placeholder="00 00 0000 000 0"
              type="text"
              required
              maxLength={17}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
            <SMSCombobox
              label={t("type_of_wagon") || "Type of Wagon"}
              placeholder={"Select wagon type"}
              value={wagon.wagonType || ""}
              onValueChange={(value) =>
                handleWagonInputChange(index, "wagonType", value)
              }
              options={wagonTypeOptions}
              error={errors[`wagonType-${index}` as keyof FormErrors]}
            />
            <SMSInput
              label={t("LoadedAxles")}
              value={wagon.loadedAxles}
              onChange={(e) =>
                handleWagonInputChange(index, "loadedAxles", e.target.value)
              }
              error={errors[`loadedAxles-${index}`]}
              placeholder="e.g., 2"
              type="number"
              required
            />
            <SMSInput
              label={"Empty Axles"}
              value={wagon.emptyAxles || ""}
              onChange={(e) =>
                handleWagonInputChange(index, "emptyAxles", e.target.value)
              }
              error={errors[`emptyAxles-${index}` as keyof FormErrors]}
              placeholder="0"
              type="number"
              required
            />
            <SMSInput
              label={t("LengthOverBuffer")}
              value={wagon.lengthOverBuffer}
              onChange={(e) =>
                handleWagonInputChange(
                  index,
                  "lengthOverBuffer",
                  e.target.value
                )
              }
              error={errors[`lengthOverBuffer-${index}`]}
              placeholder="e.g., 14.22"
              type="number"
              step="0.01"
              required
            />
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {t("WeightInformation")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              <SMSInput
                label={t("LoadWeight")}
                value={wagon.loadWeight}
                onChange={(e) =>
                  handleWagonInputChange(index, "loadWeight", e.target.value)
                }
                error={errors[`loadWeight-${index}`]}
                placeholder="e.g., 10"
                type="number"
                required
              />

              <SMSInput
                label={"Weight of wagon"}
                value={wagon.weightOfWagon || ""}
                onChange={(e) =>
                  handleWagonInputChange(index, "weightOfWagon", e.target.value)
                }
                error={errors[`weightOfWagon-${index}` as keyof FormErrors]}
                placeholder="e.g., 10"
                type="number"
                required
              />

              <SMSInput
                label={t("TotalWeight")}
                value={wagon.totalWeight}
                onChange={(e) =>
                  handleWagonInputChange(index, "totalWeight", e.target.value)
                }
                error={errors[`totalWeight-${index}`]}
                placeholder="Auto-calculated"
                type="number"
                required
              />
              <SMSInput
                label={t("BrakingWeightP")}
                value={wagon.brakingWeightP}
                onChange={(e) =>
                  handleWagonInputChange(
                    index,
                    "brakingWeightP",
                    e.target.value
                  )
                }
                error={errors[`brakingWeightP-${index}`]}
                placeholder="e.g., P-123"
                required
              />
              <SMSInput
                label={t("BrakingWeightG")}
                value={wagon.brakingWeightG}
                onChange={(e) =>
                  handleWagonInputChange(
                    index,
                    "brakingWeightG",
                    e.target.value
                  )
                }
                error={errors[`brakingWeightG-${index}`]}
                placeholder="e.g., G-456"
                required
              />
            </div>
          </div>
          <div className="mt-8 mb-4">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              {t("BrakeSystem")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-content-center place-items-center  gap-4">
              <SMSCombobox
                label={"Braking Type"}
                placeholder="Select braking type"
                value={getBrakeSystemValue(wagon)}
                onValueChange={(value) => handleBrakeSystemChange(index, value)}
                options={brakingTypeOptions}
                error={errors[`brakeSystem-${index}` as keyof FormErrors]}
              />
              <SMSCombobox
                label={"Parking Brake"}
                placeholder={"Select option"}
                value={
                  (wagon as any).parkingBrake
                    ? t("Yes") || "Yes"
                    : t("No") || "No"
                }
                onValueChange={(value) => {
                  const updatedItems = [...formData.wagonNumbers.items];
                  const currentItem = updatedItems[index];
                  if (currentItem) {
                    updatedItems[index] = {
                      ...currentItem,
                      parkingBrake: value === (t("Yes") || "Yes"),
                    } as any;
                    handleInputChange("wagonNumbers", "items", updatedItems);
                  }
                }}
                options={yesNoOptions}
                error={errors[`parkingBrake-${index}` as keyof FormErrors]}
              />
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`automaticBrake-${index}`}
                  checked={(wagon as any).automaticBrake || false}
                  onCheckedChange={() =>
                    handleWagonCheckboxChange(index, "automaticBrake")
                  }
                />
                <Label
                  htmlFor={`automaticBrake-${index}`}
                  className="text-sm font-medium cursor-pointer"
                >
                  Automatic Brake
                </Label>
              </div>
              <SMSInput
                label={"Remark"}
                placeholder={"Enter remark"}
                value={(wagon as any).remark || ""}
                onChange={(e) => {
                  handleWagonInputChange(index, "remark", e.target.value);
                }}
                error={errors[`remark-${index}` as keyof FormErrors]}
              />
            </div>
            {errors[`brakeSystem-${index}` as keyof FormErrors] && (
              <p className="mt-2 text-sm text-red-600">
                {errors[`brakeSystem-${index}` as keyof FormErrors]}
              </p>
            )}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-6">
        <SMSButton
          type="button"
          variant="outline"
          onClick={handleAddWagon}
          className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add Wagon</span>
          </span>
        </SMSButton>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Wagon Document</h3>
        <div className="mt-4">
          <DropZone
            dragActive={dragActive}
            onDrag={handleDrag}
            onDrop={handleDrop}
            onFileSelect={handleFileInput}
            multiple
          />

          {existingDocs && existingDocs.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Existing Documents:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {existingDocs.map((doc, index) => {
                  const fileName =
                    typeof doc === "string"
                      ? doc.split("/").pop() || `Document ${index + 1}`
                      : `Document ${index + 1}`;
                  const documentObj =
                    typeof doc === "string"
                      ? { id: index, document: doc }
                      : doc;

                  return (
                    <div
                      key={index}
                      className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingDocument(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <X size={16} />
                      </button>

                      <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => viewDocument(documentObj)}
                      >
                        <div className="mb-2">{getFileIcon(fileName)}</div>
                        <span className="text-xs font-medium text-center truncate w-full">
                          {fileName}
                        </span>
                        <div className="flex items-center mt-1 text-xs text-blue-600">
                          <ExternalLink size={12} className="mr-1" />
                          View
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {files && files.length > 0 && (
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                New Files:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {files.map((file, index) => (
                  <div
                    key={`${file.name}-${index}`}
                    className="relative group bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X size={16} />
                    </button>

                    <div
                      className="flex flex-col items-center cursor-pointer"
                      onClick={() => viewDocument(file)}
                    >
                      <div className="mb-2">{getFileIcon(file.name)}</div>
                      <span className="text-xs font-medium text-center truncate w-full">
                        {file.name}
                      </span>
                      <div className="flex items-center mt-1 text-xs text-blue-600">
                        <ExternalLink size={12} className="mr-1" />
                        Preview
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WagonNumberForm;
