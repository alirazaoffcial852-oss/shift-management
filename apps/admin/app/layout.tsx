import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { AppProvider } from "@/providers/appProvider";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Shift Management - Admin",
  description: "Shift Management System SaaS Product",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body className="antialiased" suppressHydrationWarning={true}>
        <Suspense fallback={<div>Loading...</div>}>
          <AppProvider>{children}</AppProvider>
        </Suspense>
        <Toaster />
      </body>
    </html>
  );
}
