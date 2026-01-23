"use server";

import https from "https";
import http from "http";
import { URL } from "url";

export async function login(email: string, password: string) {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
  const loginUrl = `${apiUrl}/auth/login`;
  
  // Parse the URL to determine protocol
  const url = new URL(loginUrl);
  const isHttps = url.protocol === "https:";
  
  // Create FormData-like body
  const formData = new URLSearchParams();
  formData.append("email", email);
  formData.append("password", password);
  const body = formData.toString();

  return new Promise<{
    data: any;
    status: number;
    statusText: string;
  }>((resolve, reject) => {
    const options = {
      hostname: url.hostname,
      port: url.port || (isHttps ? 443 : 80),
      path: url.pathname + url.search,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(body),
      },
      // Handle insecure SSL certificates
      ...(isHttps && {
        rejectUnauthorized: false,
      }),
    };

    const requestModule = isHttps ? https : http;

    const req = requestModule.request(options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = data ? JSON.parse(data) : {};
          resolve({
            data: jsonData,
            status: res.statusCode || 500,
            statusText: res.statusMessage || "Unknown",
          });
        } catch (error) {
          resolve({
            data: { message: "Failed to parse response", raw: data },
            status: res.statusCode || 500,
            statusText: res.statusMessage || "Unknown",
          });
        }
      });
    });

    req.on("error", (error) => {
      resolve({
        data: { message: error.message || "Network error" },
        status: 500,
        statusText: "Internal Server Error",
      });
    });

    req.write(body);
    req.end();
  });
}
