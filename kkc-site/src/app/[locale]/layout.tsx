import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";

import { locales, type Locale } from "@/i18n/routing";
import { AuthProvider } from "@/providers/AuthProvider";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteNavbar } from "@/components/site/SiteNavbar";
import { WhatsAppFloatingButton } from "@/components/site/WhatsAppFloatingButton";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const t = await getTranslations({ locale, namespace: undefined });
  const title = t("brand.name");
  const description = t("home.heroSubheadline");

  return {
    metadataBase: new URL("https://kkc-quincaillerie.vercel.app"),
    title: {
      default: title,
      template: `%s | ${title}`
    },
    description,
    applicationName: title,
    keywords: [
      "construction materials Kigali",
      "quincaillerie Kigali",
      "building supplies Rwanda",
      "cement",
      "steel",
      "tiles",
      "hardware store"
    ],
    openGraph: {
      title,
      description,
      locale,
      type: "website"
    },
    alternates: {
      languages: {
        en: "/en",
        rw: "/rw"
      }
    }
  };
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <AuthProvider>
        <SiteNavbar />
        <main className="relative">{children}</main>
        <SiteFooter />
        <WhatsAppFloatingButton />
      </AuthProvider>
    </NextIntlClientProvider>
  );
}

