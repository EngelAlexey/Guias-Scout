import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

/** Encabezado y pie del sitio publico. El portal de encargados no los usa. */
export default async function SitioLayout({
  children,
}: {
  children: ReactNode;
}) {
  const t = await getTranslations("layout");

  return (
    <>
      <a className="skip-link" href="#content">
        {t("skipToContent")}
      </a>
      <SiteHeader />
      <main id="content">{children}</main>
      <SiteFooter />
    </>
  );
}
