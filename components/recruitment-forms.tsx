"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { SECTION_IDS } from "@/lib/content/site";

type FormType = "minor" | "volunteer";
type SubmissionStatus = "idle" | "submitting" | "success" | "error";

async function submitForm(
  event: FormEvent<HTMLFormElement>,
  type: FormType,
  setStatus: (status: SubmissionStatus) => void,
) {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;

  const data = new FormData(form);
  const payload = {
    ...Object.fromEntries(data.entries()),
    type,
    consent: data.has("consent"),
  };

  setStatus("submitting");

  try {
    const response = await fetch("/api/recruitment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Submission failed");

    form.reset();
    setStatus("success");
  } catch {
    setStatus("error");
  }
}

export function InscripcionForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<SubmissionStatus>("idle");

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
        onSubmit={(event) => submitForm(event, "minor", setStatus)}
        aria-busy={status === "submitting"}
        noValidate
      >
        <input
          className="form__honeypot"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
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
                <option key={id} value={id}>
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
          <button
            type="submit"
            className="btn btn--accent"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? t("forms.status.submitting")
              : t("forms.inscription.submit")}
          </button>
        </div>

        <p
          className={`form__status form__status--${status}`}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {status === "success" && t("forms.status.success")}
          {status === "error" && t("forms.status.error")}
        </p>
      </form>

      <p className="card__fuente" style={{ marginTop: 16 }}>
        {t("forms.inscription.privacyNote")}
      </p>
    </div>
  );
}

export function VoluntariadoForm() {
  const t = useTranslations();
  const [status, setStatus] = useState<SubmissionStatus>("idle");

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
        onSubmit={(event) => submitForm(event, "volunteer", setStatus)}
        aria-busy={status === "submitting"}
        noValidate
      >
        <input
          className="form__honeypot"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
        />
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
            <select
              className="field__control"
              id="vol-role"
              name="role"
              required
            >
              <option value="" disabled>
                {t("forms.volunteer.options.default")}
              </option>
              {(
                ["leader", "collab", "band", "notSure"] as const
              ).map((key) => (
                <option key={key} value={key}>
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
          <button
            type="submit"
            className="btn btn--accent"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? t("forms.status.submitting")
              : t("forms.volunteer.submit")}
          </button>
        </div>

        <p
          className={`form__status form__status--${status}`}
          role={status === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {status === "success" && t("forms.status.success")}
          {status === "error" && t("forms.status.error")}
        </p>
      </form>

      <p className="card__fuente" style={{ marginTop: 16 }}>
        {t("forms.volunteer.privacyNote")}
      </p>
    </div>
  );
}
