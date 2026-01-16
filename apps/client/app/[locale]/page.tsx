import { redirect } from "next/navigation";

type Params = Promise<{ locale: string }>;

export default async function LocaleIndexPage({ params }: { params: Params }) {
  const { locale } = await params;
  return redirect(`/${locale}/customers`);
}
