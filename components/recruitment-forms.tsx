"use client";

import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/content/site";

type Props = { recipient: string };

type BodyEntry = [key: string, value: string | undefined];

function openMailto(recipient: string, subject: string, body: string) {
  const href = `mailto:${recipient}?subject=${encodeURIComponent(
    subject,
  )}&body=${encodeURIComponent(body)}`;
  window.location.href = href;
}

function buildBody(
  greeting: string,
  entries: BodyEntry[],
  label: (key: string) => string,
) {
  const lines = entries
    .filter(([, value]) => value !== undefined && value.trim() !== "")
    .map(([key, value]) => `${label(key)}: ${value}`);
  return [greeting, ...lines].join("\r\n");
}

function submitInscription(
  event: FormEvent<HTMLFormElement>,
  recipient: string,
  t: ReturnType<typeof useTranslations>,
) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();

  const body = buildBody(
    t("forms.mail.greeting"),
    [
      ["minorName", value("minorName")],
      ["birthDate", value("birthDate")],
      ["guardian", value("guardian")],
      ["phone", value("phone")],
      ["email", value("email")],
      ["section", value("section")],
      ["message", value("message")],
      ["consent", "Sí"],
    ],
    (key) => t(`forms.mail.labels.${key}`),
  );

  openMailto(recipient, t("forms.mail.subjectInscription"), body);
}

function submitVolunteer(
  event: FormEvent<HTMLFormElement>,
  recipient: string,
  t: ReturnType<typeof useTranslations>,
) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();

  const body = buildBody(
    t("forms.mail.greeting"),
    [
      ["name", value("name")],
      ["phone", value("phone")],
      ["email", value("email")],
      ["role", value("role")],
      ["why", value("why")],
      ["consent", "Sí"],
    ],
    (key) => t(`forms.mail.labels.${key}`),
  );

  openMailto(recipient, t("forms.mail.subjectVolunteer"), body);
}

export function InscripcionForm({ recipient }: Props) {
  const t = useTranslations();

  return (
    <div className="card">
      <p className="eyebrow eyebrow--green">{t("forms.inscription.eyebrow")}</p>
      <h3 className="title-sm" style={{ marginTop: 8 }}>
        {t("forms.inscription.title")}
      </h3>
      <p className="prose" style={{ marginTop: 8 }}>
        {t("forms.inscription.lead")}
      </p>

      <form
        className="form"
        onSubmit={(event) => submitInscription(event, recipient, t)}
        noValidate
      >
        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="insc-minor">
              {t("forms.inscription.fields.minorName")}
            </label>
            <input
              className="field__control"
              id="insc-minor"
              name="minorName"
              type="text"
              required
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="insc-birth">
              {t("forms.inscription.fields.birthDate")}
            </label>
            <input
              className="field__control"
              id="insc-birth"
              name="birthDate"
              type="date"
              required
            />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="insc-guardian">
              {t("forms.inscription.fields.guardian")}
            </label>
            <input
              className="field__control"
              id="insc-guardian"
              name="guardian"
              type="text"
              required
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="insc-phone">
              {t("forms.inscription.fields.phone")}
            </label>
            <input
              className="field__control"
              id="insc-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="insc-email">
              {t("forms.inscription.fields.email")}
            </label>
            <input
              className="field__control"
              id="insc-email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="insc-section">
              {t("forms.inscription.fields.section")}
            </label>
            <select className="field__control" id="insc-section" name="section">
              <option value="">{t("forms.inscription.options.notSure")}</option>
              {SECTION_IDS.map((id) => (
                <option key={id} value={t(`content.sections.${id}.name`)}>
                  {t(`content.sections.${id}.name`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="insc-message">
            {t("forms.inscription.fields.message")}
          </label>
          <textarea
            className="field__control"
            id="insc-message"
            name="message"
            rows={3}
          />
        </div>

        <label className="checkbox-row">
          <input type="checkbox" name="consent" required />
          <span>{t("forms.inscription.consent")}</span>
        </label>

        <div className="form__actions">
          <button type="submit" className="btn btn--accent">
            {t("forms.inscription.submit")}
          </button>
        </div>
      </form>

      <p className="card__fuente" style={{ marginTop: 16 }}>
        {t("forms.inscription.privacyNote")}
      </p>
    </div>
  );
}

export function VoluntariadoForm({ recipient }: Props) {
  const t = useTranslations();

  return (
    <div className="card">
      <p className="eyebrow eyebrow--green">{t("forms.volunteer.eyebrow")}</p>
      <h3 className="title-sm" style={{ marginTop: 8 }}>
        {t("forms.volunteer.title")}
      </h3>
      <p className="prose" style={{ marginTop: 8 }}>
        {t("forms.volunteer.lead")}
      </p>

      <form
        className="form"
        onSubmit={(event) => submitVolunteer(event, recipient, t)}
        noValidate
      >
        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="vol-name">
              {t("forms.volunteer.fields.name")}
            </label>
            <input
              className="field__control"
              id="vol-name"
              name="name"
              type="text"
              required
              autoComplete="name"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="vol-phone">
              {t("forms.volunteer.fields.phone")}
            </label>
            <input
              className="field__control"
              id="vol-phone"
              name="phone"
              type="tel"
              inputMode="tel"
              required
              autoComplete="tel"
            />
          </div>
        </div>

        <div className="form__row">
          <div className="field">
            <label className="field__label" htmlFor="vol-email">
              {t("forms.volunteer.fields.email")}
            </label>
            <input
              className="field__control"
              id="vol-email"
              name="email"
              type="email"
              autoComplete="email"
            />
          </div>
          <div className="field">
            <label className="field__label" htmlFor="vol-role">
              {t("forms.volunteer.fields.role")}
            </label>
            <select className="field__control" id="vol-role" name="role">
              <option value="" disabled>
                {t("forms.volunteer.options.default")}
              </option>
              {(
                ["leader", "collab", "band", "notSure"] as const
              ).map((key) => (
                <option key={key} value={t(`forms.volunteer.options.${key}`)}>
                  {t(`forms.volunteer.options.${key}`)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label className="field__label" htmlFor="vol-why">
            {t("forms.volunteer.fields.why")}
          </label>
          <textarea
            className="field__control"
            id="vol-why"
            name="why"
            rows={4}
            required
          />
        </div>

        <label className="checkbox-row">
          <input type="checkbox" name="consent" required />
          <span>{t("forms.volunteer.consent")}</span>
        </label>

        <p className="form__note">{t("forms.volunteer.juntaNote")}</p>

        <div className="form__actions">
          <button type="submit" className="btn btn--accent">
            {t("forms.volunteer.submit")}
          </button>
        </div>
      </form>

      <p className="card__fuente" style={{ marginTop: 16 }}>
        {t("forms.volunteer.privacyNote")}
      </p>
    </div>
  );
}
