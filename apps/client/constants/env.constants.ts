export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const IMAGE_URL =
  process.env.NEXT_PUBLIC_IMAGE_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL?.replace("/api", "") ||
  "http://localhost:5051/";

