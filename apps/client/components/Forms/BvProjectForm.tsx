"use client";
import type React from "react";
import { SMSInput } from "@workspace/ui/components/custom/SMSInput";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useBvProjectForm } from "@/hooks/bvProject/useBvProjectForm";
import { SMSCombobox } from "@workspace/ui/components/custom/SMSCombobox";
import { useTranslations } from "next-intl";
import { AddProjectDialog } from "../Dialog/AddProjectDialog";
import { useState } from "react";
import { FORMMODE } from "@/types/shared/global";

interface BvProjectFormProps {
  useComponentAs: FORMMODE;
  id?: string;
  onclose?: () => void;
  isDialog?: boolean;
}
const BvProjectForm: React.FC<BvProjectFormProps> = ({
  useComponentAs,
  id,
  onclose,
  isDialog = false,
}) => {
  const {
    bvProject,
    errors,
    handleInputChange,
    handleSubmit,
    projects,
    loading,
    handleSearchProjects,
    handleLoadMoreProjects,
    isLoadingProjects,
    pagination,
    fetchProject,
  } = useBvProjectForm(Number(id), onclose);
  const [addProjectDialog, setAddProjectDialog] = useState(false);
  const t = useTranslations("common");
  const tcommon = useTranslations("common.labels");
  const tsidebar = useTranslations("components.sidebar");
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-6">
        <SMSInput
          label={`${tsidebar("bvProject")} ${tcommon("name")}`}
          value={bvProject.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          required
          error={errors.name}
          name="name"
          placeholder={`${tsidebar("bvProject")} ${tcommon("name")}`}
          maxLength={50}
        />

        <SMSCombobox
          label={` ${tsidebar("project")}`}
          placeholder={` ${tsidebar("project")}`}
          searchPlaceholder={t("search_project")}
          value={bvProject.project_id}
          onValueChange={(value) => handleInputChange("project_id", value)}
          options={projects.map((project: any) => ({
            value: project.id,
            label: project.name,
          }))}
          required
          error={errors.customer_id}
          addNew={{
            text: t("add_project"),
            onClick: () => setAddProjectDialog(true),
          }}
          hasMore={pagination.page < pagination.total_pages}
          loadingMore={isLoadingProjects}
          onLoadMore={handleLoadMoreProjects}
          onSearch={handleSearchProjects}
        />
      </div>
      <AddProjectDialog
        open={addProjectDialog}
        onClose={() => {
          fetchProject && fetchProject();
          setAddProjectDialog(false);
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
          loadingText={id ? t("updating_bv_project") : t("creating_bv_project")}
          text={id ? t("buttons.update") : t("buttons.save")}
        />
      </div>
    </form>
  );
};

export default BvProjectForm;
