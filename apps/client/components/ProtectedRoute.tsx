"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useApp } from "@/providers/appProvider";
import { usePermission } from "@/hooks/usePermission";
import { getRequiredPermissions } from "@/constants/permissionMapping";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback = null,
  redirectTo = "/dashboard",
}: ProtectedRouteProps) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const { isAuthenticated, loading } = useApp();
  const { hasAnyPermission } = usePermission();

  const requiredPermissions = getRequiredPermissions(pathname);

  if (requiredPermissions.length === 0) {
    return <>{children}</>;
  }

  const hasAccess = hasAnyPermission(requiredPermissions);

  useEffect(() => {
    if (!loading && isAuthenticated && !hasAccess && redirectTo) {
      router.push(`/${locale}${redirectTo}`);
    }
  }, [loading, isAuthenticated, hasAccess, redirectTo, router, locale]);

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
