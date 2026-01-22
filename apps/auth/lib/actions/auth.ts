"use server";

import https from "https";
import { URL } from "url";

export async function login(email: string, password: string) {
  try {
    if (!email || !password) {
      return {
        data: { message: "Email and password are required" },
        status: 400,
        statusText: "Bad Request",
      };
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api";
    const url = `${backendUrl}/auth/login`;
    
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch (urlError: any) {
      console.error("Invalid URL:", urlError);
      return {
        data: { message: `Invalid backend URL: ${urlError.message}` },
        status: 500,
        statusText: "Internal Server Error",
      };
    }

    const isHttps = parsedUrl.protocol === "https:";

    if (isHttps) {
      return await new Promise<{ data: any; status: number; statusText: string }>((resolve) => {
        try {
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
            resolve({
              data: { message: `Failed to connect to server: ${error.message}` },
              status: 500,
              statusText: "Internal Server Error",
            });
          });

          req.on("timeout", () => {
            req.destroy();
            resolve({
              data: { message: "Request timeout" },
              status: 500,
              statusText: "Internal Server Error",
            });
          });

          req.setTimeout(30000); 

          req.write(bodyBuffer);
          req.end();
        } catch (promiseError: any) {
          console.error("Promise setup error:", promiseError);
          resolve({
            data: { message: `Request setup failed: ${promiseError.message}` },
            status: 500,
            statusText: "Internal Server Error",
          });
        }
      });
    }

    try {
      const formdata = new FormData();
      formdata.append("email", email);
      formdata.append("password", password);
      
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
    } catch (fetchError: any) {
      console.error("Fetch error:", fetchError);
      return {
        data: { message: `Fetch failed: ${fetchError.message}` },
        status: 500,
        statusText: "Internal Server Error",
      };
    }
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


