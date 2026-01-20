type FormDataValue = string | number | boolean | null | undefined | File | Blob;
type FormDataObject = Record<string, FormDataValue | FormDataValue[] | object>;

export function buildFormData(
  data: FormDataObject,
  existingFormData?: FormData
): FormData {
  const formData = existingFormData || new FormData();

  Object.entries(data).forEach(([key, value]) => {
    appendToFormData(formData, key, value);
  });

  return formData;
}

export function appendToFormData(
  formData: FormData,
  key: string,
  value: FormDataValue | FormDataValue[] | object
): void {
  if (value === null || value === undefined) {
    return;
  }

  if (value instanceof File || value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      formData.append(key, JSON.stringify([]));
      return;
    }

    if (typeof value[0] === "object" && !(value[0] instanceof File)) {
      formData.append(key, JSON.stringify(value));
    } else {
      value.forEach((item) => {
        if (item !== null && item !== undefined) {
          formData.append(key, item.toString());
        }
      });
    }
    return;
  }

  if (typeof value === "object") {
    formData.append(key, JSON.stringify(value));
    return;
  }

  if (typeof value === "boolean") {
    formData.append(key, value.toString());
    return;
  }

  formData.append(key, value.toString());
}

export function formDataToObject(formData: FormData): Record<string, string | File> {
  const obj: Record<string, string | File> = {};
  formData.forEach((value, key) => {
    obj[key] = value;
  });
  return obj;
}

export function appendIfExists(
  formData: FormData,
  key: string,
  value: FormDataValue
): void {
  if (value !== null && value !== undefined && value !== "") {
    formData.append(key, value.toString());
  }
}

export function appendFile(
  formData: FormData,
  key: string,
  file: File | Blob | null | undefined
): void {
  if (file) {
    formData.append(key, file);
  }
}

export function appendBoolean(
  formData: FormData,
  key: string,
  value: boolean | undefined,
  defaultValue: boolean = false
): void {
  formData.append(key, (value ?? defaultValue).toString());
}

export function appendNumber(
  formData: FormData,
  key: string,
  value: number | string | null | undefined,
  defaultValue: number = 0
): void {
  const numValue = value !== null && value !== undefined ? Number(value) : defaultValue;
  formData.append(key, (isNaN(numValue) ? defaultValue : numValue).toString());
}

export function appendJson<T>(
  formData: FormData,
  key: string,
  value: T | null | undefined,
  defaultValue: T | null = null
): void {
  formData.append(key, JSON.stringify(value ?? defaultValue));
}
