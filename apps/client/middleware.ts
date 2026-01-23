import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // Enforce HTTPS in production (Vercel)
  const isProduction = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  
  if (isProduction) {
    // Check x-forwarded-proto header (Vercel sets this)
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const urlProtocol = request.nextUrl.protocol.replace(":", "");
    
    // If request is HTTP, redirect to HTTPS
    if (forwardedProto === "http" || urlProtocol === "http") {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = "https:";
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
