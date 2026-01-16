"use client";
import { Company } from "@/types/configuration";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { Checkbox } from "@workspace/ui/components/checkbox";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { IMAGE_URL } from "@/constants/env.constants";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { useTranslations } from "next-intl";

interface CompanyDialogProps {
  company?: Company | null;
  roles: { id: number; name: string }[];
  open: boolean;
  onClose: () => void;
  onSubmit: (company: Company) => void;
  isLoading?: boolean;
  has_project_usn?: boolean;
}

interface ValidationErrors {
  name?: string;
  address?: string;
  phone?: string;
  roles?: string;
  logo?: string;
  email?: string;
  has_project_usn?: string;
}

const initialCompanyState: Company = {
  name: "",
  configuration: {
    address: "",
    phone: "",
    email: "",
    has_locomotive: false,
    logo: undefined,
    has_project_usn: false,
  },
  roles: [] as { id: number; name: string; act_as: string }[],
};

export function CompanyDialog({
  company,
  roles,
  open,
  onClose,
  onSubmit,
  isLoading = false,
  has_project_usn = false,
}: CompanyDialogProps) {
  const tLabel = useTranslations("common.labels");
  const t = useTranslations("common");
  const tSidebar = useTranslations("components.sidebar");
  const tSettings = useTranslations("pages.settings");
  const tActions = useTranslations("actions");

  const [formData, setFormData] = useState<Company>(initialCompanyState);
  const [errors, setErrors] = useState<ValidationErrors>({});

  useEffect(() => {
    if (company) {
      setFormData(company);
    } else {
      setFormData(initialCompanyState);
    }
  }, [company]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = t("validation.name_required");
      isValid = false;
    } else if (formData.name.length < 2) {
      newErrors.name = t("validation.minLength", {
        field: tLabel("name"),
        count: "2",
      });
      isValid = false;
    }

    // Address validation
    if (!formData.configuration.address.trim()) {
      newErrors.address = t("validation.address_required");
      isValid = false;
    }

    // Phone validation
    if (!formData.configuration.phone.trim()) {
      newErrors.phone = t("validation.phone_required");
      isValid = false;
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.configuration.phone)) {
      newErrors.phone = t("validation.phone_required");
      isValid = false;
    }

    // Email validation
    if (!formData.configuration.email.trim()) {
      newErrors.email = t("validation.email");
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.configuration.email)
    ) {
      newErrors.email = t("validation.email");
      isValid = false;
    }

    // Roles validation
    if (!formData.roles.length) {
      newErrors.roles = t("role_required");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (
    field: string,
    value: string | string[] | boolean | File | undefined
  ) => {
    // Handle nested configuration fields
    if (
      field === "address" ||
      field === "phone" ||
      field === "email" ||
      field === "logo" ||
      field === "has_project_usn" ||
      field === "has_locomotive"
    ) {
      setFormData((prev) => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          [field]: value,
        },
      }));

      if (errors[field as keyof ValidationErrors]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
      return;
    }

    // Handle has_locomotive checkbox
    if (field === "has_locomotive") {
      setFormData((prev) => ({
        ...prev,
        configuration: {
          ...prev.configuration,
          has_locomotive: value as boolean,
          has_project_usn: false,
        },
      }));
      return;
    }

    // Handle roles separately
    if (field === "roles") {
      setFormData((prev) => ({
        ...prev,
        roles: (value as string[]).map((roleId) => {
          const role = roles.find((r) => r.id.toString() === roleId);
          return role
            ? { id: role.id, name: role.name, act_as: "" }
            : { id: 0, name: "", act_as: "" };
        }),
      }));

      if (errors.roles) {
        setErrors((prev) => ({
          ...prev,
          roles: undefined,
        }));
      }
      return;
    }

    // Handle all other direct properties
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field as keyof ValidationErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleLogoUpload = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: tSettings("imageSizeShouldBeLessThan5MB"),
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        logo: tSettings("pleaseUploadAValidImageFile"),
      }));
      return;
    }

    handleChange("logo", file);
  };

  const rolesOptions = roles.map((role) => ({
    label: role.name,
    value: role.id.toString(),
  }));

  const handleSelectAllRoles = () => {
    const allRolesSelected = roles.length === formData.roles.length;

    if (allRolesSelected) {
      // If all roles are selected, deselect all
      setFormData((prev) => ({
        ...prev,
        roles: [],
      }));
    } else {
      // If not all roles are selected, select all
      const allRoles = roles.map((role) => ({
        id: role.id,
        name: role.name,
        act_as: "",
      }));
      setFormData((prev) => ({
        ...prev,
        roles: allRoles,
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[785px] max-h-[90vh] overflow-y-auto scrollbar-hide">
        <DialogHeader>
          <DialogTitle>
            {company
              ? `${t("lets_edit")} ${tSettings("company")}`
              : `${t("lets_create")} ${tSettings("company")}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <SMSInput
            label={tLabel("name")}
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            error={errors.name}
          />

          <SMSInput
            label={tLabel("email")}
            value={formData.configuration.email}
            type="email"
            onChange={(e) => handleChange("email", e.target.value)}
            required
            error={errors.email}
          />

          <SMSInput
            label={t("address")}
            value={formData.configuration.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required
            error={errors.address}
          />

          <SMSInput
            label={tLabel("phone")}
            value={formData.configuration.phone}
            type="tel"
            onChange={(e) => handleChange("phone", e.target.value)}
            required
            error={errors.phone}
          />

          <div className="space-y-2">
            <Label className="text-[16px] sm:text-[18px] md:text-[18px] font-medium text-[#2D2E33] ml-1">
              {t("logo")}
            </Label>
            <div
              onClick={() => {
                const input = document.createElement("input");
                input.type = "file";
                input.accept = "image/*";
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) handleLogoUpload(file);
                };
                input.click();
              }}
              className="h-[120px] border-2 border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400"
            >
              {formData.configuration.logo ? (
                <div className="relative w-full h-full p-2">
                  <img
                    src={
                      typeof formData.configuration.logo === "string"
                        ? IMAGE_URL + formData.configuration.logo
                        : URL.createObjectURL(
                            formData.configuration.logo as File
                          )
                    }
                    alt="Company logo"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              ) : (
                <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-[#14AE5C] bg-transparent text-[#14AE5C]">
                  <Plus className="h-4 w-6 text-[#14AE5C]" />
                </div>
              )}
            </div>
            {errors.logo && (
              <p className="text-sm text-red-500">{errors.logo}</p>
            )}
          </div>
          {rolesOptions && (
            <div className="flex items-center justify-between">
              <label className="block text-[18px] font-medium text-gray-700 ">
                {tSidebar("Roles")}
              </label>
              <div className="flex items-center gap-2">
                <Label className="block text-[12px] font-medium text-gray-700">
                  {t("select_all")}
                </Label>
                <Checkbox
                  checked={roles.length === formData.roles.length}
                  onCheckedChange={handleSelectAllRoles}
                />
              </div>
            </div>
          )}

          <MultiSelector
            label={""}
            options={rolesOptions}
            selected={formData.roles.map((role) =>
              role && role.id ? role.id.toString() : ""
            )}
            onChange={(values) => handleChange("roles", values)}
            error={errors.roles}
          />

          <div className="flex flex-col space-y-2 mt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-locomotive"
                checked={formData.configuration.has_locomotive}
                onCheckedChange={(checked) =>
                  handleChange("has_locomotive", checked as boolean)
                }
              />
              <label
                htmlFor="has-locomotive"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {tSettings("does_this_company_have_a_locomotive")}
              </label>
            </div>
            {formData.configuration.has_locomotive && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="has-project-usn"
                  checked={formData.configuration.has_project_usn}
                  onCheckedChange={(checked) =>
                    handleChange("has_project_usn", checked as boolean)
                  }
                />
                <label
                  htmlFor="has-project-usn"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {tSettings("does_this_company_have_project_usn") ||
                    "Does this company have project USN?"}
                </label>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <SMSButton
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="h-10 text-sm "
          >
            {tActions("cancel")}
          </SMSButton>
          <SMSButton
            onClick={handleSubmit}
            loading={isLoading}
            className="h-10 text-sm "
          >
            {company ? tActions("update") : tActions("add")}
          </SMSButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
