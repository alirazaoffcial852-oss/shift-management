// useRoleForm.ts

import { useRoleManager } from "./useRole";

export const useRoleForm = () => {
  const roleManager = useRoleManager({
    forDropdown: false,
    initialLimit: 20,
  });

  return {
    roles: roleManager.roles,
    setRoles: roleManager.setRoles,
    errors: roleManager.roleErrors,
    loading: roleManager.loading,
    permissions: roleManager.permissions,
    existingRoles: roleManager.existingRoles,
    handleSubmit: roleManager.handlerAddRoles,
    companies: roleManager.companies,
    removeRole: roleManager.removeRole,
    currentPage: roleManager.pagination.page,
    setCurrentPage: (page: number) =>
      roleManager.fetchRoles(page, roleManager.searchQuery),
    totalPages: roleManager.pagination.total_pages,
  };
};
