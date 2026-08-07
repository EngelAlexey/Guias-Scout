import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { PAGE_IMAGES } from "@/lib/content/site";

type Project = {
  name: string;
  status: "active" | "done";
  year: string;
  lead: string;
  result: string;
  detail: string;
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const projects = t.raw("projects.items") as Project[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.projects")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("projects.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("projects.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("projects.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.projectsHero}
              alt={t("projects.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <ul className="card-grid">
            {projects.map((project) => (
              <li className="card" key={project.name}>
                <div className="fact" style={{ margin: 0 }}>
                  <dt className="fact__titulo">{project.year}</dt>
                  <dd className="fact__valor">
                    <span className="chip chip--acento">
                      {t(`projects.status.${project.status}`)}
                    </span>
                  </dd>
                </div>
                <h2 className="title-sm" style={{ marginTop: 18 }}>
                  {project.name}
                </h2>
                <p className="team-card__rol" style={{ marginTop: 6 }}>
                  {project.lead}
                </p>
                <p className="prose" style={{ marginTop: 14 }}>
                  {project.result}
                </p>
                <p className="prose">{project.detail}</p>
              </li>
            ))}
          </ul>

          <p className="card__fuente" style={{ marginTop: 22 }}>
            {t("projects.pendingNote")}
          </p>
        </div>
      </section>
    </>
  );
}
