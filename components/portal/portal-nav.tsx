"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { PORTAL_NAV_ITEMS } from "@/lib/portal/nav";

function isActive(pathname: string, href: string) {
  if (href === "/portal") return pathname === "/portal";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function PortalNav() {
  const pathname = usePathname();
  const t = useTranslations("portal.nav");

  return (
    <nav className="portal-nav" aria-label={t("label")}>
      {PORTAL_NAV_ITEMS.map((item) => (
        <Link
          key={item.href}
          className="portal-nav__link"
          href={item.href}
          aria-current={isActive(pathname, item.href) ? "page" : undefined}
        >
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
}
