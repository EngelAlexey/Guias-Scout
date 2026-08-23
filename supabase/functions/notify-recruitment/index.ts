import {
  createClient,
  type SupabaseClient,
} from "npm:@supabase/supabase-js@2.110.0";

const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8" };
const NOTIFICATION_TABLE = "recruitment_email_notifications";

type SubmissionType = "minor" | "volunteer";
type NotificationStatus = "pending" | "processing" | "sent" | "failed";

type NotificationRecord = {
  id: string;
  submission_type: SubmissionType;
  submission_id: string;
  status: NotificationStatus;
  attempt_count: number;
  max_attempts: number;
};

type NotificationRow = NotificationRecord & {
  provider_message_id: string | null;
  last_error: string | null;
  processing_started_at: string | null;
  sent_at: string | null;
  created_at: string;
  updated_at: string;
};

type MinorSubmissionRow = {
  id: string;
  minor_name: string;
  birth_date: string;
  guardian_name: string;
  phone: string;
  email: string;
  section_interest: string | null;
  message: string | null;
  consent: boolean;
  created_at: string;
};

type VolunteerSubmissionRow = {
  id: string;
  full_name: string;
  phone: string;
  email: string;
  role_interest: string;
  motivation: string;
  consent: boolean;
  created_at: string;
};

type TableDefinition<Row> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

type Database = {
  public: {
    Tables: {
      minor_enrollment_submissions: TableDefinition<MinorSubmissionRow>;
      volunteer_submissions: TableDefinition<VolunteerSubmissionRow>;
      recruitment_email_notifications: TableDefinition<NotificationRow>;
    };
    Views: { [_ in never]: never };
    Functions: {
      claim_recruitment_email_notification: {
        Args: { notification_id: string };
        Returns: NotificationRow[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

type WebhookPayload = {
  type: "INSERT" | "UPDATE";
  table: string;
  schema: string;
  record: NotificationRecord;
  old_record: NotificationRecord | null;
};

type ClaimedNotification = NotificationRow;

type EmailContent = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

type SupabaseAdminClient = SupabaseClient<Database>;

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: JSON_HEADERS,
  });
}

function getRequiredEnv(name: string) {
  const value = Deno.env.get(name)?.trim();
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function getSupabaseSecretKey() {
  const secretKeys = Deno.env.get("SUPABASE_SECRET_KEYS");
  if (secretKeys) {
    const parsed = JSON.parse(secretKeys) as Record<string, string>;
    const defaultKey = parsed.default ?? Object.values(parsed)[0];
    if (defaultKey) return defaultKey;
  }

  return getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
}

function safeEqual(left: string, right: string) {
  const leftBytes = new TextEncoder().encode(left);
  const rightBytes = new TextEncoder().encode(right);
  if (leftBytes.length !== rightBytes.length) return false;

  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

function isNotificationRecord(value: unknown): value is NotificationRecord {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return (
    typeof record.id === "string" &&
    (record.submission_type === "minor" ||
      record.submission_type === "volunteer") &&
    typeof record.submission_id === "string" &&
    (record.status === "pending" ||
      record.status === "processing" ||
      record.status === "sent" ||
      record.status === "failed") &&
    typeof record.attempt_count === "number" &&
    typeof record.max_attempts === "number"
  );
}

function isWebhookPayload(value: unknown): value is WebhookPayload {
  if (typeof value !== "object" || value === null) return false;
  const payload = value as Record<string, unknown>;
  return (
    (payload.type === "INSERT" || payload.type === "UPDATE") &&
    payload.table === NOTIFICATION_TABLE &&
    payload.schema === "public" &&
    isNotificationRecord(payload.record)
  );
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function escapeHtmlWithBreaks(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, "<br>");
}

function displayValue(value: unknown) {
  return typeof value === "string" && value.trim() !== ""
    ? value.trim()
    : "No indicado";
}

function formatDate(value: unknown) {
  if (typeof value !== "string") return "No indicada";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No indicada";
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Costa_Rica",
  }).format(date);
}

function formatBirthDate(value: unknown) {
  if (typeof value !== "string") return "No indicada";
  const date = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(date.getTime())) return "No indicada";
  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "long",
    timeZone: "America/Costa_Rica",
  }).format(date);
}

function validRecipient(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function renderEmail(
  eyebrow: string,
  title: string,
  intro: string,
  recipientName: string,
  recipientEmail: string,
  rows: Array<[label: string, value: string]>,
  submissionId: string,
): EmailContent {
  const textRows = rows.map(([label, value]) => `${label}: ${value}`);
  const htmlRows = rows
    .map(([label, value], index) => {
      const border = index === rows.length - 1
        ? ""
        : "border-bottom:1px solid #ece6dc;";
      return [
        "<tr>",
        `<th class="field-label" align="left" valign="top" width="38%" style="${border}padding:16px 18px 16px 0;color:#675a80;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.2px;line-height:1.45;text-transform:uppercase;">${
          escapeHtml(label)
        }</th>`,
        `<td class="field-value" align="left" valign="top" style="${border}padding:15px 0;color:#2e1a47;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;font-weight:600;line-height:1.55;overflow-wrap:anywhere;">${
          escapeHtmlWithBreaks(value)
        }</td>`,
        "</tr>",
      ].join("");
    })
    .join("");

  const safeEyebrow = escapeHtml(eyebrow);
  const safeTitle = escapeHtml(title);
  const safeIntro = escapeHtml(intro);
  const safeName = escapeHtml(recipientName);
  const safeSubmissionId = escapeHtml(submissionId);

  return {
    to: recipientEmail,
    subject: `${title} | Grupo 35 Esparzol`,
    text: [
      `Hola ${recipientName},`,
      "",
      intro,
      "Este es el comprobante de los datos que recibimos:",
      "",
      ...textRows,
      "",
      `Número de comprobante: ${submissionId}`,
      "La Junta de Grupo dará seguimiento a tu solicitud.",
      "Si necesitás corregir algún dato, respondé a este correo.",
    ].join("\n"),
    html: [
      "<!doctype html>",
      '<html lang="es">',
      "<head>",
      '<meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      `<title>${safeTitle}</title>`,
      "<style>",
      "@media only screen and (max-width:620px){.email-shell{width:100%!important}.email-pad{padding-left:22px!important;padding-right:22px!important}.field-label,.field-value{display:block!important;width:100%!important;box-sizing:border-box!important}.field-label{padding-bottom:4px!important;border-bottom:0!important}.field-value{padding-top:0!important}.receipt-id{font-size:12px!important}}",
      "</style>",
      "</head>",
      '<body style="margin:0;padding:0;background:#faf8f3;color:#2e1a47;">',
      `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${safeIntro} Este es tu comprobante.</div>`,
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#faf8f3;border-collapse:collapse;">',
      '<tr><td align="center" style="padding:28px 12px;">',
      '<table role="presentation" class="email-shell" width="600" cellspacing="0" cellpadding="0" border="0" style="width:600px;max-width:600px;background:#ffffff;border:1px solid #efe9df;border-radius:20px;border-collapse:separate;overflow:hidden;box-shadow:0 12px 36px rgba(46,26,71,.10);">',
      '<tr><td style="padding:0;line-height:0;">',
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;"><tr>',
      '<td width="25%" height="7" style="height:7px;background:#f4b400;font-size:0;line-height:0;">&nbsp;</td>',
      '<td width="25%" height="7" style="height:7px;background:#43a047;font-size:0;line-height:0;">&nbsp;</td>',
      '<td width="25%" height="7" style="height:7px;background:#1e88e5;font-size:0;line-height:0;">&nbsp;</td>',
      '<td width="25%" height="7" style="height:7px;background:#e53935;font-size:0;line-height:0;">&nbsp;</td>',
      "</tr></table>",
      "</td></tr>",
      '<tr><td class="email-pad" style="padding:24px 34px;background:#2e1a47;">',
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;"><tr>',
      '<td width="52" valign="middle"><div style="width:44px;height:44px;border:2px solid #ffffff;border-radius:50%;color:#ffffff;font-family:\'Segoe UI\',Arial,sans-serif;font-size:17px;font-weight:800;line-height:44px;text-align:center;">35</div></td>',
      '<td valign="middle" style="padding-left:12px;"><p style="margin:0;color:#ffffff;font-family:\'Segoe UI\',Arial,sans-serif;font-size:18px;font-weight:800;line-height:1.2;">Grupo 35 Esparzol</p><p style="margin:4px 0 0;color:#d9ceea;font-family:\'Segoe UI\',Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:1.6px;line-height:1.2;text-transform:uppercase;">Guías y Scouts de Costa Rica</p></td>',
      "</tr></table>",
      "</td></tr>",
      '<tr><td class="email-pad" style="padding:34px 38px 12px;">',
      '<table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr><td style="border-radius:999px;padding:7px 12px;background:#e8f3ec;color:#1f6e44;font-family:\'Segoe UI\',Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:1px;line-height:1;text-transform:uppercase;">&#10003;&nbsp; Solicitud recibida</td></tr></table>',
      `<p style="margin:22px 0 0;color:#2e7d4f;font-family:'Segoe UI',Arial,sans-serif;font-size:11px;font-weight:800;letter-spacing:1.5px;line-height:1.4;text-transform:uppercase;">${safeEyebrow}</p>`,
      `<h1 style="margin:7px 0 0;color:#2e1a47;font-family:'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:800;letter-spacing:-.5px;line-height:1.18;">${safeTitle}</h1>`,
      `<p style="margin:20px 0 0;color:#2e1a47;font-family:'Segoe UI',Arial,sans-serif;font-size:17px;font-weight:700;line-height:1.55;">Hola ${safeName},</p>`,
      `<p style="margin:8px 0 0;color:#5b5169;font-family:'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.65;">${safeIntro} Guardá este correo como comprobante.</p>`,
      "</td></tr>",
      '<tr><td class="email-pad" style="padding:22px 38px 8px;">',
      "<p style=\"margin:0;color:#2e1a47;font-family:'Segoe UI',Arial,sans-serif;font-size:18px;font-weight:800;line-height:1.3;\">Datos enviados</p>",
      "<p style=\"margin:5px 0 0;color:#675a80;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;line-height:1.5;\">Esta es la información que recibimos desde el formulario.</p>",
      `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;margin-top:12px;border-collapse:collapse;">${htmlRows}</table>`,
      "</td></tr>",
      '<tr><td class="email-pad" style="padding:22px 38px 0;">',
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border:1px solid #c6b6de;border-radius:14px;border-collapse:separate;background:#f1ecfa;"><tr><td style="padding:17px 18px;">',
      "<p style=\"margin:0;color:#5b2d8e;font-family:'Segoe UI',Arial,sans-serif;font-size:10px;font-weight:800;letter-spacing:1.3px;line-height:1.4;text-transform:uppercase;\">Número de comprobante</p>",
      `<p class="receipt-id" style="margin:6px 0 0;color:#2e1a47;font-family:Consolas,'Courier New',monospace;font-size:13px;font-weight:700;line-height:1.5;overflow-wrap:anywhere;">${safeSubmissionId}</p>`,
      "</td></tr></table>",
      "</td></tr>",
      '<tr><td class="email-pad" style="padding:20px 38px 38px;">',
      '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;border-radius:14px;border-collapse:separate;background:#e8f3ec;"><tr><td width="42" valign="top" style="padding:18px 0 18px 18px;color:#1f6e44;font-family:Arial,sans-serif;font-size:22px;line-height:1;">&#8594;</td><td style="padding:17px 18px 17px 8px;"><p style="margin:0;color:#1f6e44;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;font-weight:800;line-height:1.4;">¿Qué sigue?</p><p style="margin:4px 0 0;color:#315d45;font-family:\'Segoe UI\',Arial,sans-serif;font-size:13px;line-height:1.55;">La Junta de Grupo dará seguimiento a tu solicitud. Si necesitás corregir algún dato, respondé a este correo.</p></td></tr></table>',
      "</td></tr>",
      '<tr><td class="email-pad" align="center" style="padding:22px 38px 26px;border-top:1px solid #ece6dc;background:#faf8f3;">',
      "<p style=\"margin:0;color:#675a80;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;line-height:1.55;\">Comprobante automático y privado del formulario de reclutamiento.</p>",
      "<p style=\"margin:5px 0 0;color:#2e1a47;font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:800;line-height:1.4;\">Grupo 35 Esparzol</p>",
      "</td></tr>",
      "</table>",
      "</td></tr>",
      "</table>",
      "</body>",
      "</html>",
    ].join(""),
  };
}

async function loadEmailContent(
  supabase: SupabaseAdminClient,
  notification: ClaimedNotification,
) {
  if (notification.submission_type === "minor") {
    const { data, error } = await supabase
      .from("minor_enrollment_submissions")
      .select(
        "id, minor_name, birth_date, guardian_name, phone, email, section_interest, message, consent, created_at",
      )
      .eq("id", notification.submission_id)
      .single();

    if (error || !data) throw new Error("Minor submission was not found");
    if (!validRecipient(data.email)) {
      throw new Error("Minor submission has an invalid recipient email");
    }

    const sections: Record<string, string> = {
      manada: "Manada",
      tropa: "Tropa",
      wak: "Wak",
      comunidad: "Comunidad",
    };

    return renderEmail(
      "Inscripción",
      "Confirmación de solicitud de inscripción",
      "Recibimos correctamente tu solicitud de inscripción para una persona menor.",
      data.guardian_name,
      data.email,
      [
        ["Persona menor", displayValue(data.minor_name)],
        ["Fecha de nacimiento", formatBirthDate(data.birth_date)],
        ["Persona encargada", displayValue(data.guardian_name)],
        ["Teléfono", displayValue(data.phone)],
        ["Correo", displayValue(data.email)],
        [
          "Sección de interés",
          sections[String(data.section_interest)] ?? "No indicada",
        ],
        ["Mensaje", displayValue(data.message)],
        ["Consentimiento registrado", data.consent ? "Sí" : "No"],
        ["Recibida", formatDate(data.created_at)],
      ],
      notification.submission_id,
    );
  }

  const { data, error } = await supabase
    .from("volunteer_submissions")
    .select(
      "id, full_name, phone, email, role_interest, motivation, consent, created_at",
    )
    .eq("id", notification.submission_id)
    .single();

  if (error || !data) throw new Error("Volunteer submission was not found");
  if (!validRecipient(data.email)) {
    throw new Error("Volunteer submission has an invalid recipient email");
  }

  const roles: Record<string, string> = {
    leader: "Persona dirigente",
    collab: "Colaboraciones puntuales",
    band: "Banda Artística Juvenil",
    notSure: "Todavía no lo sabe",
  };

  return renderEmail(
    "Voluntariado",
    "Confirmación de solicitud de voluntariado",
    "Recibimos correctamente tu solicitud para formar parte del voluntariado.",
    data.full_name,
    data.email,
    [
      ["Nombre", displayValue(data.full_name)],
      ["Teléfono", displayValue(data.phone)],
      ["Correo", displayValue(data.email)],
      [
        "Interés",
        roles[String(data.role_interest)] ?? "No indicado",
      ],
      ["Motivación", displayValue(data.motivation)],
      ["Consentimiento registrado", data.consent ? "Sí" : "No"],
      ["Recibida", formatDate(data.created_at)],
    ],
    notification.submission_id,
  );
}

async function sendWithResend(content: EmailContent) {
  const apiKey = getRequiredEnv("RESEND_API_KEY");
  const from = getRequiredEnv("RESEND_FROM");
  const testRecipient = Deno.env.get("RESEND_TEST_RECIPIENT")?.trim();
  const replyTo = Deno.env.get("RECRUITMENT_REPLY_TO")?.trim();
  if (testRecipient && !validRecipient(testRecipient)) {
    throw new Error("RESEND_TEST_RECIPIENT is not a valid email address");
  }

  const recipient = testRecipient || content.to;
  const testing = Boolean(testRecipient);
  const body: Record<string, unknown> = {
    from,
    to: [recipient],
    subject: testing ? `[PRUEBA] ${content.subject}` : content.subject,
    text: content.text,
    html: content.html,
    tags: [
      { name: "category", value: "recruitment-confirmation" },
      { name: "environment", value: testing ? "test" : "production" },
    ],
  };

  if (replyTo) body.reply_to = [replyTo];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "User-Agent": "Grupo35-Recruitment/1.0",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`Resend returned HTTP ${response.status}`);
  }

  const result = (await response.json()) as { id?: string };
  return result.id ?? null;
}

function errorMessage(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return message.slice(0, 500);
}

async function markAsFailed(
  supabase: SupabaseAdminClient,
  notificationId: string,
  error: unknown,
) {
  const { error: updateError } = await supabase
    .from(NOTIFICATION_TABLE)
    .update({
      status: "failed",
      last_error: errorMessage(error),
      updated_at: new Date().toISOString(),
    })
    .eq("id", notificationId);

  if (updateError) {
    console.error("Unable to mark recruitment email as failed", {
      code: updateError.code,
    });
  }
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return json({ ok: false, error: "method_not_allowed" }, 405);
  }

  const expectedSecret = Deno.env.get("RECRUITMENT_WEBHOOK_SECRET") ?? "";
  const providedSecret = request.headers.get("x-webhook-secret") ?? "";
  if (!expectedSecret || !safeEqual(expectedSecret, providedSecret)) {
    return json({ ok: false, error: "unauthorized" }, 401);
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, error: "invalid_json" }, 400);
  }

  if (!isWebhookPayload(payload)) {
    return json({ ok: false, error: "invalid_payload" }, 400);
  }

  if (
    payload.record.status !== "pending" && payload.record.status !== "failed"
  ) {
    return json({ ok: true, result: "ignored_status" });
  }

  const supabase = createClient<Database>(
    getRequiredEnv("SUPABASE_URL"),
    getSupabaseSecretKey(),
    {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    },
  );

  const { data: claimData, error: claimError } = await supabase.rpc(
    "claim_recruitment_email_notification",
    { notification_id: payload.record.id },
  );

  if (claimError) {
    console.error("Unable to claim recruitment email", {
      code: claimError.code,
    });
    return json({ ok: false, error: "claim_failed" }, 500);
  }

  const notification = (Array.isArray(claimData) ? claimData[0] : claimData) as
    | ClaimedNotification
    | undefined;
  if (!notification) {
    return json({ ok: true, result: "already_processed" });
  }

  try {
    const retryDelay = Math.max(0, notification.attempt_count - 1) * 1_000;
    if (retryDelay > 0) {
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }

    const content = await loadEmailContent(supabase, notification);
    const providerMessageId = await sendWithResend(content);
    const { error: updateError } = await supabase
      .from(NOTIFICATION_TABLE)
      .update({
        status: "sent",
        provider_message_id: providerMessageId,
        last_error: null,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", notification.id);

    if (updateError) throw new Error("Unable to record successful delivery");

    return json({ ok: true, result: "sent" });
  } catch (error) {
    console.error("Recruitment email delivery failed", {
      notificationId: notification.id,
      attempt: notification.attempt_count,
      error: errorMessage(error),
    });
    await markAsFailed(supabase, notification.id, error);
    return json({ ok: false, error: "delivery_failed" }, 502);
  }
});
