import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BrandMark } from "@/components/brand-mark";
import { PortalLoginForm } from "@/components/portal/login-form";
import { Link, redirect } from "@/i18n/navigation";
import { getPortalSession } from "@/lib/portal/session";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "portal.login" });

  return {
    title: t("title"),
    robots: { index: false, follow: false },
  };
}

export default async function PortalLoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (session) redirect({ href: "/portal", locale });

  const t = await getTranslations("portal.login");

  return (
    <main className="portal-acceso">
      <div className="portal-acceso__caja">
        <div className="portal-acceso__marca">
          <BrandMark height={52} priority />
        </div>
        <p className="eyebrow eyebrow--green">{t("eyebrow")}</p>
        <h1 className="title-sm" style={{ marginTop: 8 }}>
          {t("title")}
        </h1>
        <p className="prose" style={{ marginTop: 8 }}>
          {t("lead")}
        </p>

        <PortalLoginForm />

        <p className="portal-acceso__ayuda">{t("help")}</p>
        <Link className="link-arrow" href="/">
          {t("backToSite")}
        </Link>
      </div>
    </main>
  );
}
