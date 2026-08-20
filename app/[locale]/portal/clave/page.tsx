import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BrandMark } from "@/components/brand-mark";
import { PortalPasswordForm } from "@/components/portal/password-form";
import { Link, redirect } from "@/i18n/navigation";
import { getPortalSession } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.password" });

  return { title: t("title"), robots: { index: false, follow: false } };
}

export default async function PortalPasswordPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) {
    redirect({ href: "/portal/login", locale });
    return null;
  }

  const t = await getTranslations("portal.password");
  const forced = session.mustChangePassword;

  return (
    <main className="portal-acceso">
      <div className="portal-acceso__caja">
        <div className="portal-acceso__marca">
          <BrandMark height={52} priority />
        </div>
        <p className="eyebrow eyebrow--green">{t("eyebrow")}</p>
        <h1 className="title-sm" style={{ marginTop: 8 }}>
          {forced ? t("titleForced") : t("title")}
        </h1>
        <p className="prose" style={{ marginTop: 8 }}>
          {forced ? t("leadForced") : t("lead")}
        </p>

        <PortalPasswordForm forced={forced} />

        {forced ? (
          <p className="portal-acceso__ayuda">{t("help")}</p>
        ) : (
          <Link className="link-arrow" href="/portal">
            {t("back")}
          </Link>
        )}
      </div>
    </main>
  );
}
