import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  IconClock,
  IconEye,
  IconLocation,
  IconMail,
  IconPhone,
  IconStar,
  IconTarget,
} from "@/components/icons";
import { PendingNote, PendingValue } from "@/components/pending";
import { Link } from "@/i18n/navigation";
import { CONTACT, PAGE_IMAGES, TEAM_SECTIONS } from "@/lib/content/site";

type Milestone = { year: string; text: string };

type TeamMember = {
  initials: string;
  name: string;
  role: string;
  detail: string;
};

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const values = t.raw("content.values") as string[];
  const scoutLaw = t.raw("content.scoutLaw") as string[];
  const milestones = t.raw("content.milestones") as Milestone[];
  const team = t.raw("content.team") as TeamMember[];
  const groupAreas = t.raw("content.groupAreas") as string[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.about")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("about.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("about.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("about.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.aboutHero}
              alt={t("about.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split split--wide-start">
          <div>
            <p className="eyebrow">{t("about.history.eyebrow")}</p>
            <h2 className="title-md section-head__title">
              {t("about.history.title")}
            </h2>
            <p className="prose" style={{ marginTop: 18 }}>
              {t("about.history.lead")}
            </p>

            <p className="prose">{t("about.history.story")}</p>
            <p className="prose">{t("about.history.sponsor")}</p>

            <dl className="metric-grid">
              <div className="metric">
                <dt className="metric__etiqueta">
                  {t("about.history.metricFoundation")}
                </dt>
                <dd className="metric__valor">
                  {t("about.history.foundationValue")}
                </dd>
              </div>
              <div className="metric">
                <dt className="metric__etiqueta">
                  {t("about.history.metricPeople")}
                </dt>
                <dd className="metric__valor">
                  <PendingValue />
                </dd>
              </div>
              <div className="metric">
                <dt className="metric__etiqueta">
                  {t("about.history.metricLeaders")}
                </dt>
                <dd className="metric__valor">
                  {t("about.history.leadersValue")}
                </dd>
              </div>
            </dl>

            <h3 className="title-sm" style={{ marginTop: 34 }}>
              {t("about.history.milestonesTitle")}
            </h3>
            <dl className="fact-grid">
              {milestones.map((milestone) => (
                <div className="fact" key={milestone.year}>
                  <dt className="fact__titulo">{milestone.year}</dt>
                  <dd className="fact__valor">{milestone.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="split__media">
            <div className="figure figure--tall">
              <Image
                src={PAGE_IMAGES.history}
                alt={t("about.history.imageAlt")}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container">
          <div className="section-head section-head--center">
            <div>
              <p className="eyebrow eyebrow--green">
                {t("about.purpose.eyebrow")}
              </p>
              <h2 className="title-md section-head__title">
                {t("about.purpose.title")}
              </h2>
            </div>
          </div>

          <ul className="card-grid card-grid--3">
            <li className="card card--cream">
              <div className="icon-badge">
                <IconTarget size={26} />
              </div>
              <h3 className="title-sm" style={{ marginTop: 18 }}>
                {t("about.purpose.missionTitle")}
              </h3>
              <p className="prose" style={{ marginTop: 10 }}>
                {t("about.purpose.missionText")}
              </p>
              <p className="card__fuente">{t("about.purpose.missionSource")}</p>
            </li>

            <li className="card card--cream" data-seccion="tropa">
              <div className="icon-badge">
                <IconEye size={26} />
              </div>
              <h3 className="title-sm" style={{ marginTop: 18 }}>
                {t("about.purpose.visionTitle")}
              </h3>
              <p className="prose" style={{ marginTop: 10 }}>
                {t("about.purpose.visionText")}
              </p>
            </li>

            <li className="card card--cream" data-seccion="manada">
              <div className="icon-badge">
                <IconStar size={26} />
              </div>
              <h3 className="title-sm" style={{ marginTop: 18 }}>
                {t("about.purpose.valuesTitle")}
              </h3>
              <ul className="chip-row">
                {values.map((value) => (
                  <li className="chip" key={value}>
                    {value}
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container split split--top">
          <div>
            <p className="eyebrow eyebrow--amber">
              {t("about.commitment.promiseEyebrow")}
            </p>
            <h2 className="title-md section-head__title">
              {t("about.commitment.promiseTitle")}
            </h2>
            <p className="lead" style={{ marginTop: 16 }}>
              {t("about.commitment.promiseLead")}
            </p>
            <blockquote className="promesa">
              <p>&laquo;{t("content.promise")}&raquo;</p>
            </blockquote>
          </div>

          <div>
            <p className="eyebrow eyebrow--amber">
              {t("about.commitment.lawEyebrow")}
            </p>
            <h2 className="title-md section-head__title">
              {t("about.commitment.lawTitle")}
            </h2>
            <ol className="ley-grid">
              {scoutLaw.map((item, index) => (
                <li className="ley-item" key={item}>
                  <span className="ley-item__n">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="ley-item__texto">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">{t("about.team.eyebrow")}</p>
              <h2 className="title-md section-head__title">
                {t("about.team.title")}
              </h2>
              <p className="lead" style={{ marginTop: 12 }}>
                {t("about.team.lead")}
              </p>
            </div>
          </div>

          <ul className="card-grid card-grid--3">
            {team.map((person, index) => (
              <li
                className="card"
                key={person.name}
                data-seccion={TEAM_SECTIONS[index]}
              >
                <p className="avatar" aria-hidden="true">
                  {person.initials}
                </p>
                <h3 className="team-card__nombre">{person.name}</h3>
                <p className="team-card__rol">{person.role}</p>
                <p className="team-card__detalle">{person.detail}</p>
              </li>
            ))}
          </ul>

          <PendingNote text={t("about.team.rosterNote")} />

          <h3 className="title-sm" style={{ marginTop: 34 }}>
            {t("about.team.structureTitle")}
          </h3>
          <ul className="chip-row">
            {groupAreas.map((area) => (
              <li className="chip" key={area}>
                {area}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container split">
          <div>
            <p className="eyebrow eyebrow--green">{t("about.venue.eyebrow")}</p>
            <h2 className="title-md section-head__title">
              {t("about.venue.title")}
            </h2>
            <p className="lead" style={{ marginTop: 12 }}>
              {t("about.venue.lead")}
            </p>

            <ul className="contact-list">
              <li className="contact-item">
                <span className="icon-badge icon-badge--sm">
                  <IconLocation size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("about.venue.addressTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    {t("content.contact.address")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="tropa">
                <span className="icon-badge icon-badge--sm">
                  <IconClock size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("about.venue.meetingsTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    {t("content.contact.meetings")}
                  </p>
                  <p className="card__fuente">
                    {t("content.contact.meetingsNote")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="wak">
                <span className="icon-badge icon-badge--sm">
                  <IconPhone size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("about.venue.phoneTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    <a href={CONTACT.phoneHref}>{t("content.contact.phone")}</a>
                  </p>
                  <p className="card__fuente">
                    {t("content.contact.phoneNote")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="manada">
                <span className="icon-badge icon-badge--sm">
                  <IconMail size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("about.venue.contactTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    <a href={CONTACT.emailHref}>{t("content.contact.email")}</a>
                  </p>
                </div>
              </li>
            </ul>

            <div className="btn-row">
              <Link className="btn" href="/join">
                {t("about.venue.cta")}
              </Link>
            </div>
          </div>

          <div className="split__media">
            <div className="figure">
              <Image
                src={PAGE_IMAGES.venue}
                alt={t("about.venue.imageAlt")}
                fill
                sizes="(max-width: 900px) 100vw, 45vw"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
