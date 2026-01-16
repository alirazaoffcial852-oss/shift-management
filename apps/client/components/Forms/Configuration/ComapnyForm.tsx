"use client";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { Plus, Trash2 } from "lucide-react";
import MultiSelector from "@workspace/ui/components/custom/MultiSelector";
import { Checkbox } from "@workspace/ui/components/checkbox";
import type { Company, CompanyFormProps } from "@/types/configuration";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import type { Role } from "@/types/role";
import { Switch } from "@workspace/ui/components/switch";

export function CompanyForm({ roles, companies, onUpdate, errors, onSubmit, handleBack }: CompanyFormProps) {
  const handleAddMore = () => {
    onUpdate([
      ...companies,
      {
        name: "" as string,
        configuration: {
          address: "",
          phone: "",
          email: "",
          has_locomotive: false,
        },
        roles: [],
        logo: undefined,
      },
    ]);
  };
  const handleRemove = (index: number) => {
    const newCompanies = companies.filter((_, i) => i !== index);
    onUpdate(newCompanies);
  };

  const handleChange = (index: number, field: keyof Company | "address" | "phone" | "email" | "has_locomotive", value: string | string[] | boolean | File | undefined) => {
    const newCompanies = [...companies];

    if (field === "logo") {
      newCompanies[index] = {
        ...newCompanies[index],
        logo: value as File,
      } as Company;
      onUpdate(newCompanies);
      return;
    }

    if (field === "roles") {
      newCompanies[index] = {
        ...newCompanies[index],
        roles: (value as string[]).map((roleId) => roles.find((role) => role.id && role.id.toString() === roleId)!) as Role[],
      } as Company;
      onUpdate(newCompanies);
      return;
    }

    if (["address", "phone", "email", "has_locomotive"].includes(field)) {
      newCompanies[index] = {
        ...newCompanies[index],
        configuration: {
          ...(newCompanies[index]?.configuration || {}),
          [field]: value,
        },
      } as Company;
    } else {
      newCompanies[index] = {
        ...newCompanies[index],
        [field]: value,
      } as Company;
    }

    onUpdate(newCompanies);
  };

  const handleSelectAllRoles = (index: number, checked: boolean | "indeterminate") => {
    const newCompanies = [...companies];
    if (checked === true) {
      newCompanies[index] = {
        ...newCompanies[index],
        roles: roles.filter((role) => role.id !== undefined),
      } as Company;
    } else {
      newCompanies[index] = {
        ...newCompanies[index],
        roles: [],
      } as Company;
    }
    onUpdate(newCompanies);
  };

  const rolesOptions = roles
    .filter((role) => role.id !== undefined)
    .map((role) => ({
      label: role.name,
      value: role.id!.toString(),
    }));
  return (
    <div className="flex flex-col h-[calc(100vh-200px)]">
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 scrollbar">
        {companies.map((company, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md border p-6">
            <div className="flex items-start justify-end mb-4">
              {companies.length > 1 && (
                <SMSButton variant="ghost" size="icon" className="text-red-500 bg-transparent shadow-none" onClick={() => handleRemove(index)}>
                  <Trash2 className="h-5 w-5 bg-transparent shadow-none" />
                </SMSButton>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SMSInput
                label="Company Name"
                value={company.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                required
                error={errors[`companies.${index}.name`]}
              />
              <SMSInput
                label="Company Address"
                value={company.configuration.address}
                onChange={(e) => handleChange(index, "address", e.target.value)}
                required
                error={errors[`companies.${index}.address`]}
              />
              <SMSInput
                label="Company Phone Number"
                value={company.configuration.phone}
                type="tel"
                onChange={(e) => handleChange(index, "phone", e.target.value)}
                required
                error={errors[`companies.${index}.phone`]}
              />
              <SMSInput
                label="Company Email"
                value={company.configuration.email}
                type="email"
                onChange={(e) => handleChange(index, "email", e.target.value)}
                required
                error={errors[`companies.${index}.email`]}
              />

              <div className="space-y-2">
                <label className="block text-sm font-medium">Company Logo</label>
                <div
                  onClick={() => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.accept = "image/*";
                    input.onchange = (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0];
                      if (file) handleChange(index, "logo", file);
                    };
                    input.click();
                  }}
                  className="h-[120px] border-2  border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 "
                >
                  {company.logo ? (
                    <div className="relative w-full h-full p-2">
                      <img src={company.logo instanceof File ? URL.createObjectURL(company.logo) : ""} alt="Company logo" className="w-full h-full object-contain rounded-lg" />
                    </div>
                  ) : (
                    <>
                      <div className="h-8 w-8 flex items-center justify-center rounded-full border-2 border-[#14AE5C] bg-transparent text-[#14AE5C]">
                        <Plus className="h-4 w-6 text-[#14AE5C]" />
                      </div>
                    </>
                  )}
                </div>
                {errors[`companies.${index}.logo`] && <p className="text-sm text-red-500">{errors[`companies.${index}.logo`]}</p>}
              </div>

              {rolesOptions && (
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-[18px] font-medium text-gray-700 mb-2">Roles</label>
                    <div className="flex items-center gap-2">
                      {" "}
                      <label className="block text-[12px] font-medium text-gray-700 ">Select All</label>{" "}
                      <Checkbox
                        checked={company.roles.length === roles.filter((role) => role.id !== undefined).length}
                        onCheckedChange={(checked) => handleSelectAllRoles(index, checked)}
                      />
                    </div>
                  </div>
                  <MultiSelector
                    options={rolesOptions}
                    selected={company.roles.map((role) => role?.id?.toString() ?? "")}
                    onChange={(values) => handleChange(index, "roles", values)}
                    error={errors[`companies.${index}.roles`]}
                  />
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-4">
              <Checkbox
                id={`locomotive-${index}`}
                checked={company.configuration.has_locomotive}
                onCheckedChange={(checked) => handleChange(index, "has_locomotive", checked as boolean)}
              />
              <label htmlFor={`locomotive-${index}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Is this company has Locomotive?
              </label>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 sticky bottom-0 bg-white pt-4">
        <SMSButton
          type="button"
          variant="outline"
          onClick={handleAddMore}
          className="flex items-center gap-2 bg-white border-0 w-80 rounded-lg text-[#3E8258] shadow-[0px_4px_4px_rgba(0,0,0,0.25)]"
        >
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Add More</span>
          </span>{" "}
        </SMSButton>
      </div>

      <div className="flex justify-between mt-6 sticky bottom-0  pt-2">
        <SMSButton
          className="bg-transparent shadow-none  text-[18px] p-0 text-black border-b-4 border-black rounded-none hover:bg-transparent hover:text-black"
          onClick={handleBack}
        >
          Back
        </SMSButton>
        <SMSButton className="bg-black rounded-full" onClick={onSubmit}>
          Finish
        </SMSButton>
      </div>
    </div>
  );
}
