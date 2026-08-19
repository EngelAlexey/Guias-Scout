-- Portal de encargados (Sprint 4).
-- Personas de la Junta de Grupo que pueden entrar al portal a dar seguimiento
-- a las solicitudes. No hay roles ni permisos por rol: quien entra ve y hace
-- lo mismo que cualquier otra persona encargada. Desactivar es el unico
-- control de acceso.

create table if not exists public.portal_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null check (char_length(full_name) between 1 and 160),
  email text not null unique check (char_length(email) between 3 and 254),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.portal_users is
  'Personas encargadas con acceso al portal. auth_user_id queda en null hasta su primera entrada.';
comment on column public.portal_users.auth_user_id is
  'Id de la cuenta en Supabase Auth. Se llena en la primera entrada al portal.';
comment on column public.portal_users.is_active is
  'En false la persona conserva su fila pero no puede entrar al portal.';

alter table public.portal_users enable row level security;

revoke all on table public.portal_users from anon, authenticated;

grant select, insert, update on table public.portal_users to service_role;

-- Sin politicas publicas: igual que las tablas de solicitudes, solo el backend
-- con la clave secreta puede leer o escribir estos datos.

-- Seguimiento de solicitudes: quien movio el estado por ultima vez y cuando.
alter table public.minor_enrollment_submissions
  add column if not exists reviewed_by uuid references public.portal_users(id),
  add column if not exists reviewed_at timestamptz;

alter table public.volunteer_submissions
  add column if not exists reviewed_by uuid references public.portal_users(id),
  add column if not exists reviewed_at timestamptz;

comment on column public.minor_enrollment_submissions.reviewed_by is
  'Persona encargada que cambio el estado por ultima vez.';
comment on column public.volunteer_submissions.reviewed_by is
  'Persona encargada que cambio el estado por ultima vez.';

-- Las consultas del portal listan por estado y fecha.
create index if not exists minor_enrollment_submissions_status_created_idx
  on public.minor_enrollment_submissions (status, created_at desc);

create index if not exists volunteer_submissions_status_created_idx
  on public.volunteer_submissions (status, created_at desc);
