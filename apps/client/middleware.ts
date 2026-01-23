import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";

const intlMiddleware = createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export default function middleware(request: NextRequest) {
  // Enforce HTTPS redirect in production (Vercel)
  // Based on Next.js best practices: check x-forwarded-proto header
  // Vercel automatically provides HTTPS, but we ensure HTTP requests are redirected
  if (process.env.NODE_ENV === "production" || process.env.VERCEL === "1") {
    const forwardedProto = request.headers.get("x-forwarded-proto");
    const host = request.headers.get("host");
    
    // If protocol is HTTP, redirect to HTTPS using proper URL construction
    // Use host header to avoid issues with URL parsing
    if (forwardedProto === "http" && host) {
      const httpsUrl = `https://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
