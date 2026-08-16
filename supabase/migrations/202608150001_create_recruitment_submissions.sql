create table if not exists public.minor_enrollment_submissions (
  id uuid primary key default gen_random_uuid(),
  minor_name text not null check (char_length(minor_name) between 1 and 160),
  birth_date date not null check (birth_date <= current_date),
  guardian_name text not null check (char_length(guardian_name) between 1 and 160),
  phone text not null check (char_length(phone) between 7 and 25),
  email text check (email is null or char_length(email) <= 254),
  section_interest text check (
    section_interest is null or
    section_interest in ('manada', 'tropa', 'wak', 'comunidad')
  ),
  message text check (message is null or char_length(message) <= 2000),
  consent boolean not null check (consent = true),
  consented_at timestamptz not null default now(),
  status text not null default 'pending' check (
    status in ('pending', 'contacted', 'accepted', 'rejected', 'archived')
  ),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.volunteer_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 160),
  phone text not null check (char_length(phone) between 7 and 25),
  email text check (email is null or char_length(email) <= 254),
  role_interest text not null check (
    role_interest in ('leader', 'collab', 'band', 'notSure')
  ),
  motivation text not null check (char_length(motivation) between 1 and 2000),
  consent boolean not null check (consent = true),
  consented_at timestamptz not null default now(),
  status text not null default 'pending' check (
    status in ('pending', 'contacted', 'accepted', 'rejected', 'archived')
  ),
  source text not null default 'website',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.minor_enrollment_submissions is
  'Solicitudes privadas de inscripción de personas menores recibidas desde el sitio.';
comment on table public.volunteer_submissions is
  'Solicitudes privadas de voluntariado recibidas desde el sitio.';

alter table public.minor_enrollment_submissions enable row level security;
alter table public.volunteer_submissions enable row level security;

revoke all on table public.minor_enrollment_submissions from anon, authenticated;
revoke all on table public.volunteer_submissions from anon, authenticated;

grant select, insert, update, delete on table public.minor_enrollment_submissions to service_role;
grant select, insert, update, delete on table public.volunteer_submissions to service_role;

-- No se crean políticas públicas. Solo el backend, mediante la clave secreta,
-- puede guardar o consultar estos datos personales.
