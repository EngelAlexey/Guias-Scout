import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Mulish, Sora } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/content/site";
import "../globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-mulish",
  display: "swap",
});

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<Props, "children">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "site" });

  const name = t("name");
  const description = t("description");

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: name, template: `%s | ${t("shortName")}` },
    description,
    applicationName: name,
    openGraph: {
      type: "website",
      locale: `${locale}_CR`,
      siteName: name,
      title: name,
      description,
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  const t = await getTranslations("layout");

  return (
    <html lang={locale} className={`${sora.variable} ${mulish.variable}`}>
      <body>
        <NextIntlClientProvider>
          <a className="skip-link" href="#content">
            {t("skipToContent")}
          </a>
          <SiteHeader />
          <main id="content">{children}</main>
          <SiteFooter />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
