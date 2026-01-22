import { NextRequest, NextResponse } from "next/server";
import https from "https";
import { URL } from "url";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://ec2-3-64-58-144.eu-central-1.compute.amazonaws.com/api";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "GET");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "POST");
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "PUT");
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "PATCH");
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return handleRequest(request, params, "DELETE");
}

async function handleRequest(
  request: NextRequest,
  params: Promise<{ path: string[] }>,
  method: string
): Promise<NextResponse> {
  try {
    const { path } = await params;
    const pathString = path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${BACKEND_URL}/${pathString}${searchParams ? `?${searchParams}` : ""}`;

    const headers: HeadersInit = {};
    const authHeader = request.headers.get("authorization");
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }
    const contentType = request.headers.get("content-type");
    if (contentType) {
      headers["Content-Type"] = contentType;
    }

    let body: BodyInit | undefined;
    if (["POST", "PUT", "PATCH"].includes(method)) {
      const contentType = request.headers.get("content-type");
      if (contentType?.includes("multipart/form-data")) {
        body = await request.blob();
      } else {
        body = await request.text();
      }
    }

    const parsedUrl = new URL(url);
    const isHttps = parsedUrl.protocol === "https:";

    // Handle insecure HTTPS with Node's https module
    if (isHttps) {
      return new Promise<NextResponse>((resolve) => {
        const options: https.RequestOptions = {
          hostname: parsedUrl.hostname,
          port: parsedUrl.port || 443,
          path: parsedUrl.pathname + parsedUrl.search,
          method,
          headers: headers as Record<string, string>,
          rejectUnauthorized: false, // CRITICAL: Bypass insecure certificate validation
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
              responseData = data;
            }
            resolve(
              NextResponse.json(responseData, {
                status: res.statusCode || 200,
                statusText: res.statusMessage,
                headers: {
                  "Content-Type": res.headers["content-type"] || "application/json",
                },
              })
            );
          });
        });

        req.on("error", (error) => {
          console.error("HTTPS proxy error:", error);
          resolve(
            NextResponse.json(
              { error: "Proxy request failed", message: error.message },
              { status: 500 }
            )
          );
        });

        if (body) {
          if (body instanceof Blob) {
            body.arrayBuffer().then((buffer) => {
              req.write(Buffer.from(buffer));
              req.end();
            });
          } else {
            req.write(body);
            req.end();
          }
        } else {
          req.end();
        }
      });
    }

    // Handle HTTP with regular fetch
    const response = await fetch(url, {
      method,
      headers,
      body,
    });

    const data = await response.text();
    let responseData: any;
    try {
      responseData = JSON.parse(data);
    } catch {
      responseData = data;
    }

    return NextResponse.json(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        "Content-Type": response.headers.get("content-type") || "application/json",
      },
    });
  } catch (error: any) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Proxy request failed", message: error.message },
      { status: 500 }
    );
  }
}
