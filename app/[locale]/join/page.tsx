import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  IconClock,
  IconLocation,
  IconMail,
  IconPhone,
} from "@/components/icons";
import { PendingNote, PendingValue } from "@/components/pending";
import {
  InscripcionForm,
  VoluntariadoForm,
} from "@/components/recruitment-forms";
import { Link } from "@/i18n/navigation";
import { CONTACT, FORM_RECIPIENT, PAGE_IMAGES, SECTION_IDS } from "@/lib/content/site";

type JoinFact = { label: string; value: string };

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "join" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function JoinPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const steps = t.raw("join.steps.items") as {
    title: string;
    detail: string;
  }[];
  const checklist = t.raw("join.contact.checklist") as string[];
  const facts = t.raw("join.facts") as JoinFact[];

  return (
    <>
      <section className="page-hero">
        <div className="container page-hero__inner">
          <div className="page-hero__texto">
            <p className="breadcrumb">
              <Link href="/">{t("nav.home")}</Link>{" "}
              {t("layout.breadcrumbSeparator")} {t("nav.join")}
            </p>
            <p className="eyebrow page-hero__eyebrow">
              {t("join.hero.eyebrow")}
            </p>
            <h1 className="title-xl page-hero__title">
              {t("join.hero.title")}
            </h1>
            <p className="lead" style={{ marginTop: 18 }}>
              {t("join.hero.lead")}
            </p>
          </div>

          <div className="page-hero__media">
            <Image
              src={PAGE_IMAGES.joinHero}
              alt={t("join.hero.imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 40vw"
              priority
            />
          </div>
        </div>
      </section>

      <section className="section section--cream">
        <div className="container">
          <p className="eyebrow">{t("join.steps.eyebrow")}</p>
          <h2 className="title-md section-head__title">
            {t("join.steps.title")}
          </h2>

          <ol className="card-grid card-grid--3">
            {steps.map((step, index) => (
              <li className="card" key={step.title}>
                <p className="metric__valor">{index + 1}</p>
                <h3 className="title-sm" style={{ marginTop: 8 }}>
                  {step.title}
                </h3>
                <p className="prose" style={{ marginTop: 8 }}>
                  {step.detail}
                </p>
              </li>
            ))}
          </ol>

          <h3 className="title-sm" style={{ marginTop: 34 }}>
            {t("join.steps.factsTitle")}
          </h3>
          <dl className="fact-grid">
            {facts.map((fact) => (
              <div className="fact" key={fact.label}>
                <dt className="fact__titulo">{fact.label}</dt>
                <dd className="fact__valor">{fact.value}</dd>
              </div>
            ))}
          </dl>
          <p className="card__fuente">{t("join.factsNote")}</p>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container">
          <p className="eyebrow">{t("join.byAge.eyebrow")}</p>
          <h2 className="title-md section-head__title">
            {t("join.byAge.title")}
          </h2>

          <ul className="card-grid card-grid--4">
            {SECTION_IDS.map((id) => (
              <li className="card card--cream" key={id} data-seccion={id}>
                <p className="tag-seccion">
                  <span className="punto" aria-hidden="true" />
                  {t(`content.sections.${id}.name`)}
                </p>
                <p className="seccion-card__edades" style={{ marginTop: 12 }}>
                  {t(`content.sections.${id}.ages`)}
                </p>
                <p className="seccion-card__resumen">
                  {t(`content.sections.${id}.summary`)}
                </p>
              </li>
            ))}
          </ul>

          <div className="btn-row">
            <Link className="btn btn--ghost" href="/sections">
              {t("join.byAge.cta")}
            </Link>
          </div>
        </div>
      </section>

      <section className="section section--white section--bordered">
        <div className="container">
          <p className="eyebrow">{t("forms.eyebrow")}</p>
          <h2 className="title-md section-head__title">{t("forms.title")}</h2>
          <p className="lead" style={{ marginTop: 12 }}>
            {t("forms.lead")}
          </p>

          {FORM_RECIPIENT ? (
            <div className="split" style={{ marginTop: 28 }}>
              <InscripcionForm recipient={FORM_RECIPIENT} />
              <VoluntariadoForm recipient={FORM_RECIPIENT} />
            </div>
          ) : (
            <div className="card" style={{ marginTop: 28 }}>
              <PendingNote text={t("forms.pendingBlock")} />
            </div>
          )}
        </div>
      </section>

      <section className="section section--cream">
        <div className="container split">
          <div>
            <p className="eyebrow eyebrow--green">
              {t("join.contact.eyebrow")}
            </p>
            <h2 className="title-md section-head__title">
              {t("join.contact.title")}
            </h2>
            <p className="lead" style={{ marginTop: 12 }}>
              {t("join.contact.lead")}
            </p>

            <ul className="contact-list">
              <li className="contact-item">
                <span className="icon-badge icon-badge--sm">
                  <IconPhone size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("join.contact.phoneTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    <a href={CONTACT.phoneHref}>{t("content.contact.phone")}</a>
                  </p>
                  <p className="card__fuente">
                    {t("content.contact.phoneNote")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="tropa">
                <span className="icon-badge icon-badge--sm">
                  <IconClock size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("join.contact.meetingsTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    {t("content.contact.meetings")}
                  </p>
                  <p className="card__fuente">
                    {t("content.contact.meetingsNote")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="manada">
                <span className="icon-badge icon-badge--sm">
                  <IconLocation size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("join.contact.venueTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    {t("content.contact.address")}
                  </p>
                </div>
              </li>
              <li className="contact-item" data-seccion="wak">
                <span className="icon-badge icon-badge--sm">
                  <IconMail size={22} />
                </span>
                <div>
                  <h3 className="contact-item__titulo">
                    {t("join.contact.emailTitle")}
                  </h3>
                  <p className="contact-item__texto">
                    <PendingValue />
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="title-sm">{t("join.contact.checklistTitle")}</h3>
            <ul className="chip-row">
              {checklist.map((item) => (
                <li className="chip" key={item}>
                  {item}
                </li>
              ))}
            </ul>
            <p className="prose" style={{ marginTop: 18 }}>
              {t("join.contact.checklistNote")}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
