import "@workspace/ui/globals.css";
import { Metadata } from "next";
import { Toaster } from "sonner";
import { LocaleProvider } from "@/provider/LocaleProvider";
import { getMessages } from "@workspace/translations";

export const metadata: Metadata = {
  title: "Shift Management System",
  description: "Shift Management System SaaS Product",
};

type Params = Promise<{ locale: string }>;

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const resolvedParams = await params;

  const { locale } = resolvedParams;
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true}>
        <LocaleProvider locale={locale} messages={messages}>
          {children}
        </LocaleProvider>
        <Toaster richColors />
      </body>
    </html>
  );
}
