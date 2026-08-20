import { NextResponse } from "next/server";

import { createAuthUser, deleteAuthUser } from "@/lib/portal/auth-users";
import { createTemporaryPassword } from "@/lib/portal/passwords";
import { getPortalSession } from "@/lib/portal/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

type PortalUserRow = {
  id: string;
  full_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  auth_user_id: string | null;
  must_change_password: boolean;
};

type PortalUserUpdate = {
  full_name?: string;
  email?: string;
  is_active?: boolean;
  updated_at: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const UNIQUE_VIOLATION = "23505";

function isObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function invalidRequest() {
  return NextResponse.json(
    { ok: false, error: "invalid_request" },
    { status: 400 },
  );
}

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "unauthorized" },
    { status: 401 },
  );
}

function notFound() {
  return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 });
}

function conflict(error: "email_taken" | "self_deactivation") {
  return NextResponse.json({ ok: false, error }, { status: 409 });
}

function storageError() {
  return NextResponse.json(
    { ok: false, error: "storage_error" },
    { status: 500 },
  );
}

function serviceUnavailable() {
  return NextResponse.json(
    { ok: false, error: "service_unavailable" },
    { status: 503 },
  );
}

function readFullName(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().replace(/\s+/g, " ");
  return normalized.length >= 1 && normalized.length <= 160 ? normalized : null;
}

function readEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toLowerCase();
  if (normalized.length < 3 || normalized.length > 254) return null;
  return EMAIL_PATTERN.test(normalized) ? normalized : null;
}

async function readBody(request: Request): Promise<JsonObject | null> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > 8_192) return null;

  try {
    const body: unknown = await request.json();
    return isObject(body) ? body : null;
  } catch {
    return null;
  }
}

function toItem(row: PortalUserRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    isActive: row.is_active === true,
    createdAt: row.created_at,
    hasAccount: row.auth_user_id !== null,
    mustChangePassword: row.must_change_password === true,
  };
}

function logFailure(scope: string, error: { code?: string; message: string }) {
  console.error(scope, { code: error.code, message: error.message });
}

export async function GET() {
  try {
    const session = await getPortalSession();
    if (!session) return unauthorized();

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("portal_users")
      .select(
        "id, full_name, email, is_active, created_at, auth_user_id, must_change_password",
      )
      .order("full_name", { ascending: true });

    if (error) {
      logFailure("Portal users listing failed", error);
      return storageError();
    }

    return NextResponse.json({
      ok: true,
      items: ((data ?? []) as PortalUserRow[]).map(toItem),
    });
  } catch (error) {
    console.error("Portal users listing unavailable", error);
    return serviceUnavailable();
  }
}

export async function POST(request: Request) {
  try {
    const session = await getPortalSession();
    if (!session) return unauthorized();

    const body = await readBody(request);
    if (!body) return invalidRequest();

    const fullName = readFullName(body.fullName);
    const email = readEmail(body.email);
    if (!fullName || !email) return invalidRequest();

    const supabase = createSupabaseServerClient();
    const { data: existing, error: lookupError } = await supabase
      .from("portal_users")
      .select("id")
      .ilike("email", email)
      .maybeSingle();

    if (lookupError) {
      logFailure("Portal users lookup failed", lookupError);
      return storageError();
    }

    if (existing) return conflict("email_taken");

    const temporaryPassword = createTemporaryPassword();
    const authUserId = await createAuthUser(supabase, email, temporaryPassword);

    const { data, error } = await supabase
      .from("portal_users")
      .insert({
        full_name: fullName,
        email,
        auth_user_id: authUserId,
        must_change_password: true,
      })
      .select("id")
      .single();

    if (error) {
      try {
        await deleteAuthUser(supabase, authUserId);
      } catch (cleanupError) {
        console.error("Portal user cleanup failed", cleanupError);
      }

      if (error.code === UNIQUE_VIOLATION) return conflict("email_taken");
      logFailure("Portal user creation failed", error);
      return storageError();
    }

    return NextResponse.json(
      { ok: true, id: data.id as string, temporaryPassword },
      { status: 201 },
    );
  } catch (error) {
    console.error("Portal user creation unavailable", error);
    return serviceUnavailable();
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getPortalSession();
    if (!session) return unauthorized();

    const body = await readBody(request);
    if (!body) return invalidRequest();

    const id = typeof body.id === "string" ? body.id.trim() : "";
    if (!UUID_PATTERN.test(id)) return invalidRequest();

    const update: PortalUserUpdate = { updated_at: new Date().toISOString() };

    if (body.fullName !== undefined) {
      const fullName = readFullName(body.fullName);
      if (!fullName) return invalidRequest();
      update.full_name = fullName;
    }

    if (body.email !== undefined) {
      const email = readEmail(body.email);
      if (!email) return invalidRequest();
      update.email = email;
    }

    if (body.isActive !== undefined) {
      if (typeof body.isActive !== "boolean") return invalidRequest();
      if (body.isActive === false && id === session.id) {
        return conflict("self_deactivation");
      }
      update.is_active = body.isActive;
    }

    if (
      update.full_name === undefined &&
      update.email === undefined &&
      update.is_active === undefined
    ) {
      return invalidRequest();
    }

    const supabase = createSupabaseServerClient();

    if (update.email !== undefined) {
      const { data: existing, error: lookupError } = await supabase
        .from("portal_users")
        .select("id")
        .ilike("email", update.email)
        .neq("id", id)
        .maybeSingle();

      if (lookupError) {
        logFailure("Portal users lookup failed", lookupError);
        return storageError();
      }

      if (existing) return conflict("email_taken");
    }

    const { data, error } = await supabase
      .from("portal_users")
      .update(update)
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      if (error.code === UNIQUE_VIOLATION) return conflict("email_taken");
      logFailure("Portal user update failed", error);
      return storageError();
    }

    if (!data) return notFound();

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portal user update unavailable", error);
    return serviceUnavailable();
  }
}
