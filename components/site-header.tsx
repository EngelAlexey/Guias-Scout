"use client";

import { useEffect, useId, useState } from "react";
import { useTranslations } from "next-intl";

import { BrandMark } from "@/components/brand-mark";
import { IconClose, IconMenu } from "@/components/icons";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_ITEMS } from "@/lib/content/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const menuId = useId();
  const t = useTranslations();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <Link className="brand" href="/">
          <BrandMark className="brand__logo" height={44} priority />
          <span>
            <span className="brand__name">{t("site.shortName")}</span>
            <span className="brand__meta">{t("site.tagline")}</span>
          </span>
        </Link>

        <nav className="primary-nav" aria-label={t("layout.mainNav")}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              className="nav-link"
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <Link className="btn header-cta" href="/join">
            {t("nav.join")}
          </Link>
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls={menuId}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose size={22} /> : <IconMenu size={22} />}
            <span className="visually-hidden">
              {open ? t("layout.closeMenu") : t("layout.openMenu")}
            </span>
          </button>
        </div>
      </div>

      <div className="mobile-nav" id={menuId} data-open={open}>
        <div className="container mobile-nav__list">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(pathname, item.href) ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </Link>
          ))}
          <Link className="btn" href="/join">
            {t("nav.join")}
          </Link>
        </div>
      </div>
    </header>
  );
}
