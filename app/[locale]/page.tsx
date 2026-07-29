import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  IconBook,
  IconCampfire,
  IconCompass,
  IconHeart,
  IconLeaf,
  IconMountain,
  IconPaw,
  IconTent,
} from "@/components/icons";
import { PendingNote } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { PAGE_IMAGES, SDG, SECTION_IDS } from "@/lib/content/site";

const SECTION_ICON = {
  manada: IconPaw,
  tropa: IconTent,
  wak: IconCompass,
  comunidad: IconCampfire,
} as const;

const PILLARS = [
  { key: "education", Icon: IconBook, section: undefined },
  { key: "outdoors", Icon: IconMountain, section: "tropa" },
  { key: "service", Icon: IconHeart, section: "manada" },
] as const;

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <section className="section section--ink">
        <div className="container hero">
          <div>
            <p className="hero__badge">
              <IconLeaf size={15} />
              {t("home.hero.badge")}
            </p>
            <h1 className="title-xl hero__title">{t("home.hero.title")}</h1>
            <p className="lead hero__lead">{t("home.hero.lead")}</p>
            <div className="btn-row">
              <Link className="btn btn--accent btn--lg" href="/join">
                {t("home.hero.ctaJoin")}
              </Link>
              <Link className="btn btn--outline-dark btn--lg" href="/about">
                {t("home.hero.ctaAbout")}
              </Link>
            </div>

            <dl className="stats">
              <div className="stat">
                <dt className="stat__etiqueta">{t("home.hero.statAges")}</dt>
                <dd className="stat__valor">{t("home.hero.statAgesValue")}</dd>
              </div>
              <div className="stats__sep" aria-hidden="true" />
              <div className="stat">
                <dt className="stat__etiqueta">
                  {t("home.hero.statSections")}
                </dt>
                <dd className="stat__valor">{SECTION_IDS.length}</dd>
              </div>
              <div className="stats__sep" aria-hidden="true" />
              <div className="stat">
                <dt className="stat__etiqueta">{t("home.hero.statMethod")}</dt>
                <dd className="stat__valor">
                  {t("home.hero.statMethodValue")}
                </dd>
              </div>
            </dl>
          </div>

          <div className="hero__media">
            <Image
              src={PAGE_IMAGES.hero}
              alt={t("home.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t("home.sections.eyebrow")}</p>
              <h2 className="title-md section-head__title">
                {t("home.sections.title")}
              </h2>
            </div>
            <Link className="link-arrow" href="/sections">
              {t("home.sections.link")} &rarr;
            </Link>
          </div>

          <ul className="card-grid card-grid--4">
            {SECTION_IDS.map((id) => {
              const Icon = SECTION_ICON[id];
              return (
                <li key={id} data-seccion={id}>
                  <Link className="seccion-card" href={`/sections#${id}`}>
                    <div className="seccion-card__barra" aria-hidden="true" />
                    <div className="seccion-card__cuerpo">
                      <div className="icon-badge">
                        <Icon size={28} />
                      </div>
                      <h3 className="seccion-card__nombre">
                        {t(`content.sections.${id}.name`)}
                      </h3>
                      <div className="seccion-card__edades">
                        {t(`content.sections.${id}.ages`)}
                      </div>
                      <p className="seccion-card__resumen">
                        {t(`content.sections.${id}.summary`)}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split split--wide-end">
          <div className="split__media">
            <div className="figure">
              <Image
                src={PAGE_IMAGES.method}
                alt={t("home.method.imageAlt")}
                fill
                sizes="(max-width: 900px) 100vw, 40vw"
              />
            </div>
          </div>

          <div>
            <p className="eyebrow eyebrow--green">{t("home.method.eyebrow")}</p>
            <h2 className="title-md section-head__title">
              {t("home.method.title")}
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              {t("home.method.lead")}
            </p>

            <ul className="pilares">
              {PILLARS.map(({ key, Icon, section }) => (
                <li className="pilar" key={key} data-seccion={section}>
                  <span className="icon-badge icon-badge--sm">
                    <Icon size={23} />
                  </span>
                  <div>
                    <h3 className="pilar__titulo">
                      {t(`home.method.pillars.${key}.title`)}
                    </h3>
                    <p className="pilar__texto">
                      {t(`home.method.pillars.${key}.text`)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--green">
        <div className="container split-band">
          <div>
            <p className="eyebrow eyebrow--mint">
              {t("home.environment.eyebrow")}
            </p>
            <h2 className="title-md section-head__title">
              {t("home.environment.title")}
            </h2>
            <p className="lead" style={{ marginTop: 14 }}>
              {t("home.environment.lead")}
            </p>
            <div className="btn-row">
              <Link className="btn btn--light" href="/impact">
                {t("home.environment.cta")} &rarr;
              </Link>
            </div>
          </div>

          <div>
            <ul className="ods-row">
              {SDG.map((sdg, index) => (
                <li
                  key={sdg.number}
                  className="ods-chip"
                  style={{ background: sdg.hex }}
                >
                  <span className="ods-chip__numero">{sdg.number}</span>
                  <span className="ods-chip__etiqueta">
                    {t(`content.sdg.${index}.label`)}
                  </span>
                </li>
              ))}
            </ul>
            <p className="ods-row__nota">{t("home.environment.sdgNote")}</p>
          </div>
        </div>
      </section>

      <section className="section section--white">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t("home.agenda.eyebrow")}</p>
              <h2 className="title-md section-head__title">
                {t("home.agenda.title")}
              </h2>
            </div>
            <Link className="link-arrow" href="/news">
              {t("home.agenda.link")} &rarr;
            </Link>
          </div>

          <PendingNote text={t("home.agenda.empty")} />
        </div>
      </section>

      <section className="section section--lilac">
        <div className="container container--centrado">
          <h2 className="title-lg">{t("home.closing.title")}</h2>
          <p className="lead lead--centrado">{t("home.closing.lead")}</p>
          <div className="btn-row btn-row--center">
            <Link className="btn btn--lg" href="/join">
              {t("home.closing.ctaJoin")}
            </Link>
            <Link className="btn btn--ghost btn--lg" href="/about">
              {t("home.closing.ctaAbout")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
