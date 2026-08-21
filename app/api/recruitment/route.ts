import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const SECTION_IDS = new Set(["manada", "tropa", "wak", "comunidad"]);
const VOLUNTEER_ROLES = new Set(["leader", "collab", "band", "notSure"]);

type JsonObject = Record<string, unknown>;

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredText(
  body: JsonObject,
  field: string,
  maxLength: number,
): string | null {
  const value = body[field];
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maxLength
    ? normalized
    : null;
}

function optionalText(
  body: JsonObject,
  field: string,
  maxLength: number,
): string | null | undefined {
  const value = body[field];
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (normalized === "") return null;
  return normalized.length <= maxLength ? normalized : undefined;
}

function validEmail(value: string | null | undefined) {
  return (
    value === null ||
    (typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  );
}

function validPhone(value: string | null) {
  return Boolean(value && /^[+()\d\s-]{7,25}$/.test(value));
}

function validDate(value: unknown) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00Z`);
  const today = new Date();
  return !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value &&
    date <= today
    ? value
    : null;
}

function validationError() {
  return NextResponse.json(
    { ok: false, error: "invalid_submission" },
    { status: 400 },
  );
}

async function saveMinorSubmission(body: JsonObject) {
  const minorName = requiredText(body, "minorName", 160);
  const birthDate = validDate(body.birthDate);
  const guardianName = requiredText(body, "guardian", 160);
  const phone = requiredText(body, "phone", 25);
  const email = requiredText(body, "email", 254);
  const section = optionalText(body, "section", 32);
  const message = optionalText(body, "message", 2000);

  if (
    !minorName ||
    !birthDate ||
    !guardianName ||
    !validPhone(phone) ||
    !email ||
    !validEmail(email) ||
    section === undefined ||
    (section !== null && !SECTION_IDS.has(section)) ||
    message === undefined ||
    body.consent !== true
  ) {
    return validationError();
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("minor_enrollment_submissions").insert({
    minor_name: minorName,
    birth_date: birthDate,
    guardian_name: guardianName,
    phone,
    email,
    section_interest: section,
    message,
    consent: true,
  });

  if (error) {
    console.error("Supabase minor submission failed", {
      code: error.code,
      message: error.message,
    });
    return NextResponse.json(
      { ok: false, error: "storage_error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

async function saveVolunteerSubmission(body: JsonObject) {
  const name = requiredText(body, "name", 160);
  const phone = requiredText(body, "phone", 25);
  const email = requiredText(body, "email", 254);
  const role = requiredText(body, "role", 32);
  const motivation = requiredText(body, "why", 2000);

  if (
    !name ||
    !validPhone(phone) ||
    !email ||
    !validEmail(email) ||
    !role ||
    !VOLUNTEER_ROLES.has(role) ||
    !motivation ||
    body.consent !== true
  ) {
    return validationError();
  }

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.from("volunteer_submissions").insert({
    full_name: name,
    phone,
    email,
    role_interest: role,
    motivation,
    consent: true,
  });

  if (error) {
    console.error("Supabase volunteer submission failed", {
      code: error.code,
      message: error.message,
    });
    return NextResponse.json(
      { ok: false, error: "storage_error" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 16_384) {
    return NextResponse.json(
      { ok: false, error: "payload_too_large" },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return validationError();
  }

  if (!isObject(body)) return validationError();

  // Campo señuelo: los bots básicos suelen completarlo, las personas no lo ven.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  try {
    if (body.type === "minor") return await saveMinorSubmission(body);
    if (body.type === "volunteer") return await saveVolunteerSubmission(body);
    return validationError();
  } catch (error) {
    console.error("Recruitment submission configuration failed", error);
    return NextResponse.json(
      { ok: false, error: "service_unavailable" },
      { status: 503 },
    );
  }
}
