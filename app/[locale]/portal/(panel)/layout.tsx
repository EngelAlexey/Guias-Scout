import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BrandMark } from "@/components/brand-mark";
import { PortalNav } from "@/components/portal/portal-nav";
import { Link, redirect } from "@/i18n/navigation";
import { getPortalSession } from "@/lib/portal/session";

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PortalPanelLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await getPortalSession();
  if (!session) {
    redirect({ href: "/portal/login", locale });
    return null;
  }

  // Con clave temporal la persona entra, pero solo hasta la pantalla de cambio.
  if (session.mustChangePassword) {
    redirect({ href: "/portal/clave", locale });
    return null;
  }

  const t = await getTranslations("portal.shell");

  return (
    <div className="portal">
      <a className="skip-link" href="#portal-contenido">
        {t("skipToContent")}
      </a>

      <header className="portal__header">
        <div className="container portal__header-inner">
          <Link className="portal__marca" href="/portal">
            <BrandMark height={38} />
            <span>
              <span className="portal__marca-nombre">{t("name")}</span>
              <span className="portal__marca-meta">{t("tagline")}</span>
            </span>
          </Link>

          <PortalNav />

          <div className="portal__sesion">
            <span className="portal__persona" title={session.email}>
              {session.fullName}
            </span>
            <Link className="portal__clave" href="/portal/clave">
              {t("changePassword")}
            </Link>
            <form action="/api/portal/logout" method="post">
              <button className="btn btn--ghost portal__salir" type="submit">
                {t("signOut")}
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="portal__main" id="portal-contenido">
        <div className="container">{children}</div>
      </main>
    </div>
  );
}
