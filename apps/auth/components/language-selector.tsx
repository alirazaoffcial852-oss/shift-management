"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type Language = {
  code: string;
  name: string;
  flag: string;
};

const languages: Language[] = [
  {
    code: "en",
    name: "English",
    flag: "🇬🇧",
  },
  {
    code: "de",
    name: "Deutsch",
    flag: "🇩🇪",
  },
];

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (languages.find((lang) => lang.code === locale) as Language) || languages[0]
  );

  useEffect(() => {
    const currentLang = languages.find((lang) => lang.code === locale);
    if (currentLang) {
      setSelectedLanguage(currentLang);
    }
  }, [locale]);

  const handleLanguageChange = (language: Language) => {
    if (language.code === locale) return;
    const segments = pathname.split("/").filter(Boolean);
    const newSegments = segments.map((seg) =>
      languages.some((lang) => lang.code === seg) ? language.code : seg
    );
    const newPath = "/" + newSegments.join("/");
    setSelectedLanguage(language);
    router.push(newPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span className="text-lg">{selectedLanguage.flag}</span>
          <span className="hidden sm:inline">{selectedLanguage.name}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex items-center gap-2"
          >
            <span className="text-lg">{language.flag}</span>
            <span>{language.name}</span>
            {selectedLanguage.code === language.code && (
              <Check className="h-4 w-4 ml-auto" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
