"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";

type PortalUser = {
  id: string;
  fullName: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

type Feedback = { tone: "success" | "error"; text: string } | null;

type FieldErrors = { name?: string; email?: string };

type ApiPayload = {
  ok?: boolean;
  error?: unknown;
  items?: unknown;
  id?: unknown;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const KNOWN_ERRORS = [
  "invalid_request",
  "unauthorized",
  "email_taken",
  "self_deactivation",
  "not_found",
  "storage_error",
  "service_unavailable",
] as const;

const EDIT_FORM_ID = "portal-usuarios-editar";

function isKnownError(value: unknown): value is (typeof KNOWN_ERRORS)[number] {
  return (
    typeof value === "string" &&
    (KNOWN_ERRORS as readonly string[]).includes(value)
  );
}

function isPortalUser(value: unknown): value is PortalUser {
  if (typeof value !== "object" || value === null) return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.id === "string" &&
    typeof row.fullName === "string" &&
    typeof row.email === "string" &&
    typeof row.isActive === "boolean"
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

export function PortalUsersManager({
  sessionUserId,
}: {
  sessionUserId: string;
}) {
  const t = useTranslations("portal.users");

  const [users, setUsers] = useState<PortalUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [feedback, setFeedback] = useState<Feedback>(null);

  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createErrors, setCreateErrors] = useState<FieldErrors>({});
  const [creating, setCreating] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editErrors, setEditErrors] = useState<FieldErrors>({});

  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const messageFor = useCallback(
    (error: unknown) =>
      isKnownError(error) ? t(`errors.${error}`) : t("errors.unexpected"),
    [t],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const response = await fetch("/api/portal/users", {
        headers: { Accept: "application/json" },
      });
      const payload = await readPayload(response);

      if (!response.ok || payload.ok !== true || !Array.isArray(payload.items)) {
        setUsers([]);
        setLoadError(messageFor(payload.error));
        return;
      }

      setUsers(payload.items.filter(isPortalUser));
    } catch {
      setUsers([]);
      setLoadError(t("errors.network"));
    } finally {
      setLoading(false);
    }
  }, [messageFor, t]);

  useEffect(() => {
    void load();
  }, [load]);

  const validate = useCallback(
    (name: string, email: string) => {
      const fullName = name.trim().replace(/\s+/g, " ");
      const normalizedEmail = email.trim().toLowerCase();
      const errors: FieldErrors = {};

      if (fullName.length < 1 || fullName.length > 160) {
        errors.name = t("validation.name");
      }

      if (normalizedEmail.length > 254 || !EMAIL_PATTERN.test(normalizedEmail)) {
        errors.email = t("validation.email");
      }

      return { errors, fullName, email: normalizedEmail };
    },
    [t],
  );

  async function onCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const { errors, fullName, email } = validate(createName, createEmail);
    setCreateErrors(errors);
    if (errors.name || errors.email) return;

    setCreating(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/portal/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email }),
      });
      const payload = await readPayload(response);

      if (!response.ok || payload.ok !== true) {
        setFeedback({ tone: "error", text: messageFor(payload.error) });
        return;
      }

      setCreateName("");
      setCreateEmail("");
      setCreateErrors({});
      setFeedback({
        tone: "success",
        text: t("feedback.created", { name: fullName }),
      });
      await load();
    } catch {
      setFeedback({ tone: "error", text: t("errors.network") });
    } finally {
      setCreating(false);
    }
  }

  async function patchUser(id: string, changes: Record<string, unknown>) {
    setBusyId(id);
    setFeedback(null);

    try {
      const response = await fetch("/api/portal/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...changes }),
      });
      const payload = await readPayload(response);

      if (!response.ok || payload.ok !== true) {
        setFeedback({ tone: "error", text: messageFor(payload.error) });
        return false;
      }

      await load();
      return true;
    } catch {
      setFeedback({ tone: "error", text: t("errors.network") });
      return false;
    } finally {
      setBusyId(null);
    }
  }

  function startEdit(user: PortalUser) {
    setConfirmingId(null);
    setEditingId(user.id);
    setEditName(user.fullName);
    setEditEmail(user.email);
    setEditErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setEditErrors({});
  }

  async function onSaveEdit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editingId) return;

    const { errors, fullName, email } = validate(editName, editEmail);
    setEditErrors(errors);
    if (errors.name || errors.email) return;

    const saved = await patchUser(editingId, { fullName, email });
    if (saved) {
      setEditingId(null);
      setFeedback({
        tone: "success",
        text: t("feedback.updated", { name: fullName }),
      });
    }
  }

  async function onToggleActive(user: PortalUser, isActive: boolean) {
    const done = await patchUser(user.id, { isActive });
    if (!done) return;

    setConfirmingId(null);
    setFeedback({
      tone: "success",
      text: isActive
        ? t("feedback.activated", { name: user.fullName })
        : t("feedback.deactivated", { name: user.fullName }),
    });
  }

  return (
    <div className="portal-usuarios">
      <section aria-labelledby="portal-usuarios-agregar">
        <h2 className="title-xs" id="portal-usuarios-agregar">
          {t("add.title")}
        </h2>
        <p className="form__note">{t("add.note")}</p>

        <form
          className="form"
          onSubmit={onCreate}
          aria-busy={creating}
          noValidate
        >
          <div className="form__row">
            <div className="field">
              <label className="field__label" htmlFor="portal-usuario-nombre">
                {t("fields.name")}
              </label>
              <input
                className="field__control"
                id="portal-usuario-nombre"
                name="fullName"
                type="text"
                value={createName}
                onChange={(event) => setCreateName(event.target.value)}
                maxLength={160}
                autoComplete="off"
                aria-invalid={createErrors.name ? true : undefined}
                aria-describedby={
                  createErrors.name ? "portal-usuario-nombre-error" : undefined
                }
              />
              {createErrors.name ? (
                <p className="field__error" id="portal-usuario-nombre-error">
                  {createErrors.name}
                </p>
              ) : null}
            </div>

            <div className="field">
              <label className="field__label" htmlFor="portal-usuario-correo">
                {t("fields.email")}
              </label>
              <input
                className="field__control"
                id="portal-usuario-correo"
                name="email"
                type="email"
                value={createEmail}
                onChange={(event) => setCreateEmail(event.target.value)}
                maxLength={254}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                aria-invalid={createErrors.email ? true : undefined}
                aria-describedby={
                  createErrors.email ? "portal-usuario-correo-error" : undefined
                }
              />
              {createErrors.email ? (
                <p className="field__error" id="portal-usuario-correo-error">
                  {createErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="form__actions">
            <button className="btn" type="submit" disabled={creating}>
              {creating ? t("add.submitting") : t("add.submit")}
            </button>
          </div>
        </form>
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

      <section aria-labelledby="portal-usuarios-lista">
        <h2 className="title-xs" id="portal-usuarios-lista">
          {t("list.title")}
        </h2>
        <p className="form__note">{t("list.note")}</p>

        {loading ? <p className="portal-usuarios__cargando">{t("list.loading")}</p> : null}

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

        {!loading && !loadError && users.length === 0 ? (
          <p className="portal-usuarios__vacio">{t("list.empty")}</p>
        ) : null}

        {!loading && !loadError && users.length > 0 ? (
          <>
            <div className="tabla-wrap">
              <table className="tabla-portal">
                <caption className="visually-hidden">{t("list.caption")}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t("fields.name")}</th>
                    <th scope="col">{t("fields.email")}</th>
                    <th scope="col">{t("fields.status")}</th>
                    <th scope="col">{t("fields.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const editing = editingId === user.id;
                    const confirming = confirmingId === user.id;
                    const busy = busyId === user.id;
                    const isSelf = user.id === sessionUserId;

                    return (
                      <tr
                        key={user.id}
                        data-inactiva={user.isActive ? undefined : "true"}
                      >
                        <td data-label={t("fields.name")}>
                          {editing ? (
                            <>
                              <label
                                className="visually-hidden"
                                htmlFor="portal-editar-nombre"
                              >
                                {t("edit.nameLabel")}
                              </label>
                              <input
                                className="field__control"
                                form={EDIT_FORM_ID}
                                id="portal-editar-nombre"
                                name="fullName"
                                type="text"
                                value={editName}
                                onChange={(event) =>
                                  setEditName(event.target.value)
                                }
                                maxLength={160}
                                autoComplete="off"
                                aria-invalid={editErrors.name ? true : undefined}
                                aria-describedby={
                                  editErrors.name
                                    ? "portal-editar-nombre-error"
                                    : undefined
                                }
                              />
                              {editErrors.name ? (
                                <p
                                  className="field__error"
                                  id="portal-editar-nombre-error"
                                >
                                  {editErrors.name}
                                </p>
                              ) : null}
                            </>
                          ) : (
                            <span className="tabla-portal__nombre">
                              {user.fullName}
                              {isSelf ? (
                                <span className="tabla-portal__vos">
                                  {t("list.you")}
                                </span>
                              ) : null}
                            </span>
                          )}
                        </td>

                        <td data-label={t("fields.email")}>
                          {editing ? (
                            <>
                              <label
                                className="visually-hidden"
                                htmlFor="portal-editar-correo"
                              >
                                {t("edit.emailLabel")}
                              </label>
                              <input
                                className="field__control"
                                form={EDIT_FORM_ID}
                                id="portal-editar-correo"
                                name="email"
                                type="email"
                                value={editEmail}
                                onChange={(event) =>
                                  setEditEmail(event.target.value)
                                }
                                maxLength={254}
                                autoComplete="off"
                                autoCapitalize="none"
                                spellCheck={false}
                                aria-invalid={
                                  editErrors.email ? true : undefined
                                }
                                aria-describedby={
                                  editErrors.email
                                    ? "portal-editar-correo-error"
                                    : undefined
                                }
                              />
                              {editErrors.email ? (
                                <p
                                  className="field__error"
                                  id="portal-editar-correo-error"
                                >
                                  {editErrors.email}
                                </p>
                              ) : null}
                            </>
                          ) : (
                            user.email
                          )}
                        </td>

                        <td data-label={t("fields.status")}>
                          <span
                            className={
                              user.isActive
                                ? "portal-estado portal-estado--activa"
                                : "portal-estado portal-estado--inactiva"
                            }
                          >
                            {user.isActive
                              ? t("status.active")
                              : t("status.inactive")}
                          </span>
                          {user.isActive ? null : (
                            <span className="tabla-portal__aviso">
                              {t("status.inactiveNote")}
                            </span>
                          )}
                        </td>

                        <td data-label={t("fields.actions")}>
                          {editing ? (
                            <div className="portal-usuarios__acciones">
                              <button
                                className="btn btn--sm"
                                form={EDIT_FORM_ID}
                                type="submit"
                                disabled={busy}
                              >
                                {busy ? t("edit.saving") : t("edit.save")}
                              </button>
                              <button
                                className="btn btn--ghost btn--sm"
                                type="button"
                                onClick={cancelEdit}
                                disabled={busy}
                              >
                                {t("edit.cancel")}
                              </button>
                            </div>
                          ) : confirming ? (
                            <div className="portal-usuarios__confirmar">
                              <p className="portal-usuarios__pregunta">
                                {t("deactivate.question", {
                                  name: user.fullName,
                                })}
                              </p>
                              <div className="portal-usuarios__acciones">
                                <button
                                  className="btn btn--sm"
                                  type="button"
                                  onClick={() => void onToggleActive(user, false)}
                                  disabled={busy}
                                >
                                  {busy
                                    ? t("deactivate.working")
                                    : t("deactivate.confirm")}
                                </button>
                                <button
                                  className="btn btn--ghost btn--sm"
                                  type="button"
                                  onClick={() => setConfirmingId(null)}
                                  disabled={busy}
                                >
                                  {t("deactivate.cancel")}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="portal-usuarios__acciones">
                              <button
                                className="btn btn--ghost btn--sm"
                                type="button"
                                onClick={() => startEdit(user)}
                                disabled={busy}
                              >
                                {t("edit.action")}
                              </button>

                              {user.isActive ? (
                                <button
                                  className="btn btn--ghost btn--sm"
                                  type="button"
                                  onClick={() => {
                                    setEditingId(null);
                                    setConfirmingId(user.id);
                                  }}
                                  disabled={busy || isSelf}
                                >
                                  {t("deactivate.action")}
                                </button>
                              ) : (
                                <button
                                  className="btn btn--ghost btn--sm"
                                  type="button"
                                  onClick={() => void onToggleActive(user, true)}
                                  disabled={busy}
                                >
                                  {busy
                                    ? t("activate.working")
                                    : t("activate.action")}
                                </button>
                              )}

                              {isSelf && user.isActive ? (
                                <span className="tabla-portal__aviso">
                                  {t("deactivate.selfNote")}
                                </span>
                              ) : null}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <form id={EDIT_FORM_ID} onSubmit={onSaveEdit} noValidate />
          </>
        ) : null}
      </section>
    </div>
  );
}
