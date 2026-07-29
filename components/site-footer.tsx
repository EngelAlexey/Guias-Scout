import { getTranslations } from "next-intl/server";

import { BrandMark } from "@/components/brand-mark";
import { PendingValue } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { FOOTER_NAV, FOOTER_TRANSPARENCY, SDG } from "@/lib/content/site";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <BrandMark className="footer-brand__logo" height={40} onDark />
              <span>
                <span className="brand__name footer-brand__name">
                  {t("site.shortName")}
                </span>
                <span className="brand__meta footer-brand__meta">
                  {t("site.tagline")}
                </span>
              </span>
            </div>
            <p className="footer-brand__texto">{t("footer.text")}</p>
          </div>

          <nav className="footer-col" aria-label={t("footer.navLabel")}>
            <h2 className="footer-col__titulo">{t("footer.navTitle")}</h2>
            <ul className="footer-col__lista">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{t(`nav.${item.key}`)}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav
            className="footer-col"
            aria-label={t("footer.transparencyLabel")}
          >
            <h2 className="footer-col__titulo">
              {t("footer.transparencyTitle")}
            </h2>
            <ul className="footer-col__lista">
              {FOOTER_TRANSPARENCY.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    {item.key === "impact"
                      ? t("footer.impactLink")
                      : t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="footer-col">
            <h2 className="footer-col__titulo">{t("footer.contactTitle")}</h2>
            <div className="footer-dato">
              <div className="footer-dato__label">{t("footer.venueLabel")}</div>
              <div>
                <PendingValue />
              </div>
              <div className="footer-dato__label footer-dato__label--espaciado">
                {t("footer.emailLabel")}
              </div>
              <div>
                <PendingValue />
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            {t("footer.copyright", {
              year: new Date().getFullYear(),
              name: t("site.name"),
            })}
          </p>
          <ul className="footer-ods" aria-label={t("footer.sdgLabel")}>
            {SDG.map((sdg, index) => (
              <li
                key={sdg.number}
                className="footer-ods__chip"
                style={{ background: sdg.hex }}
              >
                <span className="footer-ods__numero">{sdg.number}</span>
                <span className="footer-ods__sigla">{t("footer.sdgAbbr")}</span>
                <span className="visually-hidden">
                  {t(`content.sdg.${index}.label`)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
