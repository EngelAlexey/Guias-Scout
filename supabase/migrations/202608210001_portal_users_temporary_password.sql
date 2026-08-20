alter table public.portal_users
  add column if not exists must_change_password boolean not null default true;

comment on column public.portal_users.must_change_password is
  'En true la persona entra pero solo puede cambiar su clave: se pone en true al crearla y al restablecerle la clave.';

-- Las filas que ya existian se crearon con clave elegida a mano en Supabase Auth,
-- asi que no hay ninguna clave temporal pendiente de cambiar.
update public.portal_users
  set must_change_password = false
  where created_at < now();
