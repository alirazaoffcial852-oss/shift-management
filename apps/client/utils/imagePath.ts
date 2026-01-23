export const getImagePath = (path: string): string => {
  // In production (Vercel), images are served from root, not /client
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  
  if (isProduction) {
    // In production, return path as-is (no /client prefix)
    if (path.startsWith("/")) {
      return path;
    }
    return `/${path}`;
  }
  
  // In development, prepend /client for local routing
  if (path.startsWith("/client/")) {
    return path;
  }
  
  if (path.startsWith("/")) {
    return `/client${path}`;
  }
  
  return `/client/${path}`;
};
