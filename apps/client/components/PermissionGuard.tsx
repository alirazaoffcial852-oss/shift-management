"use client";

import { ReactNode } from "react";
import { usePermission } from "@/hooks/usePermission";
import { useRouter } from "next/navigation";
import { useApp } from "@/providers/appProvider";
import { useLocale } from "next-intl";

interface PermissionGuardProps {
  children: ReactNode;
  permissionRequired: string | string[];
  fallback?: ReactNode;
  requireAll?: boolean;
  redirectTo?: string;
}

/**
 * Component that guards its children, only rendering them if the user has the required permissions
 */
export function PermissionGuard({ children, permissionRequired, fallback = null, requireAll = false, redirectTo }: PermissionGuardProps) {
  const { hasPermission, hasAllPermissions, hasAnyPermission, loading } = usePermission();
  const { isAuthenticated } = useApp();
  const router = useRouter();
  const locale = useLocale();

  // If not authenticated, don't render anything
  if (!isAuthenticated) {
    return null;
  }

  // While loading permissions, you could show a loading indicator or return null
  if (loading) {
    return null;
  }

  // Check permissions based on the required type
  let hasRequiredPermission = false;

  if (typeof permissionRequired === "string") {
    hasRequiredPermission = hasPermission(permissionRequired);
  } else if (requireAll) {
    hasRequiredPermission = hasAllPermissions(permissionRequired);
  } else {
    hasRequiredPermission = hasAnyPermission(permissionRequired);
  }

  // If user doesn't have permission and redirectTo is provided, redirect
  if (!hasRequiredPermission && redirectTo) {
    router.push(`/${locale}${redirectTo}`);
    return null;
  }

  // Render children if user has permission, otherwise fallback
  return hasRequiredPermission ? <>{children}</> : <>{fallback}</>;
}

export default PermissionGuard;
