import ClientWrapper from "@/providers/ClientWrapper";
import { LocaleProvider } from "@/providers/LocaleProvider";
import { getMessages } from "@workspace/translations";

type Params = Promise<{ locale: string }>;

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
    <LocaleProvider locale={locale} messages={messages}>
      <ClientWrapper>
        <main className="flex-grow">{children}</main>
      </ClientWrapper>
    </LocaleProvider>
  );
}
