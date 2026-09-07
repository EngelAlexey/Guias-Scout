import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { CREDITS_INSTITUTIONS, CREDITS_TEAM } from "@/lib/content/site";

type Institution = { label: string };

type Person = { linkLabel: string };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "credits" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function CreditsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const institutions = t.raw("credits.programme.items") as Institution[];
  const people = t.raw("credits.people.items") as Person[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner page-hero__inner--simple">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.credits")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("credits.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("credits.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("credits.hero.lead")}
            </p>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <h2 className="title-md">{t("credits.programme.title")}</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            {t("credits.programme.lead")}
          </p>

          <dl className="fact-grid">
            {institutions.map((institution, index) => (
              <div className="fact" key={institution.label}>
                <dt className="fact__titulo">{institution.label}</dt>
                <dd className="fact__valor">
                  <a
                    className="link-arrow"
                    href={CREDITS_INSTITUTIONS[index].href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {CREDITS_INSTITUTIONS[index].linkText}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container">
          <h2 className="title-md">{t("credits.people.title")}</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            {t("credits.people.lead")}
          </p>

          <ul className="card-grid card-grid--3">
            {CREDITS_TEAM.map((person, index) => (
              <li className="card" key={person.name}>
                <h3 className="team-card__nombre">{person.name}</h3>
                <p className="team-card__rol">{people[index].linkLabel}</p>
                <p style={{ marginTop: 14 }}>
                  <a
                    className="link-arrow"
                    href={person.href}
                    target={person.external ? "_blank" : undefined}
                    rel={person.external ? "noopener noreferrer" : undefined}
                  >
                    {person.linkText}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--lilac">
        <div className="container">
          <p className="lead">{t("credits.note")}</p>
        </div>
      </section>
    </>
  );
}
