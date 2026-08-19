import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

import {
  PORTAL_SESSION_COOKIE,
  PORTAL_SESSION_MAX_AGE,
} from "@/lib/portal/cookie";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export { PORTAL_SESSION_COOKIE, PORTAL_SESSION_MAX_AGE };

export type PortalSession = {
  id: string;
  email: string;
  fullName: string;
};

type TokenPayload = {
  sub: string;
  exp: number;
};

function getSessionSecret() {
  const secret = process.env.PORTAL_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "Falta PORTAL_SESSION_SECRET o es muy corta (minimo 32 caracteres).",
    );
  }

  return secret;
}

function toBase64Url(value: Buffer | string) {
  return Buffer.from(value).toString("base64url");
}

function sign(payload: string) {
  return createHmac("sha256", getSessionSecret()).update(payload).digest();
}

export function createPortalSessionToken(userId: string, nowMs = Date.now()) {
  const payload: TokenPayload = {
    sub: userId,
    exp: Math.floor(nowMs / 1000) + PORTAL_SESSION_MAX_AGE,
  };

  const encoded = toBase64Url(JSON.stringify(payload));
  return `${encoded}.${toBase64Url(sign(encoded))}`;
}

function verifyToken(token: string, nowMs = Date.now()): TokenPayload | null {
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return null;

  const expected = sign(encoded);
  const received = Buffer.from(signature, "base64url");

  // timingSafeEqual exige el mismo largo antes de comparar.
  if (received.length !== expected.length) return null;
  if (!timingSafeEqual(received, expected)) return null;

  let payload: TokenPayload;
  try {
    payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
  } catch {
    return null;
  }

  if (typeof payload?.sub !== "string" || typeof payload?.exp !== "number") {
    return null;
  }

  if (payload.exp * 1000 <= nowMs) return null;

  return payload;
}

export function portalSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PORTAL_SESSION_MAX_AGE,
  };
}

/**
 * Unica fuente de verdad de la sesion del portal.
 *
 * Devuelve null si no hay cookie, si la firma no cuadra, si vencio, si la
 * persona ya no existe o si esta desactivada. Cada llamada revisa `is_active`,
 * asi que desactivar a alguien la saca del portal en la siguiente pagina que
 * abra, sin esperar a que venza su sesion.
 */
export async function getPortalSession(): Promise<PortalSession | null> {
  const token = (await cookies()).get(PORTAL_SESSION_COOKIE)?.value;
  if (!token) return null;

  // Nada de lo que pase aca adentro debe tumbar una pagina: si falta una
  // variable o la base no responde, la respuesta correcta es "no hay sesion",
  // que manda a la pantalla de acceso en vez de a un error 500.
  try {
    const payload = verifyToken(token);
    if (!payload) return null;

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from("portal_users")
      .select("id, email, full_name, is_active")
      .eq("id", payload.sub)
      .maybeSingle();

    if (error) {
      console.error("Portal session lookup failed", {
        code: error.code,
        message: error.message,
      });
      return null;
    }

    if (!data || data.is_active !== true) return null;

    return {
      id: data.id as string,
      email: data.email as string,
      fullName: data.full_name as string,
    };
  } catch (error) {
    console.error("Portal session unavailable", error);
    return null;
  }
}

/** Igual que getPortalSession, pero sin sesion valida no sigue adelante. */
export async function requirePortalSession(): Promise<PortalSession> {
  const session = await getPortalSession();
  if (!session) throw new Error("unauthorized");
  return session;
}
