"use server";

import https from "https";
import { URL } from "url";

export async function login(email: string, password: string) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api";
    const url = `${backendUrl}/auth/login`;
    
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);

    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === "https:";

    if (isHttps) {
      return new Promise<{ data: any; status: number; statusText: string }>((resolve) => {
        const boundary = `----WebKitFormBoundary${Date.now()}`;
        const CRLF = "\r\n";
        
        let bodyParts: string[] = [];
        bodyParts.push(`--${boundary}${CRLF}`);
        bodyParts.push(`Content-Disposition: form-data; name="email"${CRLF}${CRLF}`);
        bodyParts.push(`${email}${CRLF}`);
        bodyParts.push(`--${boundary}${CRLF}`);
        bodyParts.push(`Content-Disposition: form-data; name="password"${CRLF}${CRLF}`);
        bodyParts.push(`${password}${CRLF}`);
        bodyParts.push(`--${boundary}--${CRLF}`);
        
        const bodyString = bodyParts.join("");
        const bodyBuffer = Buffer.from(bodyString);

        const options: https.RequestOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || 443,
          path: parsedUrl.pathname + parsedUrl.search,
          method: "POST",
          headers: {
            "Content-Type": `multipart/form-data; boundary=${boundary}`,
            "Content-Length": bodyBuffer.length.toString(),
          },
          rejectUnauthorized: false, 
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
          // Resolve with error instead of rejecting
          resolve({
            data: { message: `Failed to connect to server: ${error.message}` },
            status: 500,
            statusText: "Internal Server Error",
          });
        });

        req.write(bodyBuffer);
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
  } catch (error: any) {
    console.error("Login server action error:", error);
    return {
      data: { 
        message: error?.message || "An unexpected error occurred during login",
        error: error?.toString() 
      },
      status: 500,
      statusText: "Internal Server Error",
    };
  }
}


