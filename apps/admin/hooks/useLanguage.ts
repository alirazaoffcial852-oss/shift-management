import http from "@workspace/ui/lib/http";
import { useEffect, useState } from "react";
import { Language } from "@workspace/ui/types/language";

export const useLanguage = () => {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      const response = await http.get("/languages");
      setLanguages(response.data as Language[]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return {
    languages,
    loading,
  };
};
