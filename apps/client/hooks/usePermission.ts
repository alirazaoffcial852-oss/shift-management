import { useCallback } from "react";
import { useApp } from "@/providers/appProvider";

export function usePermission() {
  const { user, isAuthenticated, permissions } = useApp();

  const hasPermission = useCallback(
    (permissionName: string): boolean => {
      const roleName =
        typeof user?.role === "object" ? user?.role?.name : user?.role;
      if (roleName === "ADMIN") {
        return true;
      }

      return permissions.includes(permissionName);
    },
    [permissions, user?.role]
  );

  const hasAnyPermission = useCallback(
    (permissionNames: string[]): boolean => {
      const roleName =
        typeof user?.role === "object" ? user?.role?.name : user?.role;
      if (roleName === "ADMIN") {
        return true;
      }

      return permissionNames.some((permissionName) =>
        permissions.includes(permissionName)
      );
    },
    [permissions, user?.role]
  );

  const hasAllPermissions = useCallback(
    (permissionNames: string[]): boolean => {
      const roleName =
        typeof user?.role === "object" ? user?.role?.name : user?.role;
      if (roleName === "ADMIN") {
        return true;
      }

      return permissionNames.every((permissionName) =>
        permissions.includes(permissionName)
      );
    },
    [permissions, user?.role]
  );

  return {
    permissions: permissions.map((p) => ({ id: 0, name: p })),
    loading: !isAuthenticated,
    error: null,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    refreshPermissions: () => {},
  };
}
