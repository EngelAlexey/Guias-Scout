create extension if not exists pg_net with schema extensions;

create or replace function public.dispatch_recruitment_email_notification()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  webhook_url text;
  webhook_secret text;
begin
  select decrypted_secret
  into webhook_url
  from vault.decrypted_secrets
  where name = 'recruitment_email_webhook_url'
  order by created_at desc
  limit 1;

  select decrypted_secret
  into webhook_secret
  from vault.decrypted_secrets
  where name = 'recruitment_email_webhook_secret'
  order by created_at desc
  limit 1;

  if webhook_url is null or webhook_secret is null then
    raise warning 'Recruitment email webhook is not configured in Vault';
    return new;
  end if;

  perform net.http_post(
    url := webhook_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', webhook_secret
    ),
    body := jsonb_build_object(
      'type', TG_OP,
      'table', TG_TABLE_NAME,
      'schema', TG_TABLE_SCHEMA,
      'record', to_jsonb(new),
      'old_record', case
        when TG_OP = 'UPDATE' then to_jsonb(old)
        else 'null'::jsonb
      end
    ),
    timeout_milliseconds := 5000
  );

  return new;
exception
  when others then
    -- El formulario debe poder guardarse aunque el proveedor de correo falle.
    raise warning 'Unable to dispatch recruitment email webhook: %', SQLERRM;
    return new;
end;
$$;

revoke all
  on function public.dispatch_recruitment_email_notification()
  from public, anon, authenticated;

drop trigger if exists dispatch_recruitment_email_notification
  on public.recruitment_email_notifications;
create trigger dispatch_recruitment_email_notification
after insert or update on public.recruitment_email_notifications
for each row
when (new.status in ('pending', 'failed'))
execute function public.dispatch_recruitment_email_notification();

comment on function public.dispatch_recruitment_email_notification() is
  'Invoca de forma asíncrona la Edge Function de correo usando secretos de Vault.';
