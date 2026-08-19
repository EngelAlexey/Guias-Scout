import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PendingValue } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { PAGE_IMAGES, SECTION_IDS, SECTION_IMAGES } from "@/lib/content/site";

type Props = { params: Promise<{ locale: string }> };

type Fact = { label: string; value?: string };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "sections" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function SectionsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.sections")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("sections.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("sections.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("sections.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.sectionsHero}
              alt={t("sections.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      <nav className="anchor-band" aria-label={t("sections.anchorNav")}>
        <div className="container">
          <ul className="anchor-nav">
            {SECTION_IDS.map((id) => (
              <li key={id} data-seccion={id}>
                <a className="anchor-chip" href={`#${id}`}>
                  <span className="punto" aria-hidden="true" />
                  <span>{t(`content.sections.${id}.name`)}</span>
                  <span className="anchor-chip__edades">
                    {t(`content.sections.${id}.agesShort`)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {SECTION_IDS.map((id, index) => {
        const mediaFirst = index % 2 === 1;
        const facts = t.raw(`content.sections.${id}.facts`) as Fact[];
        const topics = t.raw(`content.sections.${id}.topics`) as string[];

        const media = (
          <div className="split__media">
            <div className="figure figure--shadow">
              <Image
                src={SECTION_IMAGES[id]}
                alt={t(`content.sections.${id}.imageAlt`)}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        );

        return (
          <section
            key={id}
            id={id}
            data-seccion={id}
            className={`section seccion-block ${
              mediaFirst ? "section--white section--bordered" : "section--cream"
            }`}
          >
            <div className="container split">
              {mediaFirst ? media : null}

              <div>
                <p className="tag-seccion">
                  <span className="punto" aria-hidden="true" />
                  {t(`content.sections.${id}.agesShort`)}
                </p>
                <h2 className="seccion-block__nombre">
                  {t(`content.sections.${id}.name`)}
                </h2>
                <p className="seccion-block__edades">
                  {t(`content.sections.${id}.ages`)}
                </p>
                <p className="prose" style={{ marginTop: 16 }}>
                  {t(`content.sections.${id}.description`)}
                </p>

                <dl className="fact-grid">
                  {facts.map((fact) => (
                    <div className="fact" key={fact.label}>
                      <dt className="fact__titulo">{fact.label}</dt>
                      <dd className="fact__valor">
                        {fact.value ?? <PendingValue />}
                      </dd>
                    </div>
                  ))}
                </dl>

                <ul className="chip-row" style={{ marginTop: 18 }}>
                  {topics.map((topic) => (
                    <li className="chip chip--acento" key={topic}>
                      {topic}
                    </li>
                  ))}
                </ul>
              </div>

              {mediaFirst ? null : media}
            </div>
          </section>
        );
      })}

      <section className="section section--lilac">
        <div className="container">
          <h2 className="title-sm title-sm--destacado">
            {t("sections.table.title")}
          </h2>

          <div className="tabla-wrap">
            <table className="tabla-secciones">
              <caption className="visually-hidden">
                {t("sections.table.caption")}
              </caption>
              <thead>
                <tr>
                  <th scope="col">{t("sections.table.colSection")}</th>
                  <th scope="col">{t("sections.table.colAges")}</th>
                  <th scope="col">{t("sections.table.colUnit")}</th>
                  <th scope="col">{t("sections.table.colFocus")}</th>
                </tr>
              </thead>
              <tbody>
                {SECTION_IDS.map((id) => (
                  <tr key={id} data-seccion={id}>
                    <td data-label={t("sections.table.colSection")}>
                      <span className="tabla-secciones__nombre">
                        <span className="punto" aria-hidden="true" />
                        {t(`content.sections.${id}.name`)}
                      </span>
                    </td>
                    <td data-label={t("sections.table.colAges")}>
                      {t(`content.sections.${id}.ages`)}
                    </td>
                    <td data-label={t("sections.table.colUnit")}>
                      {t(`content.sections.${id}.unit`)}
                    </td>
                    <td data-label={t("sections.table.colFocus")}>
                      {t(`content.sections.${id}.focus`)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="btn-row btn-row--alineado">
            <Link className="btn" href="/join">
              {t("sections.table.cta")}
            </Link>
            <p className="lead lead--pequeno">{t("sections.table.help")}</p>
          </div>
        </div>
      </section>
    </>
  );
}
