export function getStorageItem<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorageItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage: ${key}`, error);
  }
}

export function removeStorageItem(key: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage: ${key}`, error);
  }
}

export function clearStorage(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing localStorage", error);
  }
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: "sms-token",
  SELECTED_COMPANY: "selected-company",
  SELECTED_SHIFTS: "selectedShifts",
  USER_PREFERENCES: "user-preferences",
} as const;

export type StorageKey = keyof typeof STORAGE_KEYS;
