do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'recruitment_email_notifications'
      and column_name = 'mailgun_message_id'
  ) and not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'recruitment_email_notifications'
      and column_name = 'provider_message_id'
  ) then
    alter table public.recruitment_email_notifications
      rename column mailgun_message_id to provider_message_id;
  end if;
end;
$$;

alter table public.recruitment_email_notifications
  add column if not exists provider_message_id text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'minor_enrollment_email_required'
      and conrelid = 'public.minor_enrollment_submissions'::regclass
  ) then
    alter table public.minor_enrollment_submissions
      add constraint minor_enrollment_email_required
      check (
        email is not null and
        char_length(btrim(email)) between 3 and 254 and
        position('@' in email) > 1
      ) not valid;
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'volunteer_email_required'
      and conrelid = 'public.volunteer_submissions'::regclass
  ) then
    alter table public.volunteer_submissions
      add constraint volunteer_email_required
      check (
        email is not null and
        char_length(btrim(email)) between 3 and 254 and
        position('@' in email) > 1
      ) not valid;
  end if;
end;
$$;

comment on column public.recruitment_email_notifications.provider_message_id is
  'Identificador del correo transaccional devuelto por Resend.';
