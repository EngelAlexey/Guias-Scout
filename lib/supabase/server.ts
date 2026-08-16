import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createSupabaseServerClient(): SupabaseClient {
  const supabaseUrl =
    process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
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
