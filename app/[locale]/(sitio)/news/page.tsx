import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { PAGE_IMAGES } from "@/lib/content/site";

type NewsItem = {
  date: string;
  section?: string;
  title: string;
  body: string;
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "news" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const items = t.raw("news.items") as NewsItem[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.news")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("news.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("news.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("news.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.newsHero}
              alt={t("news.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      {items.length === 0 ? (
        <section className="section section--cream">
          <div className="container construccion">
            <h2 className="title-lg">{t("news.emptyTitle")}</h2>
            <p className="lead">{t("news.emptyLead")}</p>
          </div>
        </section>
      ) : (
        <section className="section section--cream">
          <div className="container">
            <ul className="card-grid">
              {items.map((item) => (
                <li className="card" key={item.title}>
                  <p className="eyebrow eyebrow--green">{item.date}</p>
                  {item.section ? (
                    <p className="chip chip--acento" style={{ marginTop: 10 }}>
                      {item.section}
                    </p>
                  ) : null}
                  <h2 className="title-sm" style={{ marginTop: 14 }}>
                    {item.title}
                  </h2>
                  <p className="prose" style={{ marginTop: 10 }}>
                    {item.body}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section section--lilac">
        <div className="container">
          <p className="lead">{t("news.note")}</p>
        </div>
      </section>
    </>
  );
}
