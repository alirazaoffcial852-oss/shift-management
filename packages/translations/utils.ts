import { createTranslator } from "next-intl";
import { TranslationMessages } from "./index";

// Add this new function
export async function getMessages(
  locale: string
): Promise<TranslationMessages> {
  return await loadTranslations(locale);
}

export async function getTranslations(locale: string, namespace?: string) {
  const messages = await loadTranslations(locale);
  return createTranslator({ locale, messages, namespace });
}

async function loadTranslations(locale: string): Promise<TranslationMessages> {
  try {
    switch (locale) {
      case "en":
        return (await import("./locales/en.json")).default;
      case "de":
        return (await import("./locales/de.json")).default;
      default:
        return (await import("./locales/en.json")).default;
    }
  } catch (error) {
    console.error(`Failed to load translations for ${locale}`, error);
    return {} as TranslationMessages;
  }
}

export function getLocaleFromPath(path: string): string {
  const parts = path.split("/").filter(Boolean);
  return parts[0] && isValidLocale(parts[0]) ? parts[0] : "en";
}

function isValidLocale(locale: string): boolean {
  return ["en", "de"].includes(locale);
}
