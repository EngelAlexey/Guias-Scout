param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[a-z0-9]{20}$')]
  [string]$ProjectRef
)

$ErrorActionPreference = 'Stop'

$randomBytes = New-Object byte[] 32
$randomGenerator = [Security.Cryptography.RandomNumberGenerator]::Create()
try {
  $randomGenerator.GetBytes($randomBytes)
} finally {
  $randomGenerator.Dispose()
}
$webhookSecret = -join ($randomBytes | ForEach-Object { $_.ToString('x2') })
$webhookUrl = "https://$ProjectRef.supabase.co/functions/v1/notify-recruitment"

& npx supabase secrets set "RECRUITMENT_WEBHOOK_SECRET=$webhookSecret" `
  --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to set the Edge Function webhook secret.'
}

$escapedSecret = $webhookSecret.Replace("'", "''")
$escapedUrl = $webhookUrl.Replace("'", "''")
$configurationSql = @'
do $configuration$
declare
  webhook_url_id uuid;
  webhook_secret_id uuid;
begin
  select id into webhook_url_id
  from vault.secrets
  where name = 'recruitment_email_webhook_url'
  order by created_at desc
  limit 1;

  if webhook_url_id is null then
    perform vault.create_secret(
      '{0}',
      'recruitment_email_webhook_url',
      'URL de la Edge Function para comprobantes de reclutamiento.'
    );
  else
    perform vault.update_secret(
      webhook_url_id,
      '{0}',
      'recruitment_email_webhook_url',
      'URL de la Edge Function para comprobantes de reclutamiento.'
    );
  end if;

  select id into webhook_secret_id
  from vault.secrets
  where name = 'recruitment_email_webhook_secret'
  order by created_at desc
  limit 1;

  if webhook_secret_id is null then
    perform vault.create_secret(
      '{1}',
      'recruitment_email_webhook_secret',
      'Clave compartida entre la base de datos y notify-recruitment.'
    );
  else
    perform vault.update_secret(
      webhook_secret_id,
      '{1}',
      'recruitment_email_webhook_secret',
      'Clave compartida entre la base de datos y notify-recruitment.'
    );
  end if;
end
$configuration$;
'@ -f $escapedUrl, $escapedSecret

$configurationSql | npx supabase db query --linked --project-ref $ProjectRef
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to save the webhook configuration in Vault.'
}

$migrationPath = Join-Path $PSScriptRoot `
  'migrations\202608210001_create_recruitment_email_webhook.sql'
& npx supabase db query --linked --project-ref $ProjectRef --file $migrationPath
if ($LASTEXITCODE -ne 0) {
  throw 'Unable to install the recruitment email webhook.'
}

Write-Output 'Recruitment email webhook configured successfully.'
