"use client";
import React, { useState } from "react";
import { getActions, getColumns } from "./table-essentails";
import { SMSButton } from "@workspace/ui/components/custom/SMSButton";
import Image from "next/image";
import { SMSTable } from "@workspace/ui/components/custom/SMSTable";
import { Plus } from "lucide-react";
import { useRoleForm } from "@/hooks/role/useRoleForm";
import { RolePermissionsDialog } from "../RoleDialog/roleDialog";
import { Role, RoleFormData } from "@/types/role";
import { useTranslations } from "next-intl";
import { FORMMODE } from "@/types/shared/global";
import { expandPermissionsWithDependencies } from "@/constants/permissionDependencies";
import { usePermission } from "@/hooks/usePermission";

const ViewRoles = () => {
  const {
    roles,
    setRoles,
    errors,
    loading,
    permissions,
    existingRoles,
    handleSubmit,
    companies,
    removeRole,
    currentPage,
    setCurrentPage,
    totalPages,
  } = useRoleForm();

  const tAction = useTranslations("actions");
  const { hasPermission } = usePermission();

  const tSetting = useTranslations("components.sidebar");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [role, setRole] = useState<RoleFormData>();
  const [dialogMode, setDialogMode] = useState<FORMMODE>("ADD");

  const handleAddRole = () => {
    setDialogMode("ADD");
    setRoles([
      {
        name: "",
        short_name: "",
        permissions: [],
        act_as_Employee: false,
        companies: [],
        has_train_driver: false,
      },
    ]);
    setIsDialogOpen(true);
  };

  const handleSaveRole = async () => {
    let response = await handleSubmit(role?.id);
    if (response) {
      setIsDialogOpen(false);
    }
  };

  const handleEditRole = (role: RoleFormData) => {
    setRole(role);
    const basePermissions =
      role.rolePermissions?.map((permission) => permission.permission_id) || [];

    const validPermissions = permissions.filter(
      (p): p is { id: number; name: string; originalName?: string } => !!p.id
    );
    const expandedPermissions = expandPermissionsWithDependencies(
      basePermissions,
      validPermissions
    );

    setRoles([
      {
        name: role.name,
        short_name: role.short_name,
        permissions: expandedPermissions,
        act_as_Employee: role?.act_as === "EMPLOYEE",
        companies:
          role.companyRoles?.map((company) => company.company_id) || [],
        id: role.id,
        has_train_driver: role.has_train_driver,
      },
    ]);
    setDialogMode("EDIT");
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setRole(undefined);
  };

  const allActions = getActions();
  const actions = allActions.filter((action) => {
    if (action.label?.toLowerCase().includes("edit")) {
      return hasPermission("role.update");
    }
    if (action.label?.toLowerCase().includes("delete")) {
      return hasPermission("role.delete");
    }
    return true;
  });
  const columns = getColumns();
  const actionsWithCallbacks = actions.map((action) => ({
    ...action,
    element: (role: Role | RoleFormData) =>
      action.element(role as Role & RoleFormData, {
        onDelete: (id: number) => {
          if (id !== undefined) {
            removeRole(id);
          }
        },
        onEdit: (role: RoleFormData) => handleEditRole(role),
      }),
  }));

  return (
    <>
      <div className="space-y-4 px-0 lg:px-[30px]">
        <div className="flex justify-between items-center ">
          <h3>{tSetting("Roles")} </h3>
          {hasPermission("role.create") && (
            <SMSButton
              text={tAction("add") + " " + tSetting("Roles")}
              startIcon={<Plus className="h-4 w-4" />}
              className="rounded-full text-sm md:text-base px-4 md:px-6 py-2"
              onClick={handleAddRole}
            />
          )}
        </div>

        <RolePermissionsDialog
          roles={roles}
          setRoles={setRoles}
          isOpen={isDialogOpen}
          onOpenChange={handleDialogClose}
          permissions={permissions}
          errors={errors}
          companies={companies}
          onSave={handleSaveRole}
          loading={loading}
          useComponentAs={dialogMode}
        />

        <SMSTable
          columns={columns}
          data={existingRoles}
          actions={actionsWithCallbacks}
          search={false}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </>
  );
};

export default ViewRoles;
