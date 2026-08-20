import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

const PAGE_SIZE = 200;
const MAX_PAGES = 25;

export async function findAuthUserId(
  supabase: SupabaseClient,
  email: string,
): Promise<string | null> {
  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: PAGE_SIZE,
    });

    if (error) throw error;

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === email,
    );
    if (match) return match.id;

    if (data.users.length < PAGE_SIZE) return null;
  }

  return null;
}

export async function setAuthPassword(
  supabase: SupabaseClient,
  authUserId: string,
  password: string,
) {
  const { error } = await supabase.auth.admin.updateUserById(authUserId, {
    password,
  });

  if (error) throw error;
}

export async function createAuthUser(
  supabase: SupabaseClient,
  email: string,
  password: string,
): Promise<string> {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (!error && data.user) return data.user.id;

  // La cuenta puede existir de antes en Supabase Auth sin fila en el portal.
  const existing = await findAuthUserId(supabase, email);
  if (!existing) throw error ?? new Error("No se pudo crear la cuenta de acceso.");

  await setAuthPassword(supabase, existing, password);
  return existing;
}

export async function deleteAuthUser(
  supabase: SupabaseClient,
  authUserId: string,
) {
  const { error } = await supabase.auth.admin.deleteUser(authUserId);
  if (error) throw error;
}
