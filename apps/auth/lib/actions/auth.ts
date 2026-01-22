"use server";

import https from "https";
import { URL } from "url";

export async function login(email: string, password: string) {
  const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api";
  const url = `${backendUrl}/auth/login`;
  
  const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);

  const parsedUrl = new URL(url);
  const isHttps = parsedUrl.protocol === "https:";

  if (isHttps) {
    return new Promise<{ data: any; status: number; statusText: string }>((resolve, reject) => {
      const formDataEntries: string[] = [];
      formdata.forEach((value, key) => {
        if (value instanceof File) {
          formDataEntries.push(`Content-Disposition: form-data; name="${key}"; filename="${value.name}"\r\nContent-Type: ${value.type || "application/octet-stream"}\r\n\r\n`);
        } else {
          formDataEntries.push(`Content-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`);
        }
      });
      
      const body = new URLSearchParams();
      body.append("email", email);
      body.append("password", password);
      const bodyString = body.toString();

      const options: https.RequestOptions = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: parsedUrl.pathname + parsedUrl.search,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(bodyString),
        },
      };

      const req = https.request(options, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk.toString();
        });
        res.on("end", () => {
          let responseData: any;
          try {
            responseData = JSON.parse(data);
          } catch {
            responseData = { message: data };
          }
          resolve({
            data: responseData,
            status: res.statusCode || 200,
            statusText: res.statusMessage || "OK",
          });
        });
      });

      req.on("error", (error) => {
        console.error("Login request error:", error);
        reject({
          data: { message: "Failed to connect to server" },
          status: 500,
          statusText: "Internal Server Error",
        });
      });

      req.write(bodyString);
      req.end();
    });
  }

  const response = await fetch(url, {
    method: "POST",
    body: formdata,
  });
  
  let resp = await response.json();

  return {
    data: { ...resp },
    status: response.status,
    statusText: response.statusText,
  };
}
