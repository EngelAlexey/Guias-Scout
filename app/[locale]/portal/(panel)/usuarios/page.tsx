import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PortalUsersManager } from "@/components/portal/users-manager";
import { redirect } from "@/i18n/navigation";
import { getPortalSession } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.users" });

  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function PortalUsersPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) {
    redirect({ href: "/portal/login", locale });
    return null;
  }

  const t = await getTranslations("portal.users");

  return (
    <>
      <p className="eyebrow eyebrow--green">{t("eyebrow")}</p>
      <h1 className="title-md" style={{ marginTop: 8 }}>
        {t("title")}
      </h1>
      <p className="prose" style={{ marginTop: 8 }}>
        {t("lead")}
      </p>

      <PortalUsersManager sessionUserId={session.id} />

      <p className="portal-nota">{t("scopeNote")}</p>
    </>
  );
}
