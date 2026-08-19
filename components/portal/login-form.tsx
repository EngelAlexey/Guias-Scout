"use client";

import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/i18n/navigation";

type Status = "idle" | "submitting" | "invalid" | "unauthorized" | "error";

export function PortalLoginForm() {
  const t = useTranslations("portal.login");
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;

    const data = new FormData(form);
    setStatus("submitting");

    try {
      const response = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });

      if (response.ok) {
        router.replace("/portal");
        router.refresh();
        return;
      }

      if (response.status === 401) setStatus("unauthorized");
      else if (response.status === 400) setStatus("invalid");
      else setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  const message =
    status === "unauthorized" || status === "invalid" || status === "error"
      ? t(`errors.${status}`)
      : "";

  return (
    <form
      className="form"
      onSubmit={onSubmit}
      aria-busy={status === "submitting"}
      noValidate
    >
      <div className="field">
        <label className="field__label" htmlFor="portal-email">
          {t("fields.email")}
        </label>
        <input
          className="field__control"
          id="portal-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
        />
      </div>

      <div className="field">
        <label className="field__label" htmlFor="portal-password">
          {t("fields.password")}
        </label>
        <input
          className="field__control"
          id="portal-password"
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="current-password"
        />
      </div>

      <div className="form__actions">
        <button
          className="btn"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? t("submitting") : t("submit")}
        </button>
      </div>

      <p className="form__status form__status--error" role="alert">
        {message}
      </p>
    </form>
  );
}
