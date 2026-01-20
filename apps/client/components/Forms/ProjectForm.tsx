"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useProjectForm } from "@/hooks/project/useProjectForm";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { AddCustomerDialog } from "../Dialog/AddCustomerDialog";
import { useState } from "react";
import { FORMMODE } from "@/types/shared/global";
interface ProjectFormProps {
  useComponentAs: FORMMODE;
  id?: string;
  onclose?: () => void;
  isDialog?: boolean;
}
const ProjectForm: React.FC<ProjectFormProps> = ({
  useComponentAs,
  id,
  onclose,
  isDialog = false,
}) => {
  const {
    project,
    customers,
    errors,
    handleInputChange,
    handleSubmit,
    loading,
    pagination,
    isLoadingCustomers,
    handleLoadMoreCustomers,
    handleSearchCustomers,
    fetchCustomers,
  } = useProjectForm(Number(id), onclose);
  const [addCustomerDialog, setAddCustomerDialog] = useState(false);

  const t = useTranslations("common");
  const tProjects = useTranslations("pages.projects");
  const tcommon = useTranslations("common.labels");
  const tsidebar = useTranslations("components.sidebar");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SMSInput
          label={`${tsidebar("project")} ${tcommon("name")}`}
          value={project.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
          error={errors.name}
          name="name"
          placeholder={`${tsidebar("project")} ${tcommon("name")}`}
          maxLength={50}
        />
        <SMSCombobox
          label={` ${tsidebar("customer")}`}
          placeholder={` ${tsidebar("customer")}`}
          searchPlaceholder={t("search_customers")}
          value={project.customer_id}
          onValueChange={(value) => handleInputChange("customer_id", value)}
          options={customers.map((customer: any) => ({
            value: customer.id,
            label: customer.name,
          }))}
          required
          error={errors.customer_id}
          addNew={{
            text: t("add_customer"),
            onClick: () => setAddCustomerDialog(true),
          }}
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoadingCustomers}
          onLoadMore={handleLoadMoreCustomers}
          onSearch={handleSearchCustomers}
        />
      </div>
      <AddCustomerDialog
        open={addCustomerDialog}
        onClose={() => {
          fetchCustomers && fetchCustomers();
          setAddCustomerDialog(false);
        }}
      />
      <div
        className={`flex ${isDialog ? "justify-between" : "justify-end"} mt-10 pl-2 h-[54px]`}
      >
        {isDialog && (
          <SMSButton
            className="bg-gray-300 text-black rounded-full mr-4"
            onClick={onclose}
            text={t("buttons.cancel")}
            type="button"
          />
        )}
        <SMSButton
          className="bg-black rounded-full"
          type="submit"
          loading={loading}
          loadingText={
            id ? tProjects("updatingProject") : tProjects("creatingProject")
          }
          text={id ? tProjects("update") : tProjects("save")}
        />
      </div>
    </form>
  );
};

export default ProjectForm;
