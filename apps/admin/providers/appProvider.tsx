"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AuthService from "@/services/auth";
import { User } from "@workspace/ui/types/user";
import { LOCAL_STORAGE_KEY } from "@/constants";
import { useLocale } from "next-intl";

interface AppContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: (User & { isCompanyConfigured: boolean }) | null;
  loading: boolean;
  initialLoading: boolean;
  setToken: (token: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true,
  initialLoading: true,
  setToken: () => {},
  logout: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<(User & { isCompanyConfigured: boolean }) | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [needsRedirectToClients, setNeedsRedirectToClients] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const pathname = usePathname();

  const setToken = useCallback((newToken: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, newToken);
    }
    setTokenState(newToken);
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setTokenState(null);
    setUser(null);
    setIsAuthenticated(false);
    const authUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "https://shift-management-auth.vercel.app";
    window.location.href = `${authUrl}/${locale}/sign-in`;
  }, [locale]);

  const verifyToken = useCallback(
    async (tokenToVerify: string) => {
      try {
        const response = await AuthService.verifyToken(tokenToVerify);
        const { token: newToken, user: userData } = response.data;

        setToken(newToken);
        setUser(userData);
        setIsAuthenticated(true);

        const isRootOrAuthPath = pathname === `/${locale}` || pathname === `/${locale}/` || pathname.includes("/sign-in");

        if (isRootOrAuthPath) {
          setNeedsRedirectToClients(true);
        }

        return true;
      } catch (error: any) {
        console.error("Token verification failed:", error);
        const status = error?.status || error?.response?.status || error?.data?.status;
        if (status === 401) {
          logout();
          return false;
        }
        console.warn("Token verification failed due to network error, not logging out");
        return false;
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [logout, setToken, pathname, locale]
  );

  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        const tokenFromParams = searchParams.get("token");
        let storageToken = null;

        if (typeof window !== "undefined") {
          storageToken = localStorage.getItem(LOCAL_STORAGE_KEY);
        }

        // If there's a token in params, use it first
        if (tokenFromParams) {
          const verified = await verifyToken(tokenFromParams);
          if (verified) {
            setToken(tokenFromParams);
            return; // Exit early if token param verification successful
          }
        }

        // Fall back to storage token
        if (storageToken) {
          const verified = await verifyToken(storageToken);
          if (!verified) {
            throw new Error("Stored token verification failed");
          }
        } else if (!tokenFromParams) {
          // Only redirect if we have neither token
          throw new Error("No token available");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (!loading) {
          // Prevent redirect loop - redirect to auth app
          const authUrl = process.env.NEXT_PUBLIC_AUTH_BASE_URL || "https://shift-management-auth.vercel.app";
          window.location.href = `${authUrl}/${locale}/sign-in`;
        }
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    };

    initAuth();
  }, [locale, router, verifyToken, searchParams, setToken]);

  useEffect(() => {
    if (needsRedirectToClients) {
      router.replace(`/${locale}/clients`);
      setNeedsRedirectToClients(false);
    }
  }, [needsRedirectToClients, router, locale]);

  useEffect(() => {
    if (token && isAuthenticated) {
      const refreshInterval = setInterval(
        () => {
          verifyToken(token);
        },
        14 * 60 * 1000
      );

      return () => clearInterval(refreshInterval);
    }
    return () => {};
  }, [token, isAuthenticated, verifyToken]);

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        token,
        user,
        loading,
        initialLoading,
        setToken,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

export const useAuth = () => {
  const { isAuthenticated, token, user, setToken, logout } = useContext(AppContext);
  return { isAuthenticated, token, user, setToken, logout };
};
