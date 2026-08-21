create table if not exists public.recruitment_email_notifications (
  id uuid primary key default gen_random_uuid(),
  submission_type text not null check (
    submission_type in ('minor', 'volunteer')
  ),
  submission_id uuid not null,
  status text not null default 'pending' check (
    status in ('pending', 'processing', 'sent', 'failed')
  ),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  max_attempts integer not null default 3 check (max_attempts between 1 and 10),
  provider_message_id text,
  last_error text check (last_error is null or char_length(last_error) <= 500),
  processing_started_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (submission_type, submission_id)
);

comment on table public.recruitment_email_notifications is
  'Cola privada y registro de correos generados por solicitudes de reclutamiento.';

alter table public.recruitment_email_notifications enable row level security;

revoke all on table public.recruitment_email_notifications from anon, authenticated;
grant select, insert, update, delete
  on table public.recruitment_email_notifications
  to service_role;

create or replace function public.queue_recruitment_email_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  notification_type text;
begin
  notification_type := case TG_TABLE_NAME
    when 'minor_enrollment_submissions' then 'minor'
    when 'volunteer_submissions' then 'volunteer'
    else null
  end;

  if notification_type is null then
    raise exception 'Unsupported recruitment table: %', TG_TABLE_NAME;
  end if;

  insert into public.recruitment_email_notifications (
    submission_type,
    submission_id
  ) values (
    notification_type,
    new.id
  )
  on conflict (submission_type, submission_id) do nothing;

  return new;
end;
$$;

revoke all on function public.queue_recruitment_email_notification() from public;

drop trigger if exists queue_minor_enrollment_email
  on public.minor_enrollment_submissions;
create trigger queue_minor_enrollment_email
after insert on public.minor_enrollment_submissions
for each row execute function public.queue_recruitment_email_notification();

drop trigger if exists queue_volunteer_email
  on public.volunteer_submissions;
create trigger queue_volunteer_email
after insert on public.volunteer_submissions
for each row execute function public.queue_recruitment_email_notification();

create or replace function public.claim_recruitment_email_notification(
  notification_id uuid
)
returns setof public.recruitment_email_notifications
language sql
security definer
set search_path = ''
as $$
  update public.recruitment_email_notifications
  set
    status = 'processing',
    attempt_count = attempt_count + 1,
    processing_started_at = now(),
    last_error = null,
    updated_at = now()
  where id = notification_id
    and status in ('pending', 'failed')
    and attempt_count < max_attempts
  returning *;
$$;

revoke all
  on function public.claim_recruitment_email_notification(uuid)
  from public, anon, authenticated;
grant execute
  on function public.claim_recruitment_email_notification(uuid)
  to service_role;
