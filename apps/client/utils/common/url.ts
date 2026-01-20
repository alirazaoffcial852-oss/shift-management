type ParamValue = string | number | boolean | null | undefined;
type ParamArray = (string | number)[];

export function buildSearchParams(
  params: Record<string, ParamValue | ParamArray>
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          searchParams.append(key, item.toString());
        }
      });
    } else {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}

export function buildQueryString(
  params: Record<string, ParamValue | ParamArray>
): string {
  const searchParams = buildSearchParams(params);
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

export function appendParams(
  searchParams: URLSearchParams,
  params: Record<string, ParamValue | ParamArray>
): URLSearchParams {
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== null && item !== undefined && item !== "") {
          searchParams.append(key, item.toString());
        }
      });
    } else {
      searchParams.append(key, value.toString());
    }
  });

  return searchParams;
}

export function getParam(
  searchParams: URLSearchParams,
  key: string
): string | null {
  return searchParams.get(key);
}

export function getParamAsNumber(
  searchParams: URLSearchParams,
  key: string,
  defaultValue: number = 0
): number {
  const value = searchParams.get(key);
  if (!value) return defaultValue;
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
}

export function getParamAsArray(
  searchParams: URLSearchParams,
  key: string
): string[] {
  return searchParams.getAll(key);
}

export function buildPaginationParams(
  page: number,
  limit: number,
  additionalParams?: Record<string, ParamValue | ParamArray>
): URLSearchParams {
  return buildSearchParams({
    page,
    limit,
    ...additionalParams,
  });
}
