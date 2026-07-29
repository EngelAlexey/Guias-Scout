import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { UnderConstruction } from "@/components/under-construction";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("impact");

  return (
    <UnderConstruction title={t("title")} description={t("description")} />
  );
}
