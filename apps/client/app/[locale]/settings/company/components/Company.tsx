"use client";
import { useState } from "react";
import { CompanyList } from "./CompanyList";
import { useCompanyForm } from "@/hooks/company/useCompanyForm";
import { Company as companyType } from "@/types/configuration";
import { Plus } from "lucide-react";
import { CompanyDialog } from "./CompanyDialog";
import { DeleteConfirmationModal } from "./DeleteConfirmationDialog";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import { useTranslations } from "next-intl";
import { usePermission } from "@/hooks/usePermission";

export default function Company() {
  const {
    companies,
    roles,
    handleAddCompany,
    handleUpdateCompany,
    handleDeleteCompany,
  } = useCompanyForm();
  const taction = useTranslations("actions");
  const { hasPermission } = usePermission();

  const tSetting = useTranslations("pages.settings");

  const [selectedCompany, setSelectedCompany] = useState<companyType | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState<companyType | null>(
    null
  );

  const handleOpenDialog = (company?: companyType) => {
    setSelectedCompany(company || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedCompany(null);
    setIsDialogOpen(false);
  };

  const handleOpenDeleteModal = (company: companyType) => {
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setCompanyToDelete(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (companyToDelete) {
      if (companyToDelete?.id !== undefined) {
        await handleDeleteCompany(companyToDelete.id);
      }
      handleCloseDeleteModal();
    }
  };

  const handleSubmit = async (companyData: Partial<companyType>) => {
    if (selectedCompany) {
      if (selectedCompany.id !== undefined) {
        await handleUpdateCompany(selectedCompany.id, companyData);
      }
    } else {
      await handleAddCompany(companyData);
    }
    handleCloseDialog();
  };
  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3>{tSetting("company")} </h3>
        {hasPermission("company.create") && (
        <SMSButton
          onClick={() => handleOpenDialog()}
          className="flex items-center   text-sm"
          startIcon={<Plus className="w-4 h-4 mr-2" />}
        >
          {taction("add") + " " + tSetting("company")}
        </SMSButton>
        )}
      </div>

      <CompanyList
        companies={companies}
        onEdit={handleOpenDialog}
        onDelete={handleOpenDeleteModal}
      />

      <CompanyDialog
        company={selectedCompany}
        roles={
          roles.filter((role) => role.id !== undefined) as {
            id: number;
            name: string;
          }[]
        }
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSubmit={handleSubmit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        companyName={companyToDelete?.name || ""}
      />
    </div>
  );
}
