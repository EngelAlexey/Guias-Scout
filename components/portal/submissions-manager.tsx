"use client";

import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  SUBMISSION_STATUSES,
  SUBMISSION_TYPES,
  isSubmissionStatus,
  isSubmissionType,
  type PortalSubmission,
  type SubmissionStatus,
  type SubmissionType,
} from "@/lib/portal/submissions";

type TypeFilter = SubmissionType | "all";
type StatusFilter = SubmissionStatus | "all";

type Feedback = { tone: "success" | "error"; text: string } | null;

type ApiPayload = {
  ok?: boolean;
  error?: unknown;
  items?: unknown;
  truncated?: unknown;
};

const KNOWN_ERRORS = [
  "invalid_request",
  "unauthorized",
  "not_found",
  "storage_error",
  "service_unavailable",
] as const;

const SECTION_IDS = ["manada", "tropa", "wak", "comunidad"] as const;
const VOLUNTEER_ROLES = ["leader", "collab", "band", "notSure"] as const;

function isKnownError(value: unknown): value is (typeof KNOWN_ERRORS)[number] {
  return (
    typeof value === "string" &&
    (KNOWN_ERRORS as readonly string[]).includes(value)
  );
}

function isSubmission(value: unknown): value is PortalSubmission {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    typeof row.phone === "string" &&
    typeof row.createdAt === "string" &&
    isSubmissionType(row.type) &&
    isSubmissionStatus(row.status)
  );
}

async function readPayload(response: Response): Promise<ApiPayload> {
  try {
    const data: unknown = await response.json();
    return typeof data === "object" && data !== null ? (data as ApiPayload) : {};
  } catch {
    return {};
  }
}

function isSectionId(value: string): value is (typeof SECTION_IDS)[number] {
  return (SECTION_IDS as readonly string[]).includes(value);
}

function isVolunteerRole(
  value: string,
): value is (typeof VOLUNTEER_ROLES)[number] {
  return (VOLUNTEER_ROLES as readonly string[]).includes(value);
}

export function PortalSubmissionsManager() {
  const t = useTranslations("portal.submissions");
  const tStatuses = useTranslations("portal.statuses");
  // Las secciones y los tipos de colaboración ya están traducidos para el
  // sitio público; se leen desde la raíz para no duplicar esos textos.
  const tRoot = useTranslations();
  const locale = useLocale();

  const [items, setItems] = useState<PortalSubmission[]>([]);
  const [truncated, setTruncated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [openId, setOpenId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  // La lista lleva muchas columnas: la fecha corta evita que la celda se parta
  // en varias líneas. El detalle sí usa el formato largo.
  const dateTimeFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }),
    [locale],
  );

  const longDateTimeFormat = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: "medium",
        timeStyle: "short",
      }),
    [locale],
  );

  const dateFormat = useMemo(
    () => new Intl.DateTimeFormat(locale, { dateStyle: "medium" }),
    [locale],
  );

  const messageFor = useCallback(
    (error: unknown) =>
      isKnownError(error) ? t(`errors.${error}`) : t("errors.unexpected"),
    [t],
  );

  const load = useCallback(
    async (signal?: AbortSignal) => {
      setLoading(true);
      setLoadError("");

      const params = new URLSearchParams({
        type: typeFilter,
        status: statusFilter,
      });

      try {
        const response = await fetch(`/api/portal/submissions?${params}`, {
          headers: { Accept: "application/json" },
          signal,
        });
        const payload = await readPayload(response);

        if (
          !response.ok ||
          payload.ok !== true ||
          !Array.isArray(payload.items)
        ) {
          setItems([]);
          setTruncated(false);
          setLoadError(messageFor(payload.error));
          return;
        }

        setItems(payload.items.filter(isSubmission));
        setTruncated(payload.truncated === true);
      } catch {
        // Si la consulta se anuló es porque ya hay otra en camino con los
        // filtros nuevos: su respuesta manda y esta no debe tocar el estado.
        if (signal?.aborted) return;
        setItems([]);
        setTruncated(false);
        setLoadError(t("errors.network"));
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [messageFor, statusFilter, t, typeFilter],
  );

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);
    return () => controller.abort();
  }, [load]);

  function formatDateTime(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? value : dateTimeFormat.format(date);
  }

  function formatLongDateTime(value: string) {
    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? value
      : longDateTimeFormat.format(date);
  }

  function formatDate(value: string) {
    // La fecha de nacimiento llega sin hora. Se ancla al dia local para que no
    // se corra un dia al formatearla.
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? value : dateFormat.format(date);
  }

  function interestOf(item: PortalSubmission) {
    if (item.type === "minor") {
      if (!item.sectionInterest) return t("detail.unspecified");
      return isSectionId(item.sectionInterest)
        ? tRoot(`content.sections.${item.sectionInterest}.name`)
        : item.sectionInterest;
    }

    if (!item.roleInterest) return t("detail.unspecified");
    return isVolunteerRole(item.roleInterest)
      ? tRoot(`forms.volunteer.options.${item.roleInterest}`)
      : item.roleInterest;
  }

  async function changeStatus(
    item: PortalSubmission,
    status: SubmissionStatus,
  ) {
    if (status === item.status) return;

    setBusyId(item.id);
    setFeedback(null);

    try {
      const response = await fetch("/api/portal/submissions", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, type: item.type, status }),
      });
      const payload = await readPayload(response);

      if (!response.ok || payload.ok !== true) {
        setFeedback({ tone: "error", text: messageFor(payload.error) });
        return;
      }

      setFeedback({
        tone: "success",
        text: t("feedback.updated", {
          name: item.name,
          status: tStatuses(status),
        }),
      });
      await load();
    } catch {
      setFeedback({ tone: "error", text: t("errors.network") });
    } finally {
      setBusyId(null);
    }
  }

  const withoutFilters = typeFilter === "all" && statusFilter === "all";

  return (
    <div className="portal-solicitudes">
      <section aria-labelledby="portal-solicitudes-filtros">
        <h2 className="title-xs" id="portal-solicitudes-filtros">
          {t("filters.title")}
        </h2>

        <div className="portal-solicitudes__filtros">
          <div className="field">
            <label className="field__label" htmlFor="portal-solicitudes-tipo">
              {t("filters.type")}
            </label>
            <select
              className="field__control"
              id="portal-solicitudes-tipo"
              value={typeFilter}
              onChange={(event) =>
                setTypeFilter(event.target.value as TypeFilter)
              }
            >
              <option value="all">{t("filters.all")}</option>
              {SUBMISSION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {t(`types.${type}`)}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="field__label" htmlFor="portal-solicitudes-estado">
              {t("filters.status")}
            </label>
            <select
              className="field__control"
              id="portal-solicitudes-estado"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value as StatusFilter)
              }
            >
              <option value="all">{t("filters.all")}</option>
              {SUBMISSION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {tStatuses(status)}
                </option>
              ))}
            </select>
          </div>

          <button
            className="btn btn--ghost btn--sm"
            type="button"
            onClick={() => void load()}
            disabled={loading}
          >
            {loading ? t("filters.refreshing") : t("filters.refresh")}
          </button>
        </div>
      </section>

      <p
        className={
          feedback?.tone === "error"
            ? "form__status form__status--error"
            : "form__status form__status--success"
        }
        role="status"
        aria-live="polite"
      >
        {feedback?.text ?? ""}
      </p>

      <section aria-labelledby="portal-solicitudes-lista">
        <h2 className="title-xs" id="portal-solicitudes-lista">
          {t("list.title")}
        </h2>

        {loading ? (
          <p className="portal-usuarios__cargando">{t("list.loading")}</p>
        ) : null}

        {!loading && loadError ? (
          <div className="portal-usuarios__error" role="alert">
            <p>{loadError}</p>
            <button
              className="btn btn--ghost btn--sm"
              type="button"
              onClick={() => void load()}
            >
              {t("list.retry")}
            </button>
          </div>
        ) : null}

        {!loading && !loadError && items.length === 0 ? (
          <p className="portal-usuarios__vacio">
            {withoutFilters ? t("list.empty") : t("list.emptyFiltered")}
          </p>
        ) : null}

        {!loading && !loadError && items.length > 0 ? (
          <>
            <p className="form__note">
              {t("filters.showing", { count: items.length })}
            </p>

            {truncated ? (
              <p className="portal-solicitudes__aviso" role="status">
                {t("filters.truncated")}
              </p>
            ) : null}

            <div className="tabla-wrap">
              <table className="tabla-portal">
                <caption className="visually-hidden">
                  {t("list.caption")}
                </caption>
                <thead>
                  <tr>
                    <th scope="col">{t("fields.received")}</th>
                    <th scope="col">{t("fields.type")}</th>
                    <th scope="col">{t("fields.person")}</th>
                    <th scope="col">{t("fields.contact")}</th>
                    <th scope="col">{t("fields.interest")}</th>
                    <th scope="col">{t("fields.status")}</th>
                    <th scope="col">{t("fields.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const open = openId === item.id;
                    const busy = busyId === item.id;
                    const detailId = `portal-solicitud-${item.type}-${item.id}`;

                    return (
                      <Fragment key={`${item.type}-${item.id}`}>
                        <tr>
                          <td data-label={t("fields.received")}>
                            {formatDateTime(item.createdAt)}
                          </td>

                          <td data-label={t("fields.type")}>
                            <span
                              className={`portal-tipo portal-tipo--${item.type}`}
                            >
                              {t(`types.${item.type}`)}
                            </span>
                          </td>

                          <td data-label={t("fields.person")}>
                            <span className="tabla-portal__nombre">
                              {item.name}
                            </span>
                            {item.guardianName ? (
                              <span className="tabla-portal__aviso">
                                {t("detail.guardian")}: {item.guardianName}
                              </span>
                            ) : null}
                          </td>

                          <td data-label={t("fields.contact")}>
                            <a
                              className="portal-solicitudes__contacto"
                              href={`tel:${item.phone.replace(/\s+/g, "")}`}
                            >
                              {item.phone}
                            </a>
                            {item.email ? (
                              <a
                                className="portal-solicitudes__contacto"
                                href={`mailto:${item.email}`}
                              >
                                {item.email}
                              </a>
                            ) : null}
                          </td>

                          <td data-label={t("fields.interest")}>
                            {interestOf(item)}
                          </td>

                          <td data-label={t("fields.status")}>
                            <label
                              className="visually-hidden"
                              htmlFor={`${detailId}-estado`}
                            >
                              {t("status.label", { name: item.name })}
                            </label>
                            <select
                              className="field__control field__control--compacto"
                              id={`${detailId}-estado`}
                              value={item.status}
                              disabled={busy}
                              onChange={(event) => {
                                const next = event.target.value;
                                if (isSubmissionStatus(next)) {
                                  void changeStatus(item, next);
                                }
                              }}
                            >
                              {SUBMISSION_STATUSES.map((status) => (
                                <option key={status} value={status}>
                                  {tStatuses(status)}
                                </option>
                              ))}
                            </select>
                            {busy ? (
                              <span className="tabla-portal__aviso">
                                {t("status.saving")}
                              </span>
                            ) : null}
                          </td>

                          <td data-label={t("fields.actions")}>
                            <button
                              aria-controls={detailId}
                              aria-expanded={open}
                              className="btn btn--ghost btn--sm portal-solicitudes__ver"
                              type="button"
                              onClick={() => setOpenId(open ? null : item.id)}
                            >
                              {open ? t("detail.hide") : t("detail.show")}
                            </button>
                          </td>
                        </tr>

                        {open ? (
                          <tr className="portal-solicitudes__fila-detalle">
                            <td colSpan={7}>
                              <div
                                className="portal-solicitudes__detalle"
                                id={detailId}
                              >
                                <h3 className="portal-solicitudes__detalle-titulo">
                                  {t("detail.title", { name: item.name })}
                                </h3>

                                <dl className="portal-solicitudes__datos">
                                  {item.guardianName ? (
                                    <div>
                                      <dt>{t("detail.guardian")}</dt>
                                      <dd>{item.guardianName}</dd>
                                    </div>
                                  ) : null}

                                  {item.birthDate ? (
                                    <div>
                                      <dt>{t("detail.birthDate")}</dt>
                                      <dd>{formatDate(item.birthDate)}</dd>
                                    </div>
                                  ) : null}

                                  <div>
                                    <dt>{t("detail.phone")}</dt>
                                    <dd>{item.phone}</dd>
                                  </div>

                                  <div>
                                    <dt>{t("detail.email")}</dt>
                                    <dd>
                                      {item.email ?? t("detail.unspecified")}
                                    </dd>
                                  </div>

                                  <div>
                                    <dt>
                                      {item.type === "minor"
                                        ? t("detail.section")
                                        : t("detail.role")}
                                    </dt>
                                    <dd>{interestOf(item)}</dd>
                                  </div>

                                  <div>
                                    <dt>{t("detail.updated")}</dt>
                                    <dd>
                                      {formatLongDateTime(item.updatedAt)}
                                    </dd>
                                  </div>
                                </dl>

                                <p className="portal-solicitudes__mensaje-etiqueta">
                                  {t("detail.message")}
                                </p>
                                <p className="portal-solicitudes__mensaje">
                                  {item.message?.trim()
                                    ? item.message
                                    : t("detail.emptyMessage")}
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : null}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </section>

      <section aria-labelledby="portal-solicitudes-leyenda">
        <h2 className="title-xs" id="portal-solicitudes-leyenda">
          {t("status.legend")}
        </h2>
        <dl className="portal-solicitudes__leyenda">
          {SUBMISSION_STATUSES.map((status) => (
            <div key={status}>
              <dt>{tStatuses(status)}</dt>
              <dd>{tStatuses(`help.${status}`)}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
