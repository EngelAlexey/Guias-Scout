"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

type FieldErrors = {
  current?: string;
  next?: string;
  repeat?: string;
};

const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

const KNOWN_ERRORS = [
  "invalid_request",
  "unauthorized",
  "wrong_password",
  "same_password",
  "not_found",
  "storage_error",
  "service_unavailable",
] as const;

function isKnownError(value: unknown): value is (typeof KNOWN_ERRORS)[number] {
  return (
    typeof value === "string" &&
    (KNOWN_ERRORS as readonly string[]).includes(value)
  );
}

export function PortalPasswordForm({ forced }: { forced: boolean }) {
  const t = useTranslations("portal.password");
  const router = useRouter();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {};
    if (current.length < MIN_LENGTH || current.length > MAX_LENGTH) {
      nextErrors.current = t("validation.current");
    }
    if (next.length < MIN_LENGTH || next.length > MAX_LENGTH) {
      nextErrors.next = t("validation.next");
    }
    if (next !== repeat) {
      nextErrors.repeat = t("validation.repeat");
    }

    setErrors(nextErrors);
    if (nextErrors.current || nextErrors.next || nextErrors.repeat) return;

    setSaving(true);
    setStatus("");

    try {
      const response = await fetch("/api/portal/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });

      const payload: unknown = await response.json().catch(() => null);
      const error =
        typeof payload === "object" && payload !== null
          ? (payload as Record<string, unknown>).error
          : undefined;

      if (!response.ok) {
        setStatus(isKnownError(error) ? t(`errors.${error}`) : t("errors.unexpected"));
        return;
      }

      setCurrent("");
      setNext("");
      setRepeat("");
      router.replace("/portal");
      router.refresh();
    } catch {
      setStatus(t("errors.network"));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="form" onSubmit={onSubmit} aria-busy={saving} noValidate>
      <div className="field">
        <label className="field__label" htmlFor="portal-clave-actual">
          {forced ? t("fields.temporary") : t("fields.current")}
        </label>
        <input
          className="field__control"
          id="portal-clave-actual"
          name="currentPassword"
          type="password"
          value={current}
          onChange={(event) => setCurrent(event.target.value)}
          autoComplete="current-password"
          maxLength={MAX_LENGTH}
          aria-invalid={errors.current ? true : undefined}
          aria-describedby={errors.current ? "portal-clave-actual-error" : undefined}
        />
        {errors.current ? (
          <p className="field__error" id="portal-clave-actual-error">
            {errors.current}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="portal-clave-nueva">
          {t("fields.next")}
        </label>
        <input
          className="field__control"
          id="portal-clave-nueva"
          name="newPassword"
          type="password"
          value={next}
          onChange={(event) => setNext(event.target.value)}
          autoComplete="new-password"
          minLength={MIN_LENGTH}
          maxLength={MAX_LENGTH}
          aria-invalid={errors.next ? true : undefined}
          aria-describedby="portal-clave-nueva-ayuda"
        />
        <p className="form__note" id="portal-clave-nueva-ayuda">
          {t("hint")}
        </p>
        {errors.next ? (
          <p className="field__error" id="portal-clave-nueva-error">
            {errors.next}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="field__label" htmlFor="portal-clave-repetir">
          {t("fields.repeat")}
        </label>
        <input
          className="field__control"
          id="portal-clave-repetir"
          name="repeatPassword"
          type="password"
          value={repeat}
          onChange={(event) => setRepeat(event.target.value)}
          autoComplete="new-password"
          maxLength={MAX_LENGTH}
          aria-invalid={errors.repeat ? true : undefined}
          aria-describedby={errors.repeat ? "portal-clave-repetir-error" : undefined}
        />
        {errors.repeat ? (
          <p className="field__error" id="portal-clave-repetir-error">
            {errors.repeat}
          </p>
        ) : null}
      </div>

      <div className="form__actions">
        <button className="btn" type="submit" disabled={saving}>
          {saving ? t("submitting") : t("submit")}
        </button>
      </div>

      <p className="form__status form__status--error" role="alert">
        {status}
      </p>
    </form>
  );
}
