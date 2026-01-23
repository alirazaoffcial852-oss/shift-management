export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// Ensure HTTPS in production to avoid mixed content warnings
const getImageUrl = (): string => {
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  
  if (process.env.NEXT_PUBLIC_IMAGE_BASE_URL) {
    const url = process.env.NEXT_PUBLIC_IMAGE_BASE_URL;
    // Ensure HTTPS in production
    if (isProduction && url.startsWith("http://")) {
      return url.replace("http://", "https://");
    }
    return url;
  }
  
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL.replace("/api", "");
    // Ensure HTTPS in production
    if (isProduction && baseUrl.startsWith("http://")) {
      return baseUrl.replace("http://", "https://");
    }
    return baseUrl;
  }
  
  // Default to localhost for development
  return "http://localhost:5051/";
};

export const IMAGE_URL = getImageUrl();

