import { NextResponse } from "next/server";

import {
  createPortalSessionToken,
  PORTAL_SESSION_COOKIE,
  portalSessionCookieOptions,
} from "@/lib/portal/session";
import {
  createSupabaseAuthClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

type JsonObject = Record<string, unknown>;

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

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return invalidRequest();
  }

  if (!isObject(body)) return invalidRequest();

  const rawEmail = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const email = rawEmail.toLowerCase();

  if (
    email.length < 3 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 8 ||
    password.length > 128
  ) {
    return invalidRequest();
  }

  try {
    const auth = createSupabaseAuthClient();
    const { data, error } = await auth.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) return unauthorized();

    const supabase = createSupabaseServerClient();
    const { data: person, error: lookupError } = await supabase
      .from("portal_users")
      .select("id, is_active, auth_user_id")
      .eq("email", email)
      .maybeSingle();

    if (lookupError) {
      console.error("Portal login lookup failed", {
        code: lookupError.code,
        message: lookupError.message,
      });
      return NextResponse.json(
        { ok: false, error: "storage_error" },
        { status: 500 },
      );
    }

    if (!person || person.is_active !== true) return unauthorized();

    if (!person.auth_user_id) {
      const { error: linkError } = await supabase
        .from("portal_users")
        .update({ auth_user_id: data.user.id, updated_at: new Date().toISOString() })
        .eq("id", person.id);

      if (linkError) {
        console.error("Portal login could not link auth user", {
          code: linkError.code,
          message: linkError.message,
        });
      }
    }

    const response = NextResponse.json({ ok: true }, { status: 200 });
    response.cookies.set(
      PORTAL_SESSION_COOKIE,
      createPortalSessionToken(person.id as string),
      portalSessionCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error("Portal login configuration failed", error);
    return NextResponse.json(
      { ok: false, error: "service_unavailable" },
      { status: 503 },
    );
  }
}
