import { NextResponse } from "next/server";

import { createAuthUser, setAuthPassword } from "@/lib/portal/auth-users";
import { createTemporaryPassword } from "@/lib/portal/passwords";
import { getPortalSession } from "@/lib/portal/session";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  try {
    const session = await getPortalSession();
    if (!session) {
      return NextResponse.json(
        { ok: false, error: "unauthorized" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: "invalid_request" },
        { status: 400 },
      );
    }

    const id =
      typeof body === "object" && body !== null
        ? String((body as Record<string, unknown>).id ?? "").trim()
        : "";

    if (!UUID_PATTERN.test(id)) {
      return NextResponse.json(
        { ok: false, error: "invalid_request" },
        { status: 400 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data: person, error: lookupError } = await supabase
      .from("portal_users")
      .select("id, email, auth_user_id")
      .eq("id", id)
      .maybeSingle();

    if (lookupError) {
      console.error("Portal password reset lookup failed", {
        code: lookupError.code,
        message: lookupError.message,
      });
      return NextResponse.json(
        { ok: false, error: "storage_error" },
        { status: 500 },
      );
    }

    if (!person) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }

    const temporaryPassword = createTemporaryPassword();
    const email = (person.email as string).toLowerCase();
    let authUserId = (person.auth_user_id as string | null) ?? null;

    if (authUserId) {
      await setAuthPassword(supabase, authUserId, temporaryPassword);
    } else {
      authUserId = await createAuthUser(supabase, email, temporaryPassword);
    }

    const { error } = await supabase
      .from("portal_users")
      .update({
        auth_user_id: authUserId,
        must_change_password: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      console.error("Portal password reset failed", {
        code: error.code,
        message: error.message,
      });
      return NextResponse.json(
        { ok: false, error: "storage_error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, temporaryPassword });
  } catch (error) {
    console.error("Portal password reset unavailable", error);
    return NextResponse.json(
      { ok: false, error: "service_unavailable" },
      { status: 503 },
    );
  }
}
