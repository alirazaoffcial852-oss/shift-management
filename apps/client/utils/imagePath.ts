
export const getImagePath = (path: string): string => {
  if (!path || path.trim() === "") {
    return "/placeholder.svg";
  }
  
  let normalizedPath = path.trim();
  if (normalizedPath.startsWith("/client/")) {
    normalizedPath = normalizedPath.replace("/client", "");
  }
  
  if (!normalizedPath.startsWith("/")) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  return normalizedPath;
};
