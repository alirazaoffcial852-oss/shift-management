import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

// Vercel automatically handles HTTP to HTTPS redirect with 308 status code
// No need for manual HTTPS redirect - Vercel does this automatically
export default createMiddleware({
  locales: ["en", "de"],
  defaultLocale: "en",
  localePrefix: "always",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
