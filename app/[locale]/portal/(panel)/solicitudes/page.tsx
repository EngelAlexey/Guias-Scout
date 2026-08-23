import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PortalSubmissionsManager } from "@/components/portal/submissions-manager";
import { redirect } from "@/i18n/navigation";
import { getPortalSession } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.submissions" });

  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function PortalSubmissionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) {
    redirect({ href: "/portal/login", locale });
    return null;
  }

  const t = await getTranslations("portal.submissions");

  return (
    <>
      <p className="eyebrow eyebrow--green">{t("eyebrow")}</p>
      <h1 className="title-md" style={{ marginTop: 8 }}>
        {t("title")}
      </h1>
      <p className="prose" style={{ marginTop: 8 }}>
        {t("lead")}
      </p>

      <PortalSubmissionsManager />

      <p className="portal-nota">{t("scopeNote")}</p>
    </>
  );
}
