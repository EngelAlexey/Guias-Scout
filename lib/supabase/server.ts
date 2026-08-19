import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

function getSupabaseUrl() {
  return process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
}

export function createSupabaseServerClient(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error(
      "Faltan SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y SUPABASE_SECRET_KEY.",
    );
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}

/**
 * Cliente para verificar credenciales contra Supabase Auth.
 *
 * Usa la clave publicable, no la secreta: comprobar una clave es justo lo que
 * esa llave puede hacer. Corre en el servidor para que la respuesta con los
 * tokens de Supabase nunca llegue al navegador; la sesion del portal viaja en
 * una cookie propia (`lib/portal/session.ts`).
 */
export function createSupabaseAuthClient(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !publishableKey) {
    throw new Error(
      "Faltan SUPABASE_URL (o NEXT_PUBLIC_SUPABASE_URL) y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }

  return createClient(supabaseUrl, publishableKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
