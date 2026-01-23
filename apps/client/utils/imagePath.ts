
export const getImagePath = (path: string): string => {
  if (path.startsWith("/client/")) {
    return path;
  }
  
  if (path.startsWith("/")) {
    return `/client${path}`;
  }
  
  return `/client/${path}`;
};
