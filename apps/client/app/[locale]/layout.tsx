import "@workspace/ui/globals.css";
import { Metadata } from "next";
import ClientWrapper from "@/providers/ClientWrapper";
import { LocaleProvider } from "@/providers/LocaleProvider";
import HeaderContainer from "@/components/HeaderContainer";
import { getMessages } from "@workspace/translations";
import { Toaster } from "sonner";
import { ProfileProvider } from "@/providers/profileProvider";
import FooterContainer from "@/components/FooterContainer";

type Params = Promise<{ locale: string }>;

export const metadata: Metadata = {
  title: "Shift Management - Client",
  description: "Shift Management System SaaS Product",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Params;
}>) {
  const { locale } = await params;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} className="overflow-x-hidden h-full" suppressHydrationWarning>
      <body className="overflow-x-hidden max-w-full flex flex-col min-h-screen" suppressHydrationWarning>
        <LocaleProvider locale={locale} messages={messages}>
          <ClientWrapper>
            <ProfileProvider>
              <Toaster position="bottom-right" richColors />
              <div className="flex flex-col min-h-screen">
                <HeaderContainer />
                <main className="flex-grow overflow-x-hidden w-full">
                  <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 overflow-x-hidden">
                    {children}
                  </div>
                </main>
                <FooterContainer />
              </div>
            </ProfileProvider>
          </ClientWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
