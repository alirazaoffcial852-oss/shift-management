"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

type Language = {
  code: string;
  flag: string;
  alt: string;
};

const languages: Language[] = [
  {
    code: "en",
    flag: "/images/en-flag.png",
    alt: "English",
  },
  {
    code: "de",
    flag: "/images/de-flag.png",
    alt: "Deutsch",
  },
];

export const LanguageSwitcher = () => {
  const pathname = usePathname();
  const locale = useLocale();
  const router = useRouter();

  const [selectedLanguage, setSelectedLanguage] = useState<Language>(
    (languages.find((lang) => lang.code === locale) as Language) || languages[0]
  );

  useEffect(() => {
    const currentLang = languages.find((lang) => lang.code === locale);
    if (currentLang && currentLang.code !== selectedLanguage.code) {
      setSelectedLanguage(currentLang);
    }
  }, [locale, selectedLanguage.code]);

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
        <button className="focus:outline-none">
          <Image
            src={selectedLanguage.flag}
            width={30}
            height={45}
            alt={selectedLanguage.alt}
            className="rounded-lg !h-[30px] cursor-pointer hover:opacity-80 transition-opacity"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[50px]">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => handleLanguageChange(language)}
            className="flex justify-center"
          >
            <Image
              src={language.flag}
              width={25}
              height={45}
              alt={language.alt}
              className="rounded-lg"
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
