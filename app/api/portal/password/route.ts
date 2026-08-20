import { NextResponse } from "next/server";

import { findAuthUserId, setAuthPassword } from "@/lib/portal/auth-users";
import { isValidPassword } from "@/lib/portal/passwords";
import { getPortalSession } from "@/lib/portal/session";
import {
  createSupabaseAuthClient,
  createSupabaseServerClient,
} from "@/lib/supabase/server";

export const runtime = "nodejs";

function invalidRequest() {
  return NextResponse.json(
    { ok: false, error: "invalid_request" },
    { status: 400 },
  );
}

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
      return invalidRequest();
    }

    if (typeof body !== "object" || body === null) return invalidRequest();

    const { currentPassword, newPassword } = body as Record<string, unknown>;

    if (!isValidPassword(currentPassword) || !isValidPassword(newPassword)) {
      return invalidRequest();
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { ok: false, error: "same_password" },
        { status: 409 },
      );
    }

    const auth = createSupabaseAuthClient();
    const { data, error } = await auth.auth.signInWithPassword({
      email: session.email,
      password: currentPassword,
    });

    if (error || !data.user) {
      return NextResponse.json(
        { ok: false, error: "wrong_password" },
        { status: 401 },
      );
    }

    const supabase = createSupabaseServerClient();
    const authUserId =
      session.authUserId ?? (await findAuthUserId(supabase, session.email));

    if (!authUserId) {
      return NextResponse.json(
        { ok: false, error: "not_found" },
        { status: 404 },
      );
    }

    await setAuthPassword(supabase, authUserId, newPassword);

    const { error: updateError } = await supabase
      .from("portal_users")
      .update({
        auth_user_id: authUserId,
        must_change_password: false,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.id);

    if (updateError) {
      console.error("Portal password change failed", {
        code: updateError.code,
        message: updateError.message,
      });
      return NextResponse.json(
        { ok: false, error: "storage_error" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Portal password change unavailable", error);
    return NextResponse.json(
      { ok: false, error: "service_unavailable" },
      { status: 503 },
    );
  }
}
