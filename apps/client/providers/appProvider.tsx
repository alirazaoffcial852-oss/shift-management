"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import AuthService from "@/services/auth";
import { Company } from "@/types/configuration";
import { User } from "@workspace/ui/types/user";
import { LOCAL_STORAGE_KEY } from "@/constants";
import CompanyService from "@/services/company";
import { useLocale } from "next-intl";
import { decodeJwt } from "jose";

type ExtendedCompany = Company & { id: number };

interface AppContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: (User & { isCompanyConfigured: boolean; employeeId: string }) | null;
  permissions: string[];
  loading: boolean;
  initialLoading: boolean;
  companies: ExtendedCompany[];
  activeCompany: ExtendedCompany | null;
  setToken: (token: string) => void;
  logout: () => void;
  setCompanies: (companies: ExtendedCompany[]) => void;
  setActiveCompany: (company: ExtendedCompany) => void;
}

const AppContext = createContext<AppContextType>({
  isAuthenticated: false,
  token: null,
  user: null,
  permissions: [],
  loading: true,
  initialLoading: true,
  companies: [],
  activeCompany: null,
  setToken: () => {},
  logout: () => {},
  setActiveCompany: () => {},
  setCompanies: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<
    (User & { isCompanyConfigured: boolean; employeeId: string }) | null
  >(null);
  const [permissions, setPermissions] = useState<string[]>([]); // Add permissions state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [companies, setCompaniesState] = useState<ExtendedCompany[]>([]);
  const [needsConfiguration, setNeedsConfiguration] = useState(false);
  const [needsRedirectToCustomers, setNeedsRedirectToCustomers] =
    useState(false);
  const [needsRedirectToShiftManagement, setNeedsRedirectToShiftManagement] =
    useState(false);
  const [activeCompany, setActiveCompanyState] =
    useState<ExtendedCompany | null>(null);

  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const extractPermissionsFromToken = useCallback(
    (tokenToExtract: string): string[] => {
      try {
        const decoded = decodeJwt(tokenToExtract) as any;

        if (decoded.permissions && Array.isArray(decoded.permissions)) {
          return decoded.permissions;
        }

        if (
          decoded.role?.permissions &&
          Array.isArray(decoded.role.permissions)
        ) {
          return decoded.role.permissions.map((p: any) =>
            typeof p === "string" ? p : p.name
          );
        }

        return [];
      } catch (error) {
        console.error("Error extracting permissions from token:", error);
        return [];
      }
    },
    []
  );

  const setToken = useCallback(
    (newToken: string) => {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_STORAGE_KEY, newToken);
      }
      setTokenState(newToken);
      const extractedPermissions = extractPermissionsFromToken(newToken);
      setPermissions(extractedPermissions);
    },
    [extractPermissionsFromToken]
  );

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    setTokenState(null);
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
    router.replace(`${process.env.NEXT_PUBLIC_AUTH_URL}/${locale}/sign-in`);
  }, [router, locale]);

  const setCompanies = useCallback((newCompanies: ExtendedCompany[]) => {
    setCompaniesState(newCompanies);
  }, []);

  const setActiveCompany = useCallback((company: ExtendedCompany) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("selected-company", JSON.stringify(company));
    }
    setActiveCompanyState(company);
  }, []);

  const verifyToken = useCallback(
    async (tokenToVerify: string) => {
      try {
        const response = await AuthService.verifyToken(tokenToVerify);
        const { token: newToken, user: userData } = response.data;
        setToken(newToken);
        setUser(userData);

        const extractedPermissions = extractPermissionsFromToken(newToken);
        setPermissions(extractedPermissions);

        setIsAuthenticated(true);

        if (!userData.isCompanyConfigured) {
          setNeedsConfiguration(true);
        } else {
          const isRootOrAuthPath =
            pathname === `/${locale}` ||
            pathname === `/${locale}/` ||
            pathname.includes("/sign-in");

          if (isRootOrAuthPath && userData.role.name !== "CLIENT_EMPLOYEE") {
            setNeedsRedirectToCustomers(true);
          } else if (
            isRootOrAuthPath &&
            userData.role.name === "CLIENT_EMPLOYEE"
          ) {
            setNeedsRedirectToShiftManagement(true);
          }
        }
        return true;
      } catch (error) {
        console.error("Token verification failed:", error);
        logout();
        return false;
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [logout, setToken, pathname, locale, extractPermissionsFromToken]
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

        if (tokenFromParams) {
          const verified = await verifyToken(tokenFromParams);
          if (verified) {
            setToken(tokenFromParams);
            return;
          }
        }

        if (storageToken) {
          const verified = await verifyToken(storageToken);
          if (!verified) {
            throw new Error("Stored token verification failed");
          }
        } else if (!tokenFromParams) {
          throw new Error("No token available");
        }
      } catch (error) {
        console.error("Authentication error:", error);
        if (!loading) {
          window.location.replace(
            `${process.env.NEXT_PUBLIC_AUTH_URL}/${locale}/sign-in`
          );
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [locale, router, verifyToken, searchParams, setToken]);

  useEffect(() => {
    if (needsConfiguration) {
      router.replace(`/${locale}/configuration`);
      setNeedsConfiguration(false);
    }
  }, [needsConfiguration, router, locale]);

  useEffect(() => {
    if (needsRedirectToCustomers) {
      router.replace(`/${locale}/customers`);
      setNeedsRedirectToCustomers(false);
    } else if (needsRedirectToShiftManagement) {
      router.replace(`/${locale}/shift-management/regular-shifts/monthly`);
      setNeedsRedirectToShiftManagement(false);
    }
  }, [
    needsRedirectToCustomers,
    needsRedirectToShiftManagement,
    router,
    locale,
  ]);

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

  useEffect(() => {
    const getCompanies = async () => {
      if (
        isAuthenticated &&
        user &&
        user?.role?.name !== "CLIENT_EMPLOYEE" &&
        companies.length === 0
      ) {
        try {
          const response = await CompanyService.getAllCompanies();
          const fetchedCompanies = response.data;
          setCompaniesState(fetchedCompanies);

          if (typeof window !== "undefined" && fetchedCompanies.length > 0) {
            const selectedCompanyString =
              localStorage.getItem("selected-company");

            if (selectedCompanyString) {
              const selectedCompany = JSON.parse(
                selectedCompanyString
              ) as ExtendedCompany;
              if (
                fetchedCompanies?.find(
                  (data: any) => data?.id === selectedCompany?.id
                )
              ) {
                setActiveCompanyState(selectedCompany);
                return;
              }
            }

            localStorage.setItem(
              "selected-company",
              JSON.stringify(fetchedCompanies[0])
            );
            setActiveCompanyState(fetchedCompanies[0]);
          }
        } catch (error) {
          console.error("Failed to fetch companies:", error);
        }
      }
    };

    getCompanies();
  }, [isAuthenticated, user, companies.length]);

  const contextValue: AppContextType = {
    isAuthenticated,
    token,
    user,
    permissions,
    loading,
    initialLoading,
    companies,
    activeCompany,
    setToken,
    logout,
    setActiveCompany,
    setCompanies,
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div>{children}</div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);

export const useAuth = () => {
  const { isAuthenticated, token, user, setToken, logout } =
    useContext(AppContext);
  const isEmployee = user?.role?.name === "CLIENT_EMPLOYEE";
  const hasTrainDriver = user?.employeeRole?.has_train_driver === false;
  return {
    isAuthenticated,
    token,
    user,
    setToken,
    logout,
    isEmployee,
    hasTrainDriver,
  };
};

export const useCompany = () => {
  const { companies, activeCompany, setActiveCompany, setCompanies } =
    useContext(AppContext);
  return {
    companies,
    setCompanies,
    company: activeCompany,
    setCompany: setActiveCompany,
  };
};
