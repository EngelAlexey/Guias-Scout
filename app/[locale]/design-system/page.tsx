import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PendingValue } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { PALETTE_HEX } from "@/lib/content/site";

type Props = { params: Promise<{ locale: string }> };

const TAGS = {
  code: (chunks: ReactNode) => <code>{chunks}</code>,
  b: (chunks: ReactNode) => <b>{chunks}</b>,
  br: () => <br />,
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "designSystem" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    robots: { index: false, follow: true },
  };
}

export default async function DesignSystemPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const palette = t.raw("content.palette") as { name: string; use: string }[];

  return (
    <section className="section section--cream">
      <div className="container">
        <p className="breadcrumb breadcrumb--apagado">
          <Link href="/">{t("nav.home")}</Link>{" "}
          {t("layout.breadcrumbSeparator")} {t("nav.designSystem")}
        </p>
        <p className="eyebrow" style={{ marginTop: 20 }}>
          {t("designSystem.eyebrow")}
        </p>
        <h1 className="title-lg section-head__title">
          {t("designSystem.title")}
        </h1>
        <p className="lead" style={{ marginTop: 12 }}>
          {t.rich("designSystem.lead", TAGS)}
        </p>

        <h2 className="title-sm bloque-titulo">
          {t("designSystem.colorTitle")}
        </h2>
        <ul className="swatch-grid">
          {palette.map((color, index) => {
            const hex = PALETTE_HEX[index];
            return (
              <li className="swatch" key={hex}>
                <div
                  className="swatch__muestra"
                  style={{ background: hex }}
                  aria-hidden="true"
                />
                <div className="swatch__cuerpo">
                  <p className="swatch__nombre">{color.name}</p>
                  <p className="swatch__hex">{hex}</p>
                  <p className="swatch__uso">{color.use}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <h2 className="title-sm bloque-titulo">
          {t("designSystem.typographyTitle")}
        </h2>
        <div className="spec-grid spec-grid--2">
          <div className="spec-card">
            <p className="spec-card__titulo">
              {t("designSystem.typographyHeadings")}
            </p>
            <p className="spec-card__muestra">Aa Bb Cc</p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.typographyHeadingsDetail", TAGS)}
            </p>
          </div>
          <div className="spec-card">
            <p className="spec-card__titulo">
              {t("designSystem.typographyBody")}
            </p>
            <p className="spec-card__muestra spec-card__muestra--texto">
              Aa Bb Cc
            </p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.typographyBodyDetail", TAGS)}
            </p>
          </div>
        </div>

        <h2 className="title-sm bloque-titulo">
          {t("designSystem.componentsTitle")}
        </h2>
        <div className="spec-grid spec-grid--3">
          <div className="spec-card">
            <p className="spec-card__titulo">
              {t("designSystem.buttonsTitle")}
            </p>
            <div className="spec-card__botones">
              <span className="btn">{t("designSystem.buttonPrimary")}</span>
              <span className="btn btn--accent">
                {t("designSystem.buttonAccent")}
              </span>
              <span className="btn btn--ghost">
                {t("designSystem.buttonGhost")}
              </span>
            </div>
            <p className="spec-card__detalle">
              {t.rich("designSystem.buttonsDetail", TAGS)}
            </p>
          </div>

          <div className="spec-card">
            <p className="spec-card__titulo">{t("designSystem.cardTitle")}</p>
            <div className="card card--cream" style={{ marginTop: 16 }}>
              <div className="icon-badge icon-badge--sm" data-seccion="tropa" />
              <h3 className="title-sm" style={{ marginTop: 14 }}>
                {t("designSystem.cardSample")}
              </h3>
              <p className="spec-card__detalle" style={{ marginTop: 6 }}>
                {t.rich("designSystem.cardDetail", TAGS)}
              </p>
            </div>
          </div>

          <div className="spec-card">
            <p className="spec-card__titulo">{t("designSystem.rhythmTitle")}</p>
            <p className="spec-card__detalle spec-card__detalle--suelto">
              {t.rich("designSystem.rhythmDetail", TAGS)}
            </p>
          </div>
        </div>

        <h2 className="title-sm bloque-titulo">
          {t("designSystem.howToTitle")}
        </h2>
        <div className="spec-grid spec-grid--3">
          <div className="spec-card">
            <p className="spec-card__titulo">
              {t("designSystem.structureTitle")}
            </p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.structureDetail", {
                ...TAGS,
                route: "app/[locale]/<ruta>/page.tsx",
                section: '<section className="section section--cream">',
                wrapper: '<div className="container">',
                layout: "app/[locale]/layout.tsx",
              })}
            </p>
          </div>
          <div className="spec-card">
            <p className="spec-card__titulo">{t("designSystem.accentTitle")}</p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.accentDetail", TAGS)}
            </p>
          </div>
          <div className="spec-card">
            <p className="spec-card__titulo">{t("designSystem.i18nTitle")}</p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.i18nDetail", TAGS)}
            </p>
          </div>
        </div>

        <div className="spec-grid spec-grid--2">
          <div className="spec-card">
            <p className="spec-card__titulo">
              {t("designSystem.contentTitle")}
            </p>
            <p className="spec-card__detalle">
              {t.rich("designSystem.contentDetail", TAGS)}
            </p>
            <div className="spec-card__botones">
              <PendingValue />
            </div>
          </div>
        </div>

        <div className="reparto">
          <div>
            <p className="eyebrow eyebrow--amber">
              {t("designSystem.splitEyebrowDone")}
            </p>
            <h3>{t("designSystem.splitTitleDone")}</h3>
            <p>{t.rich("designSystem.splitTextDone", TAGS)}</p>
          </div>
          <div>
            <p className="eyebrow eyebrow--apagado">
              {t("designSystem.splitEyebrowPending")}
            </p>
            <h3>{t("designSystem.splitTitlePending")}</h3>
            <p>{t.rich("designSystem.splitTextPending", TAGS)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
