import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { PendingValue } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { PAGE_IMAGES } from "@/lib/content/site";

type Fact = { label: string; value?: string };

type Axis = { eyebrow: string; title: string; lead: string; facts: Fact[] };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "impact" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ImpactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const axes = t.raw("impact.axes") as Axis[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.impact")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("impact.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("impact.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("impact.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.impactHero}
              alt={t("impact.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      {axes.map((axis, index) => (
        <section
          key={axis.title}
          className={`section ${
            index % 2 === 1 ? "section--white section--bordered" : "section--cream"
          }`}
        >
          <div className="container">
            <p className="eyebrow eyebrow--green">{axis.eyebrow}</p>
            <h2 className="title-md section-head__title">{axis.title}</h2>
            <p className="lead" style={{ marginTop: 12 }}>
              {axis.lead}
            </p>

            <dl className="fact-grid">
              {axis.facts.map((fact) => (
                <div className="fact" key={fact.label}>
                  <dt className="fact__titulo">{fact.label}</dt>
                  <dd className="fact__valor">
                    {fact.value ?? <PendingValue />}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      ))}

      <section className="section section--lilac">
        <div className="container">
          <p className="lead">{t("impact.note")}</p>
        </div>
      </section>
    </>
  );
}
